from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv

if __package__ in {None, ""}:
    sys.path.append(str(Path(__file__).resolve().parents[1]))

import copernicusmarine

from data_pipeline.config import (
    BBOX,
    DATASET_ID,
    DATASET_TYPE,
    LAYER_LABEL,
    PRODUCT_ID,
    RAW_DATA_FILENAME,
    TEMPERATURE_VARIABLE,
    ensure_directories,
    raw_dataset_path,
    raw_download_metadata_path,
)
from data_pipeline.process_temperature import process_temperature_dataset


def _latest_available_time() -> datetime:
    remote = copernicusmarine.open_dataset(dataset_id=DATASET_ID)
    try:
        if "time" not in remote.coords:
            raise RuntimeError(f"Dataset {DATASET_ID} does not expose a time coordinate.")
        latest = pd.to_datetime(remote["time"].values[-1], utc=True).to_pydatetime()
        return latest.astimezone(timezone.utc)
    finally:
        close_method = getattr(remote, "close", None)
        if callable(close_method):
            close_method()


def _write_download_metadata(latest_data_time: datetime) -> None:
    payload = {
        "product_id": PRODUCT_ID,
        "dataset_id": DATASET_ID,
        "variable": TEMPERATURE_VARIABLE,
        "layer_label": LAYER_LABEL,
        "dataset_type": DATASET_TYPE,
        "bbox": BBOX,
        "data_time_utc": latest_data_time.isoformat(),
        "retrieved_at_utc": datetime.now(timezone.utc).isoformat(),
        "raw_file": RAW_DATA_FILENAME,
    }
    raw_download_metadata_path().write_text(json.dumps(payload, indent=2), encoding="utf-8")


def download_latest_temperature(run_processing: bool = True) -> None:
    load_dotenv()
    ensure_directories()

    latest_time = _latest_available_time()
    raw_path = raw_dataset_path()

    print(f"Latest available Copernicus time: {latest_time.isoformat()}")
    print(f"Downloading {TEMPERATURE_VARIABLE} from {DATASET_ID} for the Copenhagen/Oresund box...")

    copernicusmarine.subset(
        dataset_id=DATASET_ID,
        variables=[TEMPERATURE_VARIABLE],
        start_datetime=latest_time.isoformat(),
        end_datetime=latest_time.isoformat(),
        minimum_longitude=BBOX["minimum_longitude"],
        maximum_longitude=BBOX["maximum_longitude"],
        minimum_latitude=BBOX["minimum_latitude"],
        maximum_latitude=BBOX["maximum_latitude"],
        output_directory=raw_path.parent,
        output_filename=raw_path.name,
        overwrite=True,
        disable_progress_bar=True,
    )

    _write_download_metadata(latest_time)
    print(f"Saved raw subset to {raw_path}")

    if run_processing:
        process_temperature_dataset(raw_path)


def main() -> None:
    parser = argparse.ArgumentParser(description="Download the latest Oresund sea-surface temperature field.")
    parser.add_argument(
        "--skip-processing",
        action="store_true",
        help="Download the raw NetCDF subset without generating frontend assets.",
    )
    args = parser.parse_args()
    download_latest_temperature(run_processing=not args.skip_processing)


if __name__ == "__main__":
    main()

