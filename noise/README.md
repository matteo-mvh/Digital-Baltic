# Noise model

This folder isolates the first-pass underwater shipping-noise model from the rest of the app so it can be replaced later with a more realistic shallow-water acoustic workflow.

## Current approach

- Vessel positions come from the AIS cache.
- Source levels are estimated with a JOMOPANS-ECHO-style reference-spectrum approach:
  - vessel class
  - speed
  - vessel length
  - frequency band
- The default band is 63 Hz.
- The displayed uncertainty remains approximately +/- 6 dB, matching the published statistical uncertainty discussed for JOMOPANS-ECHO-style ship source spectra.

## Propagation

Version 0.1 uses a deliberately simplified distance-loss approximation:

- geometric spreading
- a small frequency-dependent absorption term
- a shallow-water penalty term

This is explicitly an approximation for visualization and education. It does not yet include:

- bathymetry
- seabed properties
- coastline shielding
- water-column structure
- full frequency-dependent shallow-water acoustics

## Combination

Per-vessel levels are converted from dB to linear energy, summed across ships, then converted back to dB for display.
