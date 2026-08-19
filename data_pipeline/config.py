from __future__ import annotations

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed" / "latest"
FRONTEND_DIR = PROJECT_ROOT / "frontend"

PRODUCT_ID = "BALTICSEA_ANALYSISFORECAST_PHY_003_006"
DATASET_ID = "cmems_mod_bal_phy_anfc_PT1H-i"
TEMPERATURE_VARIABLE = "thetao"
LAYER_NAME = "sea_surface_temperature"
LAYER_LABEL = "Sea surface temperature"
DATASET_TYPE = "Modelled analysis and forecast"

BBOX = {
    "minimum_longitude": 11.60,
    "maximum_longitude": 13.15,
    "minimum_latitude": 55.20,
    "maximum_latitude": 56.25,
}

INITIAL_VIEW = {
    "center": [12.38, 55.86],
    "zoom": 8.65,
}

RAW_DATA_FILENAME = "temperature_latest.nc"
RAW_DOWNLOAD_METADATA_FILENAME = "temperature_latest_download.json"
OVERLAY_FILENAME = "temperature_overlay.png"
GRID_FILENAME = "temperature_grid.json"
METADATA_FILENAME = "temperature_metadata.json"

WEB_PROCESSED_ROOT = "../data/processed/latest"
WEB_OVERLAY_URL = f"{WEB_PROCESSED_ROOT}/{OVERLAY_FILENAME}"
WEB_GRID_URL = f"{WEB_PROCESSED_ROOT}/{GRID_FILENAME}"
WEB_METADATA_URL = f"{WEB_PROCESSED_ROOT}/{METADATA_FILENAME}"

COLOR_STOPS = [
    (0.00, (14, 42, 79)),
    (0.20, (21, 93, 146)),
    (0.45, (49, 168, 188)),
    (0.65, (121, 214, 178)),
    (0.82, (246, 206, 102)),
    (1.00, (225, 103, 63)),
]


def ensure_directories() -> None:
    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)


def raw_dataset_path() -> Path:
    return RAW_DATA_DIR / RAW_DATA_FILENAME


def raw_download_metadata_path() -> Path:
    return RAW_DATA_DIR / RAW_DOWNLOAD_METADATA_FILENAME


def overlay_output_path() -> Path:
    return PROCESSED_DATA_DIR / OVERLAY_FILENAME


def grid_output_path() -> Path:
    return PROCESSED_DATA_DIR / GRID_FILENAME


def metadata_output_path() -> Path:
    return PROCESSED_DATA_DIR / METADATA_FILENAME
