from __future__ import annotations

import argparse
import json
import math
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import xarray as xr
from dotenv import load_dotenv
from PIL import Image

if __package__ in {None, ""}:
    sys.path.append(str(Path(__file__).resolve().parents[1]))

from data_pipeline.config import (
    BBOX,
    COLOR_STOPS,
    DATASET_ID,
    DATASET_TYPE,
    GRID_FILENAME,
    INITIAL_VIEW,
    LAYER_LABEL,
    METADATA_FILENAME,
    OVERLAY_FILENAME,
    PRODUCT_ID,
    TEMPERATURE_VARIABLE,
    WEB_GRID_URL,
    WEB_METADATA_URL,
    WEB_OVERLAY_URL,
    ensure_directories,
    grid_output_path,
    metadata_output_path,
    overlay_output_path,
    raw_dataset_path,
    raw_download_metadata_path,
)


def _find_coordinate_name(dataset: xr.Dataset, candidates: list[str]) -> str:
    for name in candidates:
        if name in dataset.coords:
            return name
        if name in dataset.variables and dataset[name].ndim == 1:
            return name
    raise KeyError(f"None of the coordinate candidates were present: {candidates}")


def _select_surface_temperature(dataset: xr.Dataset) -> xr.DataArray:
    if TEMPERATURE_VARIABLE not in dataset.data_vars:
        available = ", ".join(dataset.data_vars.keys())
        raise KeyError(f"Expected variable '{TEMPERATURE_VARIABLE}' not found. Available variables: {available}")

    data = dataset[TEMPERATURE_VARIABLE]

    if "time" in data.dims:
        data = data.isel(time=-1)

    for depth_dim in ("depth", "deptht", "lev", "z"):
        if depth_dim in data.dims:
            data = data.isel({depth_dim: 0})
            break

    return data.squeeze(drop=True)


def _to_celsius(data: xr.DataArray) -> tuple[np.ndarray, str, bool]:
    raw = data.values.astype(np.float32)
    units = str(data.attrs.get("units", "")).strip()
    lowered = units.lower()

    if lowered in {"k", "kelvin"} or "kelvin" in lowered:
        return raw - 273.15, units, True

    return raw, units or "unknown", False


def _nice_display_range(values: np.ndarray) -> tuple[float, float]:
    valid = values[np.isfinite(values)]
    if valid.size == 0:
        raise ValueError("No valid ocean temperature values found in the processed subset.")

    raw_min = float(valid.min())
    raw_max = float(valid.max())
    spread = max(raw_max - raw_min, 0.5)
    padding = max(spread * 0.08, 0.25)
    minimum = math.floor((raw_min - padding) * 2) / 2
    maximum = math.ceil((raw_max + padding) * 2) / 2
    if minimum == maximum:
        maximum += 0.5
    return minimum, maximum


def _interpolate_color(ratio: np.ndarray) -> np.ndarray:
    output = np.zeros(ratio.shape + (3,), dtype=np.float32)
    stops = COLOR_STOPS

    for (start_pos, start_color), (end_pos, end_color) in zip(stops[:-1], stops[1:]):
        mask = (ratio >= start_pos) & (ratio <= end_pos)
        if not np.any(mask):
            continue
        local = (ratio[mask] - start_pos) / (end_pos - start_pos)
        start = np.array(start_color, dtype=np.float32)
        end = np.array(end_color, dtype=np.float32)
        output[mask] = start + (end - start) * local[:, None]

    output[ratio <= stops[0][0]] = np.array(stops[0][1], dtype=np.float32)
    output[ratio >= stops[-1][0]] = np.array(stops[-1][1], dtype=np.float32)
    return output.astype(np.uint8)


def _build_overlay(values_celsius: np.ndarray, display_min: float, display_max: float) -> Image.Image:
    normalized = (values_celsius - display_min) / (display_max - display_min)
    normalized = np.clip(normalized, 0.0, 1.0)
    rgb = _interpolate_color(normalized)

    alpha = np.where(np.isfinite(values_celsius), 182, 0).astype(np.uint8)
    rgb[~np.isfinite(values_celsius)] = 0
    rgba = np.dstack((rgb, alpha))

    # Latitudes are stored south-to-north for interpolation, but image rows must be north-to-south.
    rgba = np.flipud(rgba)
    return Image.fromarray(rgba, mode="RGBA")


def _load_download_sidecar() -> dict[str, Any]:
    path = raw_download_metadata_path()
    if not path.exists():
        return {
            "product_id": PRODUCT_ID,
            "dataset_id": DATASET_ID,
            "dataset_type": DATASET_TYPE,
            "retrieved_at_utc": datetime.now(timezone.utc).isoformat(),
        }
    return json.loads(path.read_text(encoding="utf-8"))


def _image_coordinates(latitudes: np.ndarray, longitudes: np.ndarray) -> list[list[float]]:
    lat_step = float(np.median(np.diff(latitudes))) if latitudes.size > 1 else 0.01
    lon_step = float(np.median(np.diff(longitudes))) if longitudes.size > 1 else 0.01

    south = float(latitudes[0] - lat_step / 2)
    north = float(latitudes[-1] + lat_step / 2)
    west = float(longitudes[0] - lon_step / 2)
    east = float(longitudes[-1] + lon_step / 2)

    return [
        [west, north],
        [east, north],
        [east, south],
        [west, south],
    ]


def _copy_processed_assets() -> None:
    # Keep all frontend-facing data in one stable location under data/processed/latest.
    # The frontend reads directly from there, so there is nothing else to sync for now.
    return


def process_temperature_dataset(input_path: Path | None = None) -> None:
    load_dotenv()
    ensure_directories()

    source_path = Path(input_path) if input_path else raw_dataset_path()
    if not source_path.exists():
        raise FileNotFoundError(f"Raw dataset not found: {source_path}")

    download_sidecar = _load_download_sidecar()

    with xr.open_dataset(source_path) as dataset:
        lat_name = _find_coordinate_name(dataset, ["latitude", "lat"])
        lon_name = _find_coordinate_name(dataset, ["longitude", "lon"])
        surface = _select_surface_temperature(dataset)

        latitudes = dataset[lat_name].values.astype(np.float64)
        longitudes = dataset[lon_name].values.astype(np.float64)
        values_celsius, original_units, converted_from_kelvin = _to_celsius(surface)

        if latitudes[0] > latitudes[-1]:
            latitudes = latitudes[::-1]
            values_celsius = values_celsius[::-1, :]
        if longitudes[0] > longitudes[-1]:
            longitudes = longitudes[::-1]
            values_celsius = values_celsius[:, ::-1]

        display_min, display_max = _nice_display_range(values_celsius)
        image = _build_overlay(values_celsius, display_min, display_max)

        time_value = None
        if "time" in dataset.coords:
            time_value = pd.to_datetime(dataset["time"].values[-1], utc=True).isoformat()

    overlay_path = overlay_output_path()
    grid_path = grid_output_path()
    meta_path = metadata_output_path()

    image.save(overlay_path)

    grid_payload = {
        "latitudes": [round(float(value), 6) for value in latitudes.tolist()],
        "longitudes": [round(float(value), 6) for value in longitudes.tolist()],
        "values_celsius": [
            [None if not np.isfinite(value) else round(float(value), 3) for value in row]
            for row in values_celsius.tolist()
        ],
    }
    grid_path.write_text(json.dumps(grid_payload), encoding="utf-8")

    valid_values = values_celsius[np.isfinite(values_celsius)]
    metadata_payload = {
        "layer": {
            "id": "temperature",
            "label": LAYER_LABEL,
            "variable": TEMPERATURE_VARIABLE,
        },
        "provenance": {
            "source": "Copernicus Marine",
            "product_id": download_sidecar.get("product_id", PRODUCT_ID),
            "dataset_id": download_sidecar.get("dataset_id", DATASET_ID),
            "type": download_sidecar.get("dataset_type", DATASET_TYPE),
            "retrieved_at_utc": download_sidecar.get("retrieved_at_utc"),
            "data_time_utc": time_value or download_sidecar.get("data_time_utc"),
            "original_units": original_units,
            "display_units": "degC",
            "converted_from_kelvin": converted_from_kelvin,
        },
        "region": {
            "name": "Copenhagen / Oresund",
            "bbox": BBOX,
            "initial_view": INITIAL_VIEW,
        },
        "overlay": {
            "image_url": WEB_OVERLAY_URL,
            "image_coordinates": _image_coordinates(latitudes, longitudes),
            "opacity": 0.72,
        },
        "grid": {
            "grid_url": WEB_GRID_URL,
            "rows": len(grid_payload["latitudes"]),
            "columns": len(grid_payload["longitudes"]),
        },
        "value_range_celsius": {
            "min": round(float(valid_values.min()), 2),
            "max": round(float(valid_values.max()), 2),
            "display_min": display_min,
            "display_max": display_max,
        },
        "files": {
            "metadata_url": WEB_METADATA_URL,
            "grid_filename": GRID_FILENAME,
            "overlay_filename": OVERLAY_FILENAME,
            "metadata_filename": METADATA_FILENAME,
        },
    }
    meta_path.write_text(json.dumps(metadata_payload, indent=2), encoding="utf-8")

    _copy_processed_assets()

    print(f"Processed overlay saved to {overlay_path}")
    print(f"Processed grid saved to {grid_path}")
    print(f"Processed metadata saved to {meta_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Process the latest raw Oresund temperature subset into web assets.")
    parser.add_argument(
        "--input",
        type=Path,
        default=raw_dataset_path(),
        help="Path to the raw NetCDF subset produced by download_temperature.py",
    )
    args = parser.parse_args()
    process_temperature_dataset(args.input)


if __name__ == "__main__":
    main()

