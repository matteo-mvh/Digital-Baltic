# Data Sources

## Primary Temperature Source

This prototype uses the Copernicus Marine Baltic physical forecast product for the newest available modelled temperature field in the Copenhagen/Oresund region.

- Provider: Copernicus Marine Service
- Product ID: `BALTICSEA_ANALYSISFORECAST_PHY_003_006`
- Dataset ID used in this repository: `cmems_mod_bal_phy_anfc_PT1H-i`
- Variable: `thetao`
- Variable meaning: sea water potential temperature
- Product type: modelled analysis and forecast
- Spatial coverage: Baltic Sea
- Intended v0.1 subset: Copenhagen / Oresund only

## Why This Product

It fits the prototype well because it is:

- regional to the Baltic Sea rather than global,
- high enough resolution to make the Oresund coastline feel convincing,
- updated operationally,
- available through the official Copernicus Marine Toolbox for reproducible scripted access.

## Important Provenance Note

The layer shown in the application should be described as modelled temperature from Copernicus Marine, not as a direct in-water observation.

Recommended public-facing wording:

```text
Sea surface temperature
Source: Copernicus Marine
Type: modelled analysis and forecast
Data time: [actual timestamp]
Retrieved: [timestamp]
```

## Access Notes

The download pipeline uses the official `copernicusmarine` Python package and authenticated subset access. Credentials are expected via environment variables:

- `COPERNICUSMARINE_SERVICE_USERNAME`
- `COPERNICUSMARINE_SERVICE_PASSWORD`

## Reference Links

- Product overview:
  - https://data.marine.copernicus.eu/product/BALTICSEA_ANALYSISFORECAST_PHY_003_006/description
- Product services and dataset IDs:
  - https://data.marine.copernicus.eu/product/BALTICSEA_ANALYSISFORECAST_PHY_003_006/services
- Copernicus Marine Toolbox subset documentation:
  - https://help.marine.copernicus.eu/en/articles/9235249-how-to-download-a-subset-of-data
