# Underwater Noise overlay

This folder stores the local source reference material for the `Underwater Noise` overlay.

## Current implementation

The frontend uses HELCOM-hosted raster services and reported-event endpoints directly for the first prototype.
That keeps the repository light while still using real public Baltic-wide source layers.

## Canonical reference

- `source_manifest_reference.json` summarizes the provided HELCOM dataset plan

## Important scientific constraints

- Continuous and impulsive noise are different metrics and should not be merged into one number.
- HELCOM continuous-noise pressure layers should not be presented as raw dB values unless the underlying source explicitly supports that.
- Reported impulsive-noise events are incomplete where national reporting is incomplete.
- Operational offshore-wind-farm noise is still a public-data gap in this prototype.

## Referenced source families

- HELCOM HOLAS 3 / HELCOM MADS
- HELCOM-OSPAR impulsive noise register
- ICES continuous-noise data portal for future monitoring integration

## Recommended UI interpretation

- `Continuous noise` is assessment pressure context
- `Noise events` are reported historical events
- `Impulsive noise pressure` is a separate assessment layer
- `Noise impact on mobile species` is an ecological-effect layer, not an acoustic measurement
