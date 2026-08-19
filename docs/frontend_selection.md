# Frontend Selection

Date of decision: August 19, 2026

## Recommendation

For v0.1, select:

- `MapLibre GL JS` as the frontend framework
- `OpenFreeMap` as the zero-cost public basemap

Do not select `CesiumJS + Google Photorealistic 3D Tiles` for the first public prototype while the constraint is "no paid servers, APIs, or licensing".

## Why This Changed

The long-term product vision absolutely points toward an immersive 3D viewer. If cost were not a constraint, `CesiumJS + Google Photorealistic 3D Tiles` would be the stronger long-term visualization stack.

But the current requirement is stricter than "cheap":

> free of charge right now

That makes the selection different.

## Comparison

### 1. CesiumJS + Google Photorealistic 3D Tiles

Strengths:

- Best fit for a future immersive 3D Copenhagen experience
- Native support for tilt, rotation, terrain-aware camera movement, 3D Tiles, and realistic city-scale scenes
- Much closer to the eventual "look over the real sea and city" experience than a 2D map stack
- CesiumJS itself is open source under Apache 2.0

Costs and constraints:

- Google Photorealistic 3D Tiles require a Google Maps Platform billing-enabled API key
- Google Map Tiles API policies restrict caching, storage, extraction, and offline use
- Attribution rules are stricter and must remain clearly visible
- As of August 19, 2026, Google's published price list shows:
  - `Map Tiles API: Photorealistic 3D Tiles`: 1,000 free monthly events, then `$6.00` per 1,000 in the first paid tier
- Google's current usage page also lists a maximum of 10,000 root tileset queries per day, with timed sessions allowing up to three hours of renderer tile requests from one root request

Complexity:

- Higher engineering complexity than MapLibre for a small v0.1 prototype
- More operational complexity because billing, quota management, attribution compliance, and public-launch monitoring all matter on day one
- The ocean overlay can be done, but the "simple prototype" advantage disappears quickly once the scene becomes fully 3D

Conclusion:

- Excellent long-term candidate
- Not the right zero-cost foundation for v0.1

### 2. MapLibre GL JS + OpenFreeMap

Strengths:

- Fully open-source frontend stack
- No API key required
- No billing setup required
- Public OpenFreeMap instance is currently described as completely free, including commercial usage, with no request or map-view limits
- Works immediately with our existing temperature overlay approach
- Lets us support pitch, bearing, and a modest pseudo-3D presentation now

Tradeoffs:

- Not photorealistic
- Does not give us realistic buildings and terrain at the level Google Photorealistic 3D Tiles can
- A true immersive 3D city/ocean experience would still likely require a later renderer or data-source upgrade

Complexity:

- Much lower than Cesium + Google for the current scope
- Best match for:
  - zero-cost requirement,
  - one environmental layer,
  - fast iteration,
  - simple reproducible deployment

Conclusion:

- Best fit for v0.1 under the current constraints

## Decision

Select `MapLibre GL JS` now, but keep the data products renderer-agnostic:

- processed overlay PNG stays georeferenced
- processed grid JSON stays frontend-neutral
- provenance metadata remains independent of the rendering engine

This keeps open a future upgrade path to:

- `CesiumJS`
- another 3D Tiles-capable viewer
- locally hosted or institutionally licensed aerial/3D city data

without rewriting the scientific data pipeline.

## Practical Plan

For v0.1:

- use MapLibre
- use OpenFreeMap's public 3D-capable style
- keep the UI sparse and cinematic
- support pitch/rotation so the product language already leans toward 3D

For a later funded phase:

- re-evaluate `CesiumJS + Google Photorealistic 3D Tiles`
- or evaluate public-sector orthophotos and local 3D city data for Denmark/Sweden
- move the temperature overlay into a true 3D scene once budget and licensing are acceptable

## Sources

- CesiumJS open-source / Apache 2.0:
  - https://cesium.com/platform/cesiumjs/
- Google Photorealistic 3D Tiles overview:
  - https://developers.google.com/maps/documentation/tile/3d-tiles
- Google Map Tiles API policies:
  - https://developers.google.com/maps/documentation/tile/policies
- Google pricing and billing:
  - https://developers.google.com/maps/billing-and-pricing/pricing
- Google usage limits:
  - https://developers.google.com/maps/documentation/tile/usage-and-billing
- OpenFreeMap homepage:
  - https://openfreemap.org/
- OpenFreeMap quick start:
  - https://openfreemap.org/quick_start/
- OpenFreeMap terms:
  - https://openfreemap.org/tos/
