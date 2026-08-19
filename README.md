# Digital Baltic

Digital Baltic is a public-facing website project, not just a temperature downloader.

This repository powers a GitHub Pages site that turns Baltic Sea data into a browsable coastal experience focused on Copenhagen and the Oresund. The goal is to make marine conditions easier to explore in a web-native format, with a stronger sense of place than a raw data portal.

## What The Website Is

The site combines environmental layers, coastal storytelling, and map-based interaction into one static web experience. It is designed to be understandable for non-specialists while still keeping data provenance visible.

Today the project includes:

- a hosted website built from `frontend/` into `site/`,
- interactive ocean-condition views for surface temperature, currents, salinity, oxygen, waves, and sea level,
- live or demo AIS vessel context around Copenhagen and the Oresund,
- modelled underwater shipping-noise overlays derived from the current vessel scene,
- localised interface content and educational panels that explain what users are looking at.

## What This Repo Does

This repository contains both sides of the project:

- the website frontend in `frontend/`,
- the static deployment output in `site/`,
- the data-processing pipeline in `data_pipeline/`,
- site build and update scripts in `scripts/`,
- supporting noise-modelling logic in `noise/`,
- documentation for sources and decisions in `docs/`.

The repo is therefore both a website codebase and the machinery that prepares its ocean data.

## Hosting And Deployment

The project is set up to host the website on GitHub Pages.

## Live Site

Open the deployed website directly here:

- [Digital Baltic live site](https://matteo-mvh.github.io/Digital-Baltic/)

From GitHub itself, there is not always a big repository-header website button for GitHub Pages. The reliable way to open it on Wednesday, August 19, 2026 is:

1. Open the repository on GitHub.
2. Go to `Settings`.
3. Open `Pages` in the sidebar.
4. Click `Visit site`.

- `.github/workflows/deploy-site.yml` builds the static site and deploys `site/`
- `.github/workflows/update-ocean-data.yml` refreshes Copernicus-backed ocean assets on a schedule and redeploys the website
- `scripts/build_site.py` assembles the publishable site bundle

This means the repository is meant to publish a living website, not just store scripts for downloading model data.

## Data And Layers

Digital Baltic currently uses Copernicus Marine as its primary ocean-data source. The site is built around modelled analysis and forecast products rather than direct in-water observation, and that distinction is important to keep visible in public-facing copy.

The current experience is broader than temperature alone. The codebase already supports:

- surface temperature
- currents
- salinity
- dissolved oxygen
- waves
- sea level
- AIS-backed vessel context
- modelled underwater noise

More detail on source provenance is documented in [docs/data_sources.md](/C:/Users/Mmm/Documents/ChatGPT/Digital%20Baltic/docs/data_sources.md).

## Project Structure

```text
Digital Baltic/
├── README.md
├── data/
├── data_pipeline/
├── docs/
├── frontend/
├── noise/
├── scripts/
├── site/
└── .github/workflows/
```

## Status

This is still an evolving project, but it is already structured as a publishable Baltic Sea website with its own frontend, deployment flow, and automated data-refresh pipeline. The repository should be understood as the home of that website experience, not as a single-purpose temperature prototype.
