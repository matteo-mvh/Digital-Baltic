# Coastal & Marine Infrastructure prototype bundle

This folder contains the first local implementation scaffold for the `Coastal & Marine Infrastructure` overlay.

## Important note

This is a **curated frontend prototype bundle**.
It is intentionally lightweight so the map remains responsive while the overlay architecture, popup model and layer controls are developed.

The files here are not yet a full automated Baltic-wide ingest pipeline.
They are designed to be replaced category-by-category by processed outputs from authoritative sources.

## Included now

- `manifest.json` — lightweight app-facing manifest used by the current frontend
- `source_manifest_reference.json` — richer source manifest copied from the provided reference material
- `ports.geojson`
- `power-plants.geojson`
- `wind-farms.geojson`
- `cables.geojson`
- `pipelines.geojson`
- `shipping-routes.geojson`
- `land-use.geojson`

Each category is loaded independently so future preprocessing can swap in a production dataset without changing the overlay shell.

## Reference datasets and licences

The attached source material provided for this implementation points to these preferred production sources:

### Ports

- Source: EMODnet Human Activities / Eurostat
- Metadata: https://emodnet.ec.europa.eu/geonetwork/srv/api/records/379d0425-8924-4a41-a088-1a002d2ea748
- Licence: CC BY 4.0
- Revision in reference manifest: `2025-12-10`

### Offshore wind farms

- Source: EMODnet Human Activities
- Metadata: https://emodnet.ec.europa.eu/geonetwork/srv/api/records/8201070b-4b0b-4d54-8910-abcea5dce57f
- Licence: CC BY 4.0
- Revision in reference manifest: `2026-07-10`

### Pipelines

- Source: EMODnet Human Activities
- Metadata: https://emodnet.ec.europa.eu/geonetwork/srv/api/records/aca3dd01-77ac-47fe-8291-6ca916daaa6d
- Licence: CC BY 4.0
- Revision in reference manifest: `2023-07-05`

### Submarine power cables

- Source: EMODnet Human Activities
- Metadata: https://emodnet.ec.europa.eu/geonetwork/srv/api/records/41b339f8-b29c-4550-b787-3d68f08fdbcc
- Licence: CC BY 4.0
- Revision in reference manifest: `2023-06-28`

### Telecommunication cables

- Source: EMODnet Human Activities
- Metadata: https://emodnet.ec.europa.eu/geonetwork/srv/api/records/39ebe289-410b-4a5d-88a4-51bfcde538de
- Licence: CC BY 4.0
- Revision in reference manifest: `2023-06-28`

### Shipping

- Source: EMODnet Human Activities / EMSA
- Metadata: https://emodnet.ec.europa.eu/geonetwork/srv/api/records/74eef9c6-13fe-4630-b935-f26871c8b661
- Delivery target: raster WMS density / route layer in production
- Current prototype status: simplified corridor vectors for clickability and low browser cost

### Power plants

- Source used in provided builder: OpenStreetMap coastal `power=plant` search
- Reference endpoint: https://overpass-api.de/api/interpreter
- Licence: ODbL
- Suggested authoritative supplement: HELCOM HOLAS 3 fossil fuel energy production
- HELCOM metadata: https://metadata.helcom.fi/geonetwork/srv/api/records/b0c5ef19-56be-4b22-be7f-9f976cd2dfc2

### Land use

- Source target: Copernicus Land Monitoring Service — CORINE Land Cover
- Metadata: https://land.copernicus.eu/en/products/corine-land-cover
- Licence: Copernicus data policy; verify product metadata
- Current prototype status: muted contextual polygons around the Copenhagen / Oresund starting view

## Processing approach

The longer-term production pipeline should:

1. download category-specific source data into raw staging folders;
2. clip or aggregate to Baltic-relevant extents;
3. simplify geometry for smooth browser rendering;
4. normalize popup properties to a shared schema;
5. export compact GeoJSON, raster tiles or vector tiles depending on category scale.

The provided reference build materials recommend keeping shipping density and large land-use products out of raw in-browser GeoJSON.

## Current prototype data

The current bundled GeoJSON files are intentionally small curated subsets used to prove:

- one parent overlay with nested category controls;
- category-specific styling;
- object popups;
- legend rendering;
- compatibility with the existing time slider and temperature layers.

## Most recent prototype edit

- Bundle updated: `2026-08-19`
- Purpose: frontend architecture, source documentation and category-toggle integration
