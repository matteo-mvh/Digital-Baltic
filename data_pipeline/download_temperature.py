from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timedelta, timezone
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


FORECAST_HORIZON = timedelta(days=2)


def _available_times() -> pd.DatetimeIndex:
    remote = copernicusmarine.open_dataset(dataset_id=DATASET_ID)
    try:
        if "time" not in remote.coords:
            raise RuntimeError(f"Dataset {DATASET_ID} does not expose a time coordinate.")
        return pd.to_datetime(remote["time"].values, utc=True)
    finally:
        close_method = getattr(remote, "close", None)
        if callable(close_method):
            close_method()


def _select_time_window(available_times: pd.DatetimeIndex) -> tuple[datetime, datetime, list[str]]:
    now_utc = datetime.now(timezone.utc)
    current_or_future = available_times[available_times >= now_utc]

    if len(current_or_future) > 0:
        start_time = current_or_future[0].to_pydatetime()
    else:
        nearest_index = int((available_times - now_utc).to_series().abs().argmin())
        start_time = available_times[nearest_index].to_pydatetime()

    horizon_end = start_time + FORECAST_HORIZON
    selected = available_times[(available_times >= start_time) & (available_times <= horizon_end)]
    if len(selected) == 0:
        selected = pd.DatetimeIndex([pd.Timestamp(start_time)])

    end_time = selected[-1].to_pydatetime()
    selected_iso = [timestamp.to_pydatetime().astimezone(timezone.utc).isoformat() for timestamp in selected]
    return start_time.astimezone(timezone.utc), end_time.astimezone(timezone.utc), selected_iso


def _write_download_metadata(start_time: datetime, end_time: datetime, selected_times: list[str]) -> None:
    payload = {
        "product_id": PRODUCT_ID,
        "dataset_id": DATASET_ID,
        "variable": TEMPERATURE_VARIABLE,
        "layer_label": LAYER_LABEL,
        "dataset_type": DATASET_TYPE,
        "bbox": BBOX,
        "requested_start_utc": start_time.isoformat(),
        "requested_end_utc": end_time.isoformat(),
        "selected_times_utc": selected_times,
        "retrieved_at_utc": datetime.now(timezone.utc).isoformat(),
        "raw_file": RAW_DATA_FILENAME,
    }
    raw_download_metadata_path().write_text(json.dumps(payload, indent=2), encoding="utf-8")


def download_temperature_window(run_processing: bool = True) -> None:
    load_dotenv()
    ensure_directories()

    available_times = _available_times()
    start_time, end_time, selected_times = _select_time_window(available_times)
    raw_path = raw_dataset_path()

    print(f"Current UTC time: {datetime.now(timezone.utc).isoformat()}")
    print(f"Selected forecast window: {start_time.isoformat()} to {end_time.isoformat()}")
    print(f"Selected {len(selected_times)} dataset time steps from {DATASET_ID}")
    print(f"Downloading {TEMPERATURE_VARIABLE} for the Baltic Sea subset...")

    copernicusmarine.subset(
        dataset_id=DATASET_ID,
        variables=[TEMPERATURE_VARIABLE],
        start_datetime=start_time.isoformat(),
        end_datetime=end_time.isoformat(),
        minimum_longitude=BBOX["minimum_longitude"],
        maximum_longitude=BBOX["maximum_longitude"],
        minimum_latitude=BBOX["minimum_latitude"],
        maximum_latitude=BBOX["maximum_latitude"],
        output_directory=raw_path.parent,
        output_filename=raw_path.name,
        overwrite=True,
        disable_progress_bar=True,
    )

    _write_download_metadata(start_time, end_time, selected_times)
    print(f"Saved raw subset to {raw_path}")

    if run_processing:
        process_temperature_dataset(raw_path)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Download the current-to-two-days-ahead Baltic Sea surface-temperature forecast window."
    )
    parser.add_argument(
        "--skip-processing",
        action="store_true",
        help="Download the raw NetCDF subset without generating frontend assets.",
    )
    args = parser.parse_args()
    download_temperature_window(run_processing=not args.skip_processing)


if __name__ == "__main__":
    main()
