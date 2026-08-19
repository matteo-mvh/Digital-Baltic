# Copenhagen Sea Live - v0.1

An early prototype for a future "Live Baltic Sea" experience: a public-facing, visually accessible way to explore current marine conditions without turning the interface into a scientific GIS portal.

This first version focuses only on one layer:

- Surface seawater temperature in the Copenhagen and Oresund region

## Purpose

Build a clean, expandable foundation that can:

- download the newest available Copernicus Marine surface temperature field for the Copenhagen/Oresund area,
- process it into lightweight assets for the web,
- display it on an interactive map over a zero-cost public basemap,
- preserve enough provenance to explain what the data is and when it was retrieved.

## Current Functionality

- Downloads the latest available Baltic Sea hourly physical model temperature field from Copernicus Marine
- Subsets the download to the Copenhagen/Oresund bounding box
- Selects the shallowest available model layer as sea-surface temperature
- Converts Kelvin to Celsius if needed
- Generates:
  - a transparent temperature overlay PNG,
  - a grid JSON for click-to-inspect values,
  - a metadata JSON with timestamps and provenance
- Serves a minimal interactive frontend with:
  - a free OpenFreeMap basemap with tilt/rotation support,
  - the temperature overlay,
  - a legend,
  - source/timestamp display,
  - click-to-inspect temperature values at sea

## Project Structure

```text
Digital Baltic/
├── README.md
├── .gitignore
├── .env.example
├── requirements.txt
├── data/
│   ├── raw/
│   └── processed/
├── data_pipeline/
│   ├── __init__.py
│   ├── config.py
│   ├── download_temperature.py
│   └── process_temperature.py
├── frontend/
│   ├── app.js
│   ├── index.html
│   ├── serve_frontend.py
│   └── styles.css
└── docs/
    └── data_sources.md
```

## Data Source

This prototype targets the Copernicus Marine Baltic Sea Physics Analysis and Forecast product:

- Product ID: `BALTICSEA_ANALYSISFORECAST_PHY_003_006`
- Dataset ID: `cmems_mod_bal_phy_anfc_PT1H-i`
- Variable: `thetao` (sea water potential temperature)
- Source type: modelled analysis and forecast, not a direct observation

Details and rationale are documented in [docs/data_sources.md](/C:/Users/Mmm/Documents/ChatGPT/Digital%20Baltic/docs/data_sources.md).

## Frontend Selection

The current frontend framework decision is documented in [docs/frontend_selection.md](/C:/Users/Mmm/Documents/ChatGPT/Digital%20Baltic/docs/frontend_selection.md).

Short version:

- `MapLibre + OpenFreeMap` is selected for v0.1 because it is free of charge to use right now, requires no API key, and keeps the public prototype simple.
- `CesiumJS + Google Photorealistic 3D Tiles` remains the strongest long-term candidate for a truly immersive 3D city/ocean experience, but it is not the right zero-cost foundation for August 19, 2026 because it requires Google Maps Platform billing and comes with stricter usage policies.

## Installation

### 1. Create an environment file

Copy `.env.example` to `.env` and fill in:

- `COPERNICUSMARINE_SERVICE_USERNAME`
- `COPERNICUSMARINE_SERVICE_PASSWORD`

You can create a free Copernicus Marine account for authenticated data access.

### 2. Install Python dependencies

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## Running The Data Pipeline

Download the latest available Oresund temperature field and process it into frontend assets:

```bash
python data_pipeline/download_temperature.py
```

This produces:

- `data/raw/temperature_latest.nc`
- `data/raw/temperature_latest_download.json`
- `data/processed/latest/temperature_overlay.png`
- `data/processed/latest/temperature_grid.json`
- `data/processed/latest/temperature_metadata.json`

You can also re-run processing independently:

```bash
python data_pipeline/process_temperature.py
```

## Running The Web Application

Serve the lightweight frontend from the repository root:

```bash
python frontend/serve_frontend.py
```

Then open:

```text
http://127.0.0.1:8000/frontend/
```

Important:

- Do not open [frontend/index.html](/C:/Users/Mmm/Documents/ChatGPT/Digital%20Baltic/frontend/index.html) by double-clicking it in the file explorer.
- The page expects to be served through the local HTTP server above.
- The app also requires processed files in `data/processed/latest/`, which are created by `python data_pipeline/download_temperature.py`.

For Windows convenience, you can also use [run_app.bat](/C:/Users/Mmm/Documents/ChatGPT/Digital%20Baltic/run_app.bat).

## Validation Checklist

Before treating this prototype as complete, verify:

- the downloaded field covers Copenhagen/Oresund,
- the overlay aligns with coastlines,
- the shallowest layer is the one being visualized,
- temperature values are physically plausible,
- land cells remain transparent,
- the displayed timestamp matches the actual dataset time,
- re-running the pipeline updates the frontend without code changes.

## Project Status

This is an early prototype for a broader "Live Baltic Sea" concept. It is deliberately limited to one variable and a single region so the data pipeline, provenance model, and public-facing visual language can be established before adding more layers such as currents, salinity, oxygen, chlorophyll, or biodiversity.

Because the current constraint is zero paid infrastructure or API usage, the v0.1 frontend intentionally avoids paid satellite and photorealistic 3D services. The renderer and processed data outputs are kept simple so the project can later move to a more immersive 3D stack when the budget and licensing constraints change.
