const METADATA_URL = new URL("../data/processed/latest/temperature_metadata.json", window.location.href).toString();
const MAP_STYLE = "https://tiles.openfreemap.org/styles/3d";

const subtitleEl = document.getElementById("subtitle");
const sourceSummaryEl = document.getElementById("source-summary");
const sourceDetailEl = document.getElementById("source-detail");
const clickPanelEl = document.getElementById("click-panel");
const clickedTemperatureEl = document.getElementById("clicked-temperature");
const clickedCoordinatesEl = document.getElementById("clicked-coordinates");
const legendPanelEl = document.getElementById("legend-panel");
const legendRangeEl = document.getElementById("legend-range");
const legendMinEl = document.getElementById("legend-min");
const legendMaxEl = document.getElementById("legend-max");
const statusPanelEl = document.getElementById("status-panel");
const statusMessageEl = document.getElementById("status-message");

let map;
let metadata;
let grid;

function setStatus(message, tone = "neutral") {
  statusMessageEl.textContent = message;
  statusPanelEl.dataset.tone = tone;
  statusPanelEl.hidden = false;
}

function clearStatus() {
  statusPanelEl.hidden = true;
}

function formatTimestamp(value) {
  if (!value) return "Timestamp unavailable";
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date) + " UTC";
}

function formatCoordinate(value, positiveLabel, negativeLabel) {
  const label = value >= 0 ? positiveLabel : negativeLabel;
  return `${Math.abs(value).toFixed(4)} ${label}`;
}

function createMap(view) {
  return new maplibregl.Map({
    container: "map",
    style: MAP_STYLE,
    center: view.center,
    zoom: view.zoom,
    pitch: 55,
    bearing: 16,
    minZoom: 7.2,
    maxZoom: 13.5,
    maxPitch: 70,
    dragRotate: true,
    attributionControl: true,
  });
}

function addOverlayToMap() {
  map.addSource("temperature-overlay", {
    type: "image",
    url: metadata.overlay.image_url,
    coordinates: metadata.overlay.image_coordinates,
  });

  map.addLayer({
    id: "temperature-overlay",
    type: "raster",
    source: "temperature-overlay",
    paint: {
      "raster-opacity": metadata.overlay.opacity,
      "raster-fade-duration": 0,
    },
  });
}

function updateChrome() {
  const dataTime = formatTimestamp(metadata.provenance.data_time_utc);
  subtitleEl.textContent = `Surface temperature · ${dataTime}`;
  sourceSummaryEl.textContent = "Copernicus Marine + OpenFreeMap";
  sourceDetailEl.textContent = `${metadata.provenance.type} · retrieved ${formatTimestamp(
    metadata.provenance.retrieved_at_utc,
  )}`;

  legendRangeEl.textContent = `${metadata.value_range_celsius.min.toFixed(1)} to ${metadata.value_range_celsius.max.toFixed(1)}`;
  legendMinEl.textContent = metadata.value_range_celsius.display_min.toFixed(1);
  legendMaxEl.textContent = metadata.value_range_celsius.display_max.toFixed(1);
  legendPanelEl.hidden = false;
}

function locateIndex(values, target) {
  if (target < values[0] || target > values[values.length - 1]) {
    return null;
  }

  for (let index = 0; index < values.length - 1; index += 1) {
    if (target >= values[index] && target <= values[index + 1]) {
      return index;
    }
  }

  return values.length - 2;
}

function nearestValidValue(latIndex, lonIndex) {
  const rows = grid.values_celsius.length;
  const cols = grid.values_celsius[0].length;

  for (let radius = 0; radius <= 3; radius += 1) {
    for (let row = Math.max(0, latIndex - radius); row <= Math.min(rows - 1, latIndex + radius); row += 1) {
      for (
        let col = Math.max(0, lonIndex - radius);
        col <= Math.min(cols - 1, lonIndex + radius);
        col += 1
      ) {
        const candidate = grid.values_celsius[row][col];
        if (typeof candidate === "number") {
          return candidate;
        }
      }
    }
  }

  return null;
}

function interpolateTemperature(latitude, longitude) {
  const latitudes = grid.latitudes;
  const longitudes = grid.longitudes;

  const latIndex = locateIndex(latitudes, latitude);
  const lonIndex = locateIndex(longitudes, longitude);

  if (latIndex === null || lonIndex === null) {
    return null;
  }

  const y0 = latitudes[latIndex];
  const y1 = latitudes[latIndex + 1];
  const x0 = longitudes[lonIndex];
  const x1 = longitudes[lonIndex + 1];

  const q11 = grid.values_celsius[latIndex][lonIndex];
  const q12 = grid.values_celsius[latIndex + 1][lonIndex];
  const q21 = grid.values_celsius[latIndex][lonIndex + 1];
  const q22 = grid.values_celsius[latIndex + 1][lonIndex + 1];

  if ([q11, q12, q21, q22].every((value) => typeof value === "number")) {
    const tx = (longitude - x0) / (x1 - x0 || 1);
    const ty = (latitude - y0) / (y1 - y0 || 1);
    const value =
      q11 * (1 - tx) * (1 - ty) +
      q21 * tx * (1 - ty) +
      q12 * (1 - tx) * ty +
      q22 * tx * ty;
    return value;
  }

  return nearestValidValue(latIndex, lonIndex);
}

function registerMapInteractions() {
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");

  map.on("click", (event) => {
    const { lat, lng } = event.lngLat;
    const value = interpolateTemperature(lat, lng);

    if (value === null) {
      clickPanelEl.hidden = true;
      return;
    }

    clickedTemperatureEl.textContent = `${value.toFixed(1)} degC`;
    clickedCoordinatesEl.textContent = `${formatCoordinate(lat, "N", "S")} · ${formatCoordinate(
      lng,
      "E",
      "W",
    )}`;
    clickPanelEl.hidden = false;
  });
}

async function bootstrap() {
  try {
    if (window.location.protocol === "file:") {
      throw new Error(
        "This page should not be opened directly from the file system. Start the local server with `run_app.bat` or `python frontend/serve_frontend.py`, then open http://127.0.0.1:8000/frontend/.",
      );
    }

    setStatus("Loading processed metadata...");
    const metadataResponse = await fetch(METADATA_URL, { cache: "no-store" });

    if (!metadataResponse.ok) {
      throw new Error(
        "Processed temperature assets were not found yet. Run `python data_pipeline/download_temperature.py` first, then start the frontend server and open http://127.0.0.1:8000/frontend/.",
      );
    }

    metadata = await metadataResponse.json();

    setStatus("Loading processed grid...");
    const gridResponse = await fetch(metadata.grid.grid_url, { cache: "no-store" });
    if (!gridResponse.ok) {
      throw new Error("Temperature grid JSON could not be loaded.");
    }
    grid = await gridResponse.json();

    map = createMap(metadata.region.initial_view);

    map.on("load", () => {
      addOverlayToMap();
      updateChrome();
      registerMapInteractions();
      setStatus(
        "Zero-cost mode: using OpenFreeMap instead of paid satellite or photorealistic 3D imagery.",
        "warning",
      );
    });
  } catch (error) {
    console.error(error);
    setStatus(error.message || "The app could not be initialized.", "error");
  }
}

bootstrap();
