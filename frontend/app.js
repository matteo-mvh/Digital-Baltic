const OCEAN_MANIFEST_URL = new URL("./data/ocean/manifest.json", window.location.href).toString();
const MAPLIBRE_JS_URL = "https://unpkg.com/maplibre-gl@5.6.2/dist/maplibre-gl.js";
const INFRASTRUCTURE_MANIFEST_URL = new URL("./infrastructure/manifest.json", window.location.href).toString();

const EOX_SATELLITE_TILES = "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2025_3857/default/g/{z}/{y}/{x}.jpg";
const EOX_LABELS_TILES = "https://tiles.maps.eox.at/wmts/1.0.0/overlay_base_3857/default/g/{z}/{y}/{x}.png";
const EOX_STREETS_TILES = "https://tiles.maps.eox.at/wmts/1.0.0/streets_3857/default/g/{z}/{y}/{x}.png";
const EOX_BRIGHT_LABELS_TILES = "https://tiles.maps.eox.at/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.png";
const EOX_BLACKMARBLE_TILES = "https://tiles.maps.eox.at/wmts/1.0.0/blackmarble_3857/default/g/{z}/{y}/{x}.jpg";
const EOX_COASTLINE_TILES = "https://tiles.maps.eox.at/wmts/1.0.0/coastline_3857/default/g/{z}/{y}/{x}.png";

const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", short: "EN", enabled: true },
  { code: "da", label: "Dansk", short: "DA", enabled: false },
  { code: "de", label: "Deutsch", short: "DE", enabled: false },
  { code: "pl", label: "Polski", short: "PL", enabled: false },
  { code: "lt", label: "Lietuvių", short: "LT", enabled: false },
  { code: "lv", label: "Latviešu", short: "LV", enabled: false },
  { code: "et", label: "Eesti", short: "ET", enabled: false },
  { code: "fi", label: "Suomi", short: "FI", enabled: false },
  { code: "sv", label: "Svenska", short: "SV", enabled: false },
  { code: "ru", label: "Русский", short: "RU", enabled: false }
];

const bodyEl = document.body;
const paletteButtonEl = document.getElementById("palette-button");
const paletteCurrentEl = document.getElementById("palette-current");
const paletteMenuEl = document.getElementById("palette-menu");
const languageButtonEl = document.getElementById("language-button");
const languageCurrentEl = document.getElementById("language-current");
const languageMenuEl = document.getElementById("language-menu");
const heroEnterMapEl = document.getElementById("hero-enter-map");
const topEnterMapEl = document.getElementById("enter-map-top");
const previewEnterMapEl = document.getElementById("preview-enter-map");
const exitMapEl = document.getElementById("exit-map");
const mapContainerEl = document.getElementById("map");
const viewToggleEl = document.getElementById("view-toggle");
const temperatureToggleEl = document.getElementById("temperature-toggle");
const currentsToggleEl = document.getElementById("currents-toggle");
const salinityToggleEl = document.getElementById("salinity-toggle");
const oxygenToggleEl = document.getElementById("oxygen-toggle");
const wavesToggleEl = document.getElementById("waves-toggle");
const seaLevelToggleEl = document.getElementById("sea-level-toggle");
const noiseToggleEl = document.getElementById("noise-toggle");
const noisePanelEl = document.getElementById("noise-panel");
const noiseCategoryListEl = document.getElementById("noise-category-list");
const noiseLegendEl = document.getElementById("noise-legend");
const infrastructureToggleEl = document.getElementById("infrastructure-toggle");
const infrastructurePanelEl = document.getElementById("infrastructure-panel");
const infrastructureCategoryListEl = document.getElementById("infrastructure-category-list");
const infrastructureLegendEl = document.getElementById("infrastructure-legend");
const overlayInfoPanelEl = document.getElementById("overlay-info-panel");
const overlayInfoTitleEl = document.getElementById("overlay-info-title");
const overlayInfoSubtitleEl = document.getElementById("overlay-info-subtitle");
const overlayInfoBodyEl = document.getElementById("overlay-info-body");
const overlayInfoCloseEl = document.getElementById("overlay-info-close");
const mapBottomLeftEl = document.getElementById("map-bottom-left");
const activeOverlayControlsEl = document.getElementById("active-overlay-controls");
const timeSliderEl = document.getElementById("time-slider");
const timePrimaryEl = document.getElementById("time-primary");
const timeSecondaryEl = document.getElementById("time-secondary");
const oceanConditionPanelEl = document.getElementById("ocean-condition-panel");
const oceanConditionCardLabelEl = document.getElementById("ocean-condition-card-label");
const oceanConditionCardSummaryEl = document.getElementById("ocean-condition-card-summary");
const oceanConditionCurrentValueEl = document.getElementById("ocean-condition-current-value");
const oceanConditionCurrentNoteEl = document.getElementById("ocean-condition-current-note");
const oceanConditionLegendEl = document.getElementById("ocean-condition-legend");
const oceanConditionLegendTitleEl = document.getElementById("ocean-condition-legend-title");
const oceanConditionLegendRangeEl = document.getElementById("ocean-condition-legend-range");
const oceanConditionLegendBarEl = document.getElementById("ocean-condition-legend-bar");
const oceanConditionLegendMinEl = document.getElementById("ocean-condition-legend-min");
const oceanConditionLegendUnitEl = document.getElementById("ocean-condition-legend-unit");
const oceanConditionLegendMaxEl = document.getElementById("ocean-condition-legend-max");
const oceanConditionRenderModeListEl = document.getElementById("ocean-condition-render-mode-list");
const oceanConditionPlaceholderEl = document.getElementById("ocean-condition-placeholder");
const mapHeadlineTitleEl = document.getElementById("map-headline-title");
const mapHeadlineTimeEl = document.getElementById("map-headline-time");
const sourceSummaryEl = document.getElementById("source-summary");
const sourceDetailEl = document.getElementById("source-detail");
const transparencyDetailEl = document.getElementById("transparency-detail");
const clickPanelEl = document.getElementById("click-panel");
const clickedPrimaryValueEl = document.getElementById("clicked-primary-value");
const clickedLayerNameEl = document.getElementById("clicked-layer-name");
const clickedTimeEl = document.getElementById("clicked-time");
const clickedCoordinatesEl = document.getElementById("clicked-coordinates");
const legendPanelEl = document.getElementById("legend-panel");
const legendRangeEl = document.getElementById("legend-range");
const legendMinEl = document.getElementById("legend-min");
const legendMaxEl = document.getElementById("legend-max");
const statusPanelEl = document.getElementById("status-panel");
const statusMessageEl = document.getElementById("status-message");
const paletteOptionEls = Array.from(document.querySelectorAll("[data-palette]"));
const palettePreviewEls = Array.from(document.querySelectorAll("[data-palette-preview]"));
const controlCardToggleEls = Array.from(document.querySelectorAll("[data-control-card-toggle]"));
const overlayInfoButtonEls = Array.from(document.querySelectorAll("[data-overlay-info-button]"));

const OCEAN_CONDITION_ORDER = ["temperature", "currents", "salinity", "oxygen", "waves", "seaLevel"];

const OCEAN_CONDITION_BUTTONS = {
  temperature: temperatureToggleEl,
  currents: currentsToggleEl,
  salinity: salinityToggleEl,
  oxygen: oxygenToggleEl,
  waves: wavesToggleEl,
  seaLevel: seaLevelToggleEl
};

const CONTROL_CARD_ELEMENTS = {
  oceanCondition: oceanConditionPanelEl,
  noise: noisePanelEl,
  infrastructure: infrastructurePanelEl
};

const CONTROL_CARD_DEFINITIONS = {
  oceanCondition: {
    controlPriority: 10,
    active: () => Boolean(activeConditionDefinition()),
    summary: () => oceanConditionCardSummary()
  },
  noise: {
    controlPriority: 30,
    active: () => state.noise.active,
    summary: () => `${activeNoiseCategoryCount()} ${activeNoiseCategoryCount() === 1 ? "layer" : "layers"}`
  },
  infrastructure: {
    controlPriority: 40,
    active: () => state.infrastructure.active,
    summary: () =>
      `${activeInfrastructureCategoryCount()} ${activeInfrastructureCategoryCount() === 1 ? "layer" : "layers"}`
  }
};

const OCEAN_CONDITION_PLACEHOLDERS = {
  temperature: {
    title: "Surface temperature placeholder",
    copy: "This card is ready for the shared time control, live colour legend, and local value sampling once processed temperature frames are available."
  },
  currents: {
    title: "Currents placeholder",
    copy: "This card is ready for shared time, speed legend, and planned current-direction visualization modes while the processed current dataset is prepared."
  },
  salinity: {
    title: "Salinity placeholder",
    copy: "This card is ready for shared time and a salinity colour legend as soon as local salinity frames are added."
  },
  oxygen: {
    title: "Oxygen placeholder",
    copy: "This card is ready for shared time and an oxygen legend, with room for future depth-aware controls when the dataset arrives."
  },
  waves: {
    title: "Waves placeholder",
    copy: "This card is ready for shared time, wave-height legend, and planned animation modes while the processed wave frames are still pending."
  },
  seaLevel: {
    title: "Sea level placeholder",
    copy: "This card is ready for shared time and a sea-level legend as soon as local sea-level frames are added."
  }
};

const INFRASTRUCTURE_CATEGORY_ORDER = [
  "ports",
  "powerPlants",
  "windFarms",
  "cables",
  "pipelines",
  "shipping",
  "landUse"
];

const INFRASTRUCTURE_STYLES = {
  ports: {
    layerType: "circle",
    labelKey: "infrastructure.ports",
    fallbackLabel: "Ports & harbours",
    styleLabelKey: "infrastructure.stylePoint",
    styleFallback: "Point markers",
    legendType: "point",
    color: "#92d8d0",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 4, 12, 7, 15, 10],
      "circle-color": "#92d8d0",
      "circle-stroke-color": "#081623",
      "circle-stroke-width": 1.6,
      "circle-opacity": 0.92
    }
  },
  powerPlants: {
    layerType: "circle",
    labelKey: "infrastructure.powerPlants",
    fallbackLabel: "Power plants",
    styleLabelKey: "infrastructure.stylePoint",
    styleFallback: "Point markers",
    legendType: "point",
    color: "#f2a85a",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 4, 12, 6.5, 15, 9],
      "circle-color": "#f2a85a",
      "circle-stroke-color": "#081623",
      "circle-stroke-width": 1.6,
      "circle-opacity": 0.92
    }
  },
  windFarms: {
    layerType: "fill",
    labelKey: "infrastructure.windFarms",
    fallbackLabel: "Offshore wind farms",
    styleLabelKey: "infrastructure.stylePolygon",
    styleFallback: "Polygon zones",
    legendType: "fill",
    color: "rgba(123, 208, 198, 0.2)",
    lineColor: "#7bd0c6",
    paint: {
      "fill-color": "#7bd0c6",
      "fill-opacity": 0.18
    },
    outlinePaint: {
      "line-color": "#8ee3d4",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 0.8, 12, 1.4],
      "line-opacity": 0.9
    }
  },
  cables: {
    layerType: "line",
    labelKey: "infrastructure.cables",
    fallbackLabel: "Submarine cables",
    styleLabelKey: "infrastructure.styleLine",
    styleFallback: "Thin lines",
    legendType: "line",
    color: "#6bc1ff",
    paint: {
      "line-color": "#6bc1ff",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 1, 12, 2.2],
      "line-opacity": 0.82
    }
  },
  pipelines: {
    layerType: "line",
    labelKey: "infrastructure.pipelines",
    fallbackLabel: "Pipelines",
    styleLabelKey: "infrastructure.styleDashed",
    styleFallback: "Dashed lines",
    legendType: "dashed",
    color: "#e0b86a",
    paint: {
      "line-color": "#e0b86a",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 1, 12, 2.2],
      "line-dasharray": [2, 1.3],
      "line-opacity": 0.82
    }
  },
  shipping: {
    layerType: "line",
    labelKey: "infrastructure.shipping",
    fallbackLabel: "Shipping routes",
    styleLabelKey: "infrastructure.styleCorridor",
    styleFallback: "Traffic corridors",
    legendType: "route",
    color: "rgba(111, 170, 230, 0.55)",
    paint: {
      "line-color": "#6fa9e6",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 4, 12, 10],
      "line-blur": 1.1,
      "line-opacity": 0.34
    },
    accentPaint: {
      "line-color": "#9dd4ff",
      "line-width": ["interpolate", ["linear"], ["zoom"], 5, 1, 12, 2.2],
      "line-opacity": 0.6
    }
  },
  landUse: {
    layerType: "fill",
    labelKey: "infrastructure.landUse",
    fallbackLabel: "General land use",
    styleLabelKey: "infrastructure.styleMutedFill",
    styleFallback: "Muted land overlay",
    legendType: "fill",
    color: "rgba(138, 175, 120, 0.16)",
    lineColor: "rgba(188, 215, 164, 0.45)",
    paint: {
      "fill-color": [
        "match",
        ["get", "land_use"],
        "Urban / built-up", "#9096b5",
        "Agriculture", "#b7a25f",
        "Forest", "#3f6d44",
        "Wetlands / natural areas", "#5e8f84",
        "Industrial areas", "#86625b",
        "#7b8f78"
      ],
      "fill-opacity": 0.14
    },
    outlinePaint: {
      "line-color": "rgba(215, 225, 232, 0.18)",
      "line-width": 0.8,
      "line-opacity": 0.55
    }
  }
};

const NOISE_LAYER_DEFINITIONS = {
  continuousNoise: {
    labelKey: "noise.continuousNoise",
    fallbackLabel: "Continuous noise",
    type: "raster",
    source: "HELCOM HOLAS 3 / HELCOM MADS",
    period: "2016-2021 assessment",
    units: "Assessment pressure, not dB",
    tiles: [
      "https://maps.helcom.fi/arcgis/rest/services/MADS/Pressures/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=png32&transparent=true&layers=show:201&f=image"
    ],
    paint: { "raster-opacity": 0.56, "raster-fade-duration": 0 },
    legendLabelKey: "noise.legendContinuous",
    legendFallback: "HELCOM continuous-noise pressure"
  },
  impulsiveEvents: {
    labelKey: "noise.impulsiveEvents",
    fallbackLabel: "Noise events",
    type: "events",
    source: "HELCOM HOLAS 3 / HELCOM-OSPAR impulsive noise register",
    period: "2016-2021",
    pointsUrl:
      "https://maps.helcom.fi/arcgis/rest/services/MADS/Indicators_and_assessments/MapServer/413/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=geojson",
    polygonsUrl:
      "https://maps.helcom.fi/arcgis/rest/services/MADS/Indicators_and_assessments/MapServer/412/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=geojson",
    legendLabelKey: "noise.legendEvents",
    legendFallback: "Reported impulsive events"
  },
  impulsivePressure: {
    labelKey: "noise.impulsivePressure",
    fallbackLabel: "Impulsive noise pressure",
    type: "raster",
    source: "HELCOM HOLAS 3 Dataset (2023)",
    period: "2016-2021",
    units: "Normalized pressure index",
    tiles: [
      "https://maps.helcom.fi/arcgis/rest/services/MADS/Pressures/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=png32&transparent=true&layers=show:202&f=image"
    ],
    paint: { "raster-opacity": 0.52, "raster-fade-duration": 0 },
    legendLabelKey: "noise.legendImpulsivePressure",
    legendFallback: "HELCOM impulsive-noise pressure"
  },
  ecologicalEffect: {
    labelKey: "noise.ecologicalEffect",
    fallbackLabel: "Noise impact on mobile species",
    type: "raster",
    source: "HELCOM HOLAS 3 SPIA",
    period: "2016-2021",
    units: "Ecological impact index",
    tiles: [
      "https://maps.helcom.fi/arcgis/rest/services/MADS/Pressures/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&imageSR=3857&size=256,256&format=png32&transparent=true&layers=show:223&f=image"
    ],
    paint: { "raster-opacity": 0.5, "raster-fade-duration": 0 },
    legendLabelKey: "noise.legendImpact",
    legendFallback: "Potential impact on mobile species"
  }
};

const NOISE_CATEGORY_ORDER = ["continuousNoise", "impulsiveEvents", "impulsivePressure", "ecologicalEffect"];

const NOISE_EVENT_GROUPS = {
  pile_driving: { labelKey: "noise.eventPileDriving", fallbackLabel: "Pile driving", color: "#f3b067" },
  seismic_airgun: { labelKey: "noise.eventSeismic", fallbackLabel: "Seismic / airguns", color: "#dd7862" },
  explosion: { labelKey: "noise.eventExplosion", fallbackLabel: "Explosions", color: "#f05a7b" },
  sonar_deterrent: { labelKey: "noise.eventSonar", fallbackLabel: "Sonar / deterrents", color: "#8f8ef7" },
  other_impulsive: { labelKey: "noise.eventOther", fallbackLabel: "Other impulsive noise", color: "#90c9f9" },
  unknown: { labelKey: "noise.eventUnknown", fallbackLabel: "Unknown event", color: "#c8d4dc" }
};

const OCEAN_RENDER_MODE_OPTIONS = {
  currents: [
    { id: "speedParticles", label: "Speed + particles" },
    { id: "particlesOnly", label: "Particles only" },
    { id: "arrows", label: "Arrows" }
  ],
  waves: [
    { id: "heightStreaks", label: "Height + streaks" },
    { id: "streaksOnly", label: "Streaks only" },
    { id: "arrows", label: "Arrows" }
  ]
};

const OVERLAY_INFO_CONTENT = {
  temperature: {
    title: "Surface temperature",
    subtitle: "The Baltic’s skin temperature shapes seasons, mixing, species stress and coastal life.",
    sections: [
      {
        heading: "What is it?",
        body: "Surface temperature shows how warm or cold the uppermost ocean layer is. In the Baltic Sea it changes quickly with season, sunlight, wind and freshwater input, so it is one of the clearest ways to see the sea reacting to weather and climate."
      },
      {
        heading: "How do we measure it?",
        body: "Here it is shown from Copernicus Marine model data, which combines observations, physics and forecasting systems. In practice, surface temperature is also tracked by satellites, buoys, ships and coastal stations."
      },
      {
        heading: "Why is it important?",
        body: "Temperature affects oxygen levels, algae growth, fish habitat, stratification and how comfortable or stressful the sea is for marine life. Warmer surface waters can also strengthen heat stress in shallow coastal areas."
      },
      {
        heading: "How can we improve bad impacts of it?",
        body: "We cannot locally 'turn down' sea temperature, but we can reduce the damage it causes by cutting nutrient pollution, restoring habitats such as eelgrass, protecting refuges for marine life and lowering global greenhouse-gas emissions."
      },
      {
        heading: "How is it connected to climate change?",
        body: "Climate change is pushing the Baltic toward warmer average conditions, more marine heat extremes and longer warm seasons. That amplifies oxygen stress, shifts ecosystems and can make harmful blooms and coastal impacts more likely."
      }
    ]
  },
  currents: {
    title: "Currents",
    subtitle: "Currents move heat, salt, oxygen, larvae, nutrients and pollution through the Baltic.",
    sections: [
      {
        heading: "What is it?",
        body: "Currents describe the direction and speed of moving seawater. In the Baltic they are shaped by wind, sea-level differences, narrow straits, coastline geometry and density contrasts between fresher and saltier water."
      },
      {
        heading: "How do we measure it?",
        body: "This layer is based on Copernicus Marine model output. Currents can also be measured with drifting buoys, coastal radars, ship instruments and moored current profilers."
      },
      {
        heading: "Why is it important?",
        body: "Currents control how quickly oxygen, nutrients, heat and contaminants are redistributed. They also matter for larval transport, shipping conditions, search and rescue, spill response and how coastal ecosystems are connected."
      },
      {
        heading: "How can we improve bad impacts of it?",
        body: "We cannot directly engineer Baltic circulation at large scale, but we can reduce risks carried by the water itself by cutting pollution releases, improving wastewater treatment, preparing for spill events and protecting coastal habitats that buffer local impacts."
      },
      {
        heading: "How is it connected to climate change?",
        body: "Climate change can alter winds, river runoff, stratification and sea-level patterns, which can all reshape circulation. Even subtle current changes matter because they influence where heat, salt, oxygen stress and pollutants accumulate."
      }
    ]
  },
  salinity: {
    title: "Salinity",
    subtitle: "Salinity is one of the Baltic Sea’s defining features and controls which species can live where.",
    sections: [
      {
        heading: "What is it?",
        body: "Salinity describes how much dissolved salt is in the water. The Baltic is brackish, not fully marine, and its strong salinity gradient from west to east is a major reason the region has such distinctive ecosystems."
      },
      {
        heading: "How do we measure it?",
        body: "This map uses Copernicus Marine model data. In the field, salinity is commonly measured with conductivity sensors on buoys, research vessels, gliders and monitoring stations."
      },
      {
        heading: "Why is it important?",
        body: "Salinity influences density, layering, circulation and oxygen exchange. It also sets biological limits: some marine species need saltier water, while freshwater species tolerate much lower salinity."
      },
      {
        heading: "How can we improve bad impacts of it?",
        body: "Salinity itself is mostly controlled by climate, runoff and exchanges with the North Sea, so direct management is limited. What we can do is manage ecosystems and coastal planning around the stress that salinity shifts create."
      },
      {
        heading: "How is it connected to climate change?",
        body: "Climate-driven changes in rainfall, river discharge and large-scale circulation can freshen or redistribute Baltic waters. That can shift habitats, alter stratification and change how oxygen and nutrients move through the system."
      }
    ]
  },
  oxygen: {
    title: "Oxygen",
    subtitle: "Oxygen is a direct health signal for the Baltic because low oxygen means ecological stress or collapse.",
    sections: [
      {
        heading: "What is it?",
        body: "This layer shows dissolved oxygen in seawater. Marine animals and many ecological processes depend on it, and when oxygen becomes too low, bottom habitats can degrade or become unlivable."
      },
      {
        heading: "How do we measure it?",
        body: "Here it comes from Copernicus Marine biogeochemical model data. Oxygen is also measured directly with monitoring stations, ship surveys and sensor packages lowered through the water column."
      },
      {
        heading: "Why is it important?",
        body: "Low-oxygen and hypoxic areas are among the Baltic’s best-known environmental problems. Oxygen stress harms benthic life, changes food webs, can release more nutrients from sediments and reduces the resilience of the whole sea."
      },
      {
        heading: "How can we improve bad impacts of it?",
        body: "The biggest lever is reducing nutrient pollution from agriculture, wastewater and runoff. Protecting wetlands, restoring coastal habitats and improving land-based nutrient management all help reduce the conditions that fuel oxygen depletion."
      },
      {
        heading: "How is it connected to climate change?",
        body: "Warmer water holds less oxygen, and stronger stratification can reduce ventilation of deeper layers. Climate change therefore makes an existing Baltic problem harder to solve, especially when nutrient inputs remain high."
      }
    ]
  },
  waves: {
    title: "Waves",
    subtitle: "Waves connect weather, coastlines, safety and ecosystem stress across the Baltic.",
    sections: [
      {
        heading: "What is it?",
        body: "This layer focuses on significant wave height, which is a standard way to describe the overall sea state. Waves are generated mainly by wind and are shaped by fetch, storms, coastline geometry and water depth."
      },
      {
        heading: "How do we measure it?",
        body: "The map uses Copernicus Marine wave-model output. In reality, waves are also measured with buoys, offshore platforms, coastal radars and ship observations."
      },
      {
        heading: "Why is it important?",
        body: "Waves affect coastal erosion, harbour operations, ferry safety, offshore work and habitat disturbance in shallow waters. They also influence sediment transport and how exposed coastlines absorb storm energy."
      },
      {
        heading: "How can we improve bad impacts of it?",
        body: "We cannot stop storms, but we can reduce wave damage by protecting dunes and wetlands, avoiding risky coastal construction, improving harbour planning and maintaining natural shoreline buffers instead of hardening every edge."
      },
      {
        heading: "How is it connected to climate change?",
        body: "Climate change can alter storm tracks, ice cover and coastal exposure. Less seasonal sea ice in parts of the Baltic can leave shorelines exposed to wave action for longer periods, increasing erosion and infrastructure stress."
      }
    ]
  },
  seaLevel: {
    title: "Sea level",
    subtitle: "Sea level links open-water conditions, coasts, flooding risk and long-term adaptation.",
    sections: [
      {
        heading: "What is it?",
        body: "Sea level describes the height of the sea surface relative to a reference level. In the Baltic it changes because of winds, atmospheric pressure, circulation, freshwater inflow and longer-term regional sea-level trends."
      },
      {
        heading: "How do we measure it?",
        body: "This layer uses Copernicus Marine model data. Sea level is also monitored through coastal tide gauges, harbour measurements and satellite altimetry."
      },
      {
        heading: "Why is it important?",
        body: "Sea level matters for flooding, storm surge exposure, port operations, drainage systems, coastal ecosystems and long-lived infrastructure. Even modest changes can matter when they combine with storms and waves."
      },
      {
        heading: "How can we improve bad impacts of it?",
        body: "The best responses are adaptation and smart planning: avoid building in the most exposed zones, redesign drainage and flood protection, restore coastal buffers and plan infrastructure for higher future water levels."
      },
      {
        heading: "How is it connected to climate change?",
        body: "Global sea-level rise raises the baseline onto which Baltic storms and surges are added. That means events that used to be unusual can become more frequent or more damaging over time."
      }
    ]
  },
  noise: {
    title: "Underwater noise",
    subtitle: "Sound pollution is an invisible pressure that travels far in water and affects marine animals.",
    sections: [
      {
        heading: "What is it?",
        body: "This overlay shows underwater-noise pressure and reported impulsive events such as pile driving or seismic activity. It is environmental context rather than a live microphone feed."
      },
      {
        heading: "How do we measure it?",
        body: "The current layer is based on HELCOM assessment products and reported activity records. Underwater noise can also be measured directly with hydrophones and specialised monitoring stations."
      },
      {
        heading: "Why is it important?",
        body: "Many marine animals rely on sound to navigate, communicate, find food and avoid danger. Too much human-made noise can mask those signals, create stress and disturb migration, feeding or breeding behaviour."
      },
      {
        heading: "How can we improve bad impacts of it?",
        body: "We can reduce noise by slowing ships in sensitive areas, changing routes, improving propeller and hull design, using quieter construction methods and planning noisy activities away from key habitats or seasons."
      },
      {
        heading: "How is it connected to climate change?",
        body: "Climate change does not create underwater noise directly, but it interacts with it by adding stress. Species already challenged by warming, oxygen loss or habitat shifts may become less resilient to chronic sound disturbance."
      }
    ]
  },
  infrastructure: {
    title: "Coastal and marine infrastructure",
    subtitle: "Infrastructure reveals how strongly the Baltic Sea is tied to transport, energy and coastal economies.",
    sections: [
      {
        heading: "What is it?",
        body: "This overlay combines ports, routes, cables, pipelines, wind farms, power plants and land-use context. It helps explain where human systems meet the sea and where ecological pressures or conflicts can concentrate."
      },
      {
        heading: "How do we measure it?",
        body: "The current version is a curated open-data prototype assembled from multiple sources. Unlike the ocean-condition layers, it is mostly static reference context rather than a continuously updating model field."
      },
      {
        heading: "Why is it important?",
        body: "Infrastructure shapes shipping, energy supply, risk exposure, coastal development and how easily pollution or disturbance can spread through busy marine areas. It is essential context for understanding where environmental pressure comes from."
      },
      {
        heading: "How can we improve bad impacts of it?",
        body: "Better planning matters: place new infrastructure carefully, reduce conflicts with habitats, improve port and shipping efficiency, harden vulnerable assets against storms and design projects around ecological constraints rather than after them."
      },
      {
        heading: "How is it connected to climate change?",
        body: "Climate change raises the stakes for coastal infrastructure by increasing heat stress, flood risk, shoreline change and storm exposure. At the same time, the energy transition is adding new marine infrastructure such as offshore wind, which must be planned well."
      }
    ]
  }
};

const state = {
  locale: "en",
  translations: {},
  oceanManifest: null,
  oceanConditions: {},
  oceanQueryIndices: {},
  oceanFrameData: {},
  metadata: null,
  map: null,
  maplibregl: null,
  popup: null,
  activeFrameIndex: 0,
  requestedTimeUtc: null,
  mode: "home",
  labelsVisible: true,
  activeConditionId: "temperature",
  satelliteWorking: false,
  selectedLocation: null,
  palette: "blueRed",
  controlCards: {
    collapsed: {},
    mobileExpandedId: null
  },
  oceanRenderModes: {
    currents: "speedParticles",
    waves: "heightStreaks"
  },
  overlayInfoId: null,
  oceanVisuals: {
    sourceIds: new Set(),
    requestToken: 0,
    renderCache: new Map()
  },
  selectedLocationRequestToken: 0,
  infrastructure: {
    active: false,
    loaded: false,
    manifest: null,
    categories: Object.fromEntries(INFRASTRUCTURE_CATEGORY_ORDER.map((id) => [id, true])),
    loadedCategories: {},
    interactiveLayerIds: []
  },
  noise: {
    active: false,
    categories: {
      continuousNoise: true,
      impulsiveEvents: true,
      impulsivePressure: false,
      ecologicalEffect: false
    },
    loaded: {}
  }
};

const TEMPERATURE_PALETTES = {
  blueRed: {
    labelKey: "accessibility.blueRed",
    fallbackLabel: "Blue to red",
    stops: [
      { stop: 0, color: "#183b72" },
      { stop: 0.18, color: "#266f9e" },
      { stop: 0.42, color: "#42b1c0" },
      { stop: 0.6, color: "#8adfc4" },
      { stop: 0.8, color: "#ffda74" },
      { stop: 0.92, color: "#f07a45" },
      { stop: 1, color: "#cd4539" }
    ]
  },
  greenRed: {
    labelKey: "accessibility.greenRed",
    fallbackLabel: "Green to red",
    stops: [
      { stop: 0, color: "#104f2a" },
      { stop: 0.24, color: "#2f8f46" },
      { stop: 0.5, color: "#8acb5a" },
      { stop: 0.72, color: "#f1df72" },
      { stop: 0.88, color: "#f08b49" },
      { stop: 1, color: "#b32020" }
    ]
  },
  grayscale: {
    labelKey: "accessibility.grayscale",
    fallbackLabel: "Grayscale",
    stops: [
      { stop: 0, color: "#121212" },
      { stop: 0.2, color: "#3a3a3a" },
      { stop: 0.45, color: "#707070" },
      { stop: 0.7, color: "#b3b3b3" },
      { stop: 1, color: "#f4f4f4" }
    ]
  },
  yellowBlue: {
    labelKey: "accessibility.yellowBlue",
    fallbackLabel: "Yellow to blue",
    stops: [
      { stop: 0, color: "#ffe16a" },
      { stop: 0.2, color: "#f6c85f" },
      { stop: 0.42, color: "#9bd0e0" },
      { stop: 0.65, color: "#4f95d1" },
      { stop: 0.84, color: "#2459a6" },
      { stop: 1, color: "#102b6d" }
    ]
  }
};

const TRANSPARENT_IMAGE_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAuMBg6nxsVgAAAAASUVORK5CYII=";

function getTranslationValue(path, params = {}) {
  const value = path.split(".").reduce((current, key) => current?.[key], state.translations);
  if (typeof value !== "string") {
    return null;
  }
  return value.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`));
}

function t(path, fallback, params = {}) {
  return getTranslationValue(path, params) ?? fallback;
}

async function loadTranslations(locale) {
  const response = await fetch(`./locales/${locale}.json`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Locale ${locale} could not be loaded.`);
  }
  state.translations = await response.json();
  state.locale = locale;
}

function renderLanguageMenu() {
  languageMenuEl.innerHTML = "";
  for (const language of SUPPORTED_LANGUAGES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "language-option";
    button.disabled = !language.enabled;
    if (language.code === state.locale) {
      button.classList.add("is-active");
    }

    const label = document.createElement("span");
    label.textContent = language.label;
    const meta = document.createElement("span");
    meta.className = "language-meta";
    meta.textContent = language.enabled ? t("common.live", "Live") : t("common.comingSoon", "Coming soon");
    button.append(label, meta);

    button.addEventListener("click", async () => {
      if (!language.enabled || language.code === state.locale) {
        closeLanguageMenu();
        return;
      }
      await loadTranslations(language.code);
      applyTranslations();
      closeLanguageMenu();
    });

    languageMenuEl.appendChild(button);
  }
}

function applyTranslations() {
  document.documentElement.lang = state.locale;
  for (const node of document.querySelectorAll("[data-i18n]")) {
    const key = node.dataset.i18n;
    const translated = getTranslationValue(key);
    if (translated) {
      node.textContent = translated;
    }
  }
  languageCurrentEl.textContent = t("nav.languageCode", "EN");
  renderLanguageMenu();
  updateViewToggle();
  updateLayerToggleUi();
  updateStaticPanels();
  updatePaletteButtons();
  if (state.metadata) {
    updateChrome();
  }
}

function openLanguageMenu() {
  languageMenuEl.hidden = false;
  languageButtonEl.setAttribute("aria-expanded", "true");
}

function closeLanguageMenu() {
  languageMenuEl.hidden = true;
  languageButtonEl.setAttribute("aria-expanded", "false");
}

function openPaletteMenu() {
  paletteMenuEl.hidden = false;
  paletteButtonEl.setAttribute("aria-expanded", "true");
}

function closePaletteMenu() {
  paletteMenuEl.hidden = true;
  paletteButtonEl.setAttribute("aria-expanded", "false");
}

function bindLanguageMenu() {
  languageButtonEl.addEventListener("click", () => {
    if (languageMenuEl.hidden) {
      openLanguageMenu();
    } else {
      closeLanguageMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!languageMenuEl.hidden && !event.target.closest(".language-picker")) {
      closeLanguageMenu();
    }
    if (!paletteMenuEl.hidden && !event.target.closest(".palette-picker")) {
      closePaletteMenu();
    }
  });
}

function bindPaletteMenu() {
  paletteButtonEl.addEventListener("click", () => {
    if (paletteMenuEl.hidden) {
      openPaletteMenu();
    } else {
      closePaletteMenu();
    }
  });
}

function setMode(mode) {
  state.mode = mode;
  bodyEl.dataset.mode = mode;
  if (mode !== "map") {
    clickPanelEl.hidden = true;
    state.overlayInfoId = null;
    renderOverlayInfoPanel();
  }
  window.setTimeout(() => {
    state.map?.resize();
  }, 240);
}

function setStatus(message, tone = "neutral") {
  statusMessageEl.textContent = message;
  statusPanelEl.dataset.tone = tone;
  statusPanelEl.hidden = false;
}

function clearStatus() {
  statusPanelEl.hidden = true;
}

function formatTimestamp(value, timeZone = "UTC") {
  if (!value) {
    return "Timestamp unavailable";
  }

  const date = new Date(value);
  return `${new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone
  }).format(date)} ${timeZone === "UTC" ? "UTC" : ""}`.trim();
}

function formatCoordinate(value, positiveLabel, negativeLabel) {
  const label = value >= 0 ? positiveLabel : negativeLabel;
  return `${Math.abs(value).toFixed(4)} ${label}`;
}

function activeConditionDefinition() {
  return state.oceanConditions[state.activeConditionId]?.condition ?? null;
}

function activeConditionMetadata() {
  return state.oceanConditions[state.activeConditionId]?.metadata ?? null;
}

function oceanLayerVisible() {
  return Boolean(state.activeConditionId && activeConditionHasLocalData());
}

function currentFrame() {
  return activeConditionMetadata()?.frames?.[state.activeFrameIndex] ?? null;
}

function visibleViewportBbox() {
  const bounds = state.map.getBounds();
  return [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
}

function imageCoordinatesFromBbox(bbox) {
  return [
    [bbox[0][0], bbox[1][1]],
    [bbox[1][0], bbox[1][1]],
    [bbox[1][0], bbox[0][1]],
    [bbox[0][0], bbox[0][1]]
  ];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, ratio) {
  return start + (end - start) * ratio;
}

function oceanPaletteName() {
  return state.palette;
}

function renderModeOptions(conditionId = state.activeConditionId) {
  return OCEAN_RENDER_MODE_OPTIONS[conditionId] ?? [];
}

function activeRenderModeId(conditionId = state.activeConditionId) {
  const options = renderModeOptions(conditionId);
  if (options.length === 0) {
    return null;
  }
  return state.oceanRenderModes[conditionId] ?? options[0].id;
}

function oceanScalarLayerVisible() {
  if (!oceanLayerVisible()) {
    return false;
  }
  if (state.activeConditionId === "currents") {
    return activeRenderModeId() === "speedParticles";
  }
  if (state.activeConditionId === "waves") {
    return activeRenderModeId() === "heightStreaks";
  }
  return true;
}

function oceanVectorLayerVisible() {
  return oceanLayerVisible() && (state.activeConditionId === "currents" || state.activeConditionId === "waves");
}

function emptyFeatureCollection() {
  return { type: "FeatureCollection", features: [] };
}

function buildCellEdges(values) {
  const numeric = values.map((value) => Number(value));
  if (numeric.length === 1) {
    return [numeric[0] - 0.05, numeric[0] + 0.05];
  }
  const edges = new Array(numeric.length + 1);
  edges[0] = numeric[0] - (numeric[1] - numeric[0]) / 2;
  for (let index = 1; index < numeric.length; index += 1) {
    edges[index] = (numeric[index - 1] + numeric[index]) / 2;
  }
  edges[numeric.length] = numeric[numeric.length - 1] + (numeric[numeric.length - 1] - numeric[numeric.length - 2]) / 2;
  return edges;
}

function queryIndexGeometryCache(queryIndex) {
  if (!queryIndex) {
    return null;
  }
  if (queryIndex.__geometryCache) {
    return queryIndex.__geometryCache;
  }
  const latitudes = queryIndex.latitudes ?? [];
  const longitudes = queryIndex.longitudes ?? [];
  queryIndex.__geometryCache = {
    latEdges: buildCellEdges(latitudes),
    lonEdges: buildCellEdges(longitudes)
  };
  return queryIndex.__geometryCache;
}

function frameRenderCacheKey(conditionId, frameKey, paletteName, rowStart, rowEndExclusive, colStart, colEndExclusive, step, subdivision, stride) {
  return [
    conditionId,
    frameKey,
    paletteName,
    rowStart,
    rowEndExclusive,
    colStart,
    colEndExclusive,
    step,
    subdivision,
    stride
  ].join("|");
}

function findIntervalIndex(edges, target) {
  if (!Array.isArray(edges) || edges.length < 2) {
    return 0;
  }
  if (target <= edges[0]) {
    return 0;
  }
  if (target >= edges[edges.length - 1]) {
    return edges.length - 2;
  }
  let low = 0;
  let high = edges.length - 2;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (target < edges[middle]) {
      high = middle - 1;
    } else if (target >= edges[middle + 1]) {
      low = middle + 1;
    } else {
      return middle;
    }
  }
  return clamp(low, 0, edges.length - 2);
}

function numericGridValue(grid, rowIndex, columnIndex) {
  const rawValue = grid?.[rowIndex]?.[columnIndex];
  if (rawValue === null || rawValue === undefined || rawValue === "") {
    return null;
  }
  const value = Number(rawValue);
  return Number.isFinite(value) ? value : null;
}

function componentFrame(frameData, componentName) {
  return frameData?.components?.[componentName] ?? null;
}

function rgbaString(color, alpha = 1) {
  const opacity = clamp(alpha, 0, 1);
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity.toFixed(3)})`;
}

function displayRangeForMetadata(metadata) {
  const range = metadata?.value_range_celsius ?? metadata?.value_range ?? null;
  return {
    min: Number.isFinite(Number(range?.display_min)) ? Number(range.display_min) : 0,
    max: Number.isFinite(Number(range?.display_max)) ? Number(range.display_max) : 1
  };
}

function valueToFillColor(value, metadata, conditionId = state.activeConditionId) {
  const range = displayRangeForMetadata(metadata);
  const span = Math.max(range.max - range.min, 1e-6);
  const normalized = clamp((value - range.min) / span, 0, 1);
  return rgbaString(interpolatePaletteColor(normalized, TEMPERATURE_PALETTES[oceanPaletteName(conditionId)]), 0.82);
}

function expandedViewportBbox() {
  const [west, south, east, north] = visibleViewportBbox();
  const lonPadding = Math.max((east - west) * 0.08, 0.15);
  const latPadding = Math.max((north - south) * 0.08, 0.12);
  return [west - lonPadding, south - latPadding, east + lonPadding, north + latPadding];
}

function scalarResolutionForZoom(zoom) {
  if (zoom < 5) {
    return { step: 4, subdivision: 1 };
  }
  if (zoom < 7) {
    return { step: 3, subdivision: 1 };
  }
  if (zoom < 8.5) {
    return { step: 2, subdivision: 1 };
  }
  if (zoom < 10.5) {
    return { step: 1, subdivision: 1 };
  }
  if (zoom < 12.5) {
    return { step: 1, subdivision: 2 };
  }
  return { step: 1, subdivision: 3 };
}

function vectorStrideForZoom(zoom) {
  if (zoom < 5) {
    return 8;
  }
  if (zoom < 7) {
    return 6;
  }
  if (zoom < 9) {
    return 4;
  }
  if (zoom < 11) {
    return 3;
  }
  return 2;
}

function interpolateStructuredValue(latitude, longitude, latitudes, longitudes, grid, latEdges = null, lonEdges = null) {
  if (!Array.isArray(latitudes) || !Array.isArray(longitudes) || latitudes.length === 0 || longitudes.length === 0) {
    return null;
  }
  const resolvedLatEdges = latEdges ?? buildCellEdges(latitudes);
  const resolvedLonEdges = lonEdges ?? buildCellEdges(longitudes);
  const row1 = clamp(findIntervalIndex(resolvedLatEdges, latitude) + 1, 0, latitudes.length - 1);
  const row0 = clamp(row1 > 0 ? row1 - 1 : row1, 0, latitudes.length - 1);
  const col1 = clamp(findIntervalIndex(resolvedLonEdges, longitude) + 1, 0, longitudes.length - 1);
  const col0 = clamp(col1 > 0 ? col1 - 1 : col1, 0, longitudes.length - 1);

  const rows = [...new Set([row0, row1])];
  const cols = [...new Set([col0, col1])];
  let weightedSum = 0;
  let weightTotal = 0;

  for (const rowIndex of rows) {
    for (const columnIndex of cols) {
      const value = numericGridValue(grid, rowIndex, columnIndex);
      if (value === null) {
        continue;
      }
      const sampleLat = Number(latitudes[rowIndex]);
      const sampleLon = Number(longitudes[columnIndex]);
      const cosLatitude = Math.max(Math.cos((latitude * Math.PI) / 180), 0.2);
      const distanceSquared = (sampleLat - latitude) ** 2 + ((sampleLon - longitude) * cosLatitude) ** 2;
      if (distanceSquared < 1e-10) {
        return value;
      }
      const weight = 1 / distanceSquared;
      weightedSum += value * weight;
      weightTotal += weight;
    }
  }

  return weightTotal > 0 ? weightedSum / weightTotal : null;
}

function interpolateVectorAt(latitude, longitude, latitudes, longitudes, eastwardGrid, northwardGrid, latEdges = null, lonEdges = null) {
  const eastward = interpolateStructuredValue(latitude, longitude, latitudes, longitudes, eastwardGrid, latEdges, lonEdges);
  const northward = interpolateStructuredValue(latitude, longitude, latitudes, longitudes, northwardGrid, latEdges, lonEdges);
  if (eastward === null || northward === null) {
    return null;
  }
  return { eastward, northward };
}

function ensureOceanSources() {
  if (!state.map || state.map.getSource("ocean-scalar-source")) {
    return;
  }

  const beforeLayerId = state.map.getLayer("selected-location-ring") ? "selected-location-ring" : undefined;
  state.map.addSource("ocean-scalar-source", { type: "geojson", data: emptyFeatureCollection() });
  state.map.addSource("ocean-shoreline-source", { type: "geojson", data: emptyFeatureCollection() });
  state.map.addSource("ocean-vector-source", { type: "geojson", data: emptyFeatureCollection() });

  state.map.addLayer(
    {
      id: "ocean-scalar-fill",
      type: "fill",
      source: "ocean-scalar-source",
      paint: {
        "fill-color": ["coalesce", ["get", "fillColor"], "rgba(0,0,0,0)"],
        "fill-opacity": 0,
        "fill-antialias": true
      }
    },
    beforeLayerId
  );
  state.map.addLayer(
    {
      id: "ocean-shoreline",
      type: "line",
      source: "ocean-shoreline-source",
      paint: {
        "line-color": "#f1ead2",
        "line-width": ["interpolate", ["linear"], ["zoom"], 4, 0.5, 10, 1.2, 14, 1.7],
        "line-opacity": 0
      },
      layout: {
        "line-join": "round",
        "line-cap": "round"
      }
    },
    beforeLayerId
  );
  state.map.addLayer(
    {
      id: "ocean-vector-shaft",
      type: "line",
      source: "ocean-vector-source",
      filter: ["==", ["get", "kind"], "shaft"],
      paint: {
        "line-color": ["coalesce", ["get", "strokeColor"], "#eaf7ff"],
        "line-width": ["coalesce", ["get", "strokeWidth"], 1.4],
        "line-opacity": 0,
        "line-dasharray": [1, 0]
      },
      layout: {
        "line-join": "round",
        "line-cap": "round"
      }
    },
    beforeLayerId
  );
  state.map.addLayer(
    {
      id: "ocean-vector-head",
      type: "line",
      source: "ocean-vector-source",
      filter: ["==", ["get", "kind"], "head"],
      paint: {
        "line-color": ["coalesce", ["get", "strokeColor"], "#f5fbff"],
        "line-width": ["coalesce", ["get", "strokeWidth"], 1.4],
        "line-opacity": 0
      },
      layout: {
        "line-join": "round",
        "line-cap": "round"
      }
    },
    beforeLayerId
  );
}

function updateOceanLayerStyles() {
  if (!state.map?.getLayer("ocean-scalar-fill")) {
    return;
  }

  const mode = activeRenderModeId();
  const scalarOpacity = oceanScalarLayerVisible() ? 0.78 : 0;
  const shorelineOpacity = oceanLayerVisible() ? 0.72 : 0;
  let shaftOpacity = 0;
  let headOpacity = 0;
  let dashArray = [1, 0];

  if (oceanVectorLayerVisible()) {
    if (mode === "arrows") {
      shaftOpacity = 0.88;
      headOpacity = 0.88;
    } else if (mode === "particlesOnly" || mode === "streaksOnly") {
      shaftOpacity = 0.9;
      dashArray = [0.5, 1.4];
    } else {
      shaftOpacity = 0.72;
      dashArray = [1, 0.9];
    }
  }

  state.map.setPaintProperty("ocean-scalar-fill", "fill-opacity", scalarOpacity);
  state.map.setPaintProperty("ocean-shoreline", "line-opacity", shorelineOpacity);
  state.map.setPaintProperty("ocean-vector-shaft", "line-opacity", shaftOpacity);
  state.map.setPaintProperty("ocean-vector-shaft", "line-dasharray", dashArray);
  state.map.setPaintProperty("ocean-vector-head", "line-opacity", headOpacity);
}

function buildOceanRenderCollections(queryIndex, frameData, metadata, condition, frameIndex, zoom) {
  const latitudes = queryIndex?.latitudes ?? [];
  const longitudes = queryIndex?.longitudes ?? [];
  const gridKey = metadata.query_value_key || condition.value_key || "values_celsius";
  const frameGrid = frameData?.[gridKey] ?? queryIndex?.[gridKey]?.[frameIndex] ?? null;
  if (!Array.isArray(frameGrid) || latitudes.length === 0 || longitudes.length === 0) {
    return {
      scalar: emptyFeatureCollection(),
      shoreline: emptyFeatureCollection(),
      vector: emptyFeatureCollection()
    };
  }

  const geometryCache = queryIndexGeometryCache(queryIndex);
  const latEdges = geometryCache?.latEdges ?? buildCellEdges(latitudes);
  const lonEdges = geometryCache?.lonEdges ?? buildCellEdges(longitudes);
  const [west, south, east, north] = expandedViewportBbox();
  const rowStart = clamp(findIntervalIndex(latEdges, south), 0, latitudes.length - 1);
  const rowEndExclusive = clamp(findIntervalIndex(latEdges, north) + 1, 1, latitudes.length);
  const colStart = clamp(findIntervalIndex(lonEdges, west), 0, longitudes.length - 1);
  const colEndExclusive = clamp(findIntervalIndex(lonEdges, east) + 1, 1, longitudes.length);
  const paletteConditionId = condition.id;

  let { step, subdivision } = scalarResolutionForZoom(zoom);
  let scalarEstimate =
    Math.max(Math.ceil((rowEndExclusive - rowStart) / step), 1) *
    Math.max(Math.ceil((colEndExclusive - colStart) / step), 1) *
    subdivision *
    subdivision;
  while (scalarEstimate > 4200) {
    if (subdivision > 1) {
      subdivision -= 1;
    } else {
      step += 1;
    }
    scalarEstimate =
      Math.max(Math.ceil((rowEndExclusive - rowStart) / step), 1) *
      Math.max(Math.ceil((colEndExclusive - colStart) / step), 1) *
      subdivision *
      subdivision;
  }

  let stride = vectorStrideForZoom(zoom);
  let vectorEstimate =
    Math.max(Math.ceil((rowEndExclusive - rowStart) / stride), 1) *
    Math.max(Math.ceil((colEndExclusive - colStart) / stride), 1);
  while (vectorEstimate > 900) {
    stride += 1;
    vectorEstimate =
      Math.max(Math.ceil((rowEndExclusive - rowStart) / stride), 1) *
      Math.max(Math.ceil((colEndExclusive - colStart) / stride), 1);
  }

  const cacheKey = frameRenderCacheKey(
    condition.id,
    frameData?.key ?? queryIndex?.frame_keys?.[frameIndex] ?? String(frameIndex),
    oceanPaletteName(condition.id),
    rowStart,
    rowEndExclusive,
    colStart,
    colEndExclusive,
    step,
    subdivision,
    stride
  );
  const cachedCollections = state.oceanVisuals.renderCache.get(cacheKey);
  if (cachedCollections) {
    return cachedCollections;
  }

  const scalarFeatures = [];
  const shorelineFeatures = [];
  const vectorFeatures = [];

  for (let rowIndex = rowStart; rowIndex < rowEndExclusive; rowIndex += step) {
    const rowStop = Math.min(rowIndex + step, rowEndExclusive);
    for (let columnIndex = colStart; columnIndex < colEndExclusive; columnIndex += step) {
      const columnStop = Math.min(columnIndex + step, colEndExclusive);

      if (step > 1) {
        let total = 0;
        let count = 0;
        const totalCells = (rowStop - rowIndex) * (columnStop - columnIndex);
        for (let coarseRow = rowIndex; coarseRow < rowStop; coarseRow += 1) {
          for (let coarseColumn = columnIndex; coarseColumn < columnStop; coarseColumn += 1) {
            const value = numericGridValue(frameGrid, coarseRow, coarseColumn);
            if (value === null) {
              continue;
            }
            total += value;
            count += 1;
          }
        }
        if (count === 0) {
          continue;
        }
        if (count < totalCells) {
          for (let coarseRow = rowIndex; coarseRow < rowStop; coarseRow += 1) {
            for (let coarseColumn = columnIndex; coarseColumn < columnStop; coarseColumn += 1) {
              const value = numericGridValue(frameGrid, coarseRow, coarseColumn);
              if (value === null) {
                continue;
              }
              scalarFeatures.push({
                type: "Feature",
                properties: {
                  fillColor: valueToFillColor(value, metadata, paletteConditionId)
                },
                geometry: {
                  type: "Polygon",
                  coordinates: [[
                    [lonEdges[coarseColumn], latEdges[coarseRow]],
                    [lonEdges[coarseColumn + 1], latEdges[coarseRow]],
                    [lonEdges[coarseColumn + 1], latEdges[coarseRow + 1]],
                    [lonEdges[coarseColumn], latEdges[coarseRow + 1]],
                    [lonEdges[coarseColumn], latEdges[coarseRow]]
                  ]]
                }
              });
            }
          }
          continue;
        }

        scalarFeatures.push({
          type: "Feature",
          properties: {
            fillColor: valueToFillColor(total / count, metadata, paletteConditionId)
          },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [lonEdges[columnIndex], latEdges[rowIndex]],
              [lonEdges[columnStop], latEdges[rowIndex]],
              [lonEdges[columnStop], latEdges[rowStop]],
              [lonEdges[columnIndex], latEdges[rowStop]],
              [lonEdges[columnIndex], latEdges[rowIndex]]
            ]]
          }
        });
        continue;
      }

      if (numericGridValue(frameGrid, rowIndex, columnIndex) === null) {
        continue;
      }

      const southEdge = latEdges[rowIndex];
      const northEdge = latEdges[rowIndex + 1];
      const westEdge = lonEdges[columnIndex];
      const eastEdge = lonEdges[columnIndex + 1];
      for (let subRow = 0; subRow < subdivision; subRow += 1) {
        const subSouth = lerp(southEdge, northEdge, subRow / subdivision);
        const subNorth = lerp(southEdge, northEdge, (subRow + 1) / subdivision);
        for (let subColumn = 0; subColumn < subdivision; subColumn += 1) {
          const subWest = lerp(westEdge, eastEdge, subColumn / subdivision);
          const subEast = lerp(westEdge, eastEdge, (subColumn + 1) / subdivision);
          const centerLatitude = (subSouth + subNorth) / 2;
          const centerLongitude = (subWest + subEast) / 2;
          const value = interpolateStructuredValue(centerLatitude, centerLongitude, latitudes, longitudes, frameGrid, latEdges, lonEdges);
          if (value === null) {
            continue;
          }
          scalarFeatures.push({
            type: "Feature",
            properties: {
              fillColor: valueToFillColor(value, metadata, paletteConditionId)
            },
            geometry: {
              type: "Polygon",
              coordinates: [[
                [subWest, subSouth],
                [subEast, subSouth],
                [subEast, subNorth],
                [subWest, subNorth],
                [subWest, subSouth]
              ]]
            }
          });
        }
      }
    }
  }

  for (let rowIndex = rowStart; rowIndex < rowEndExclusive; rowIndex += 1) {
    for (let columnIndex = colStart; columnIndex < colEndExclusive; columnIndex += 1) {
      if (numericGridValue(frameGrid, rowIndex, columnIndex) === null) {
        continue;
      }
      const southEdge = latEdges[rowIndex];
      const northEdge = latEdges[rowIndex + 1];
      const westEdge = lonEdges[columnIndex];
      const eastEdge = lonEdges[columnIndex + 1];

      if (rowIndex === 0 || numericGridValue(frameGrid, rowIndex - 1, columnIndex) === null) {
        shorelineFeatures.push({
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: [[westEdge, southEdge], [eastEdge, southEdge]] }
        });
      }
      if (rowIndex === latitudes.length - 1 || numericGridValue(frameGrid, rowIndex + 1, columnIndex) === null) {
        shorelineFeatures.push({
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: [[westEdge, northEdge], [eastEdge, northEdge]] }
        });
      }
      if (columnIndex === 0 || numericGridValue(frameGrid, rowIndex, columnIndex - 1) === null) {
        shorelineFeatures.push({
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: [[westEdge, southEdge], [westEdge, northEdge]] }
        });
      }
      if (columnIndex === longitudes.length - 1 || numericGridValue(frameGrid, rowIndex, columnIndex + 1) === null) {
        shorelineFeatures.push({
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: [[eastEdge, southEdge], [eastEdge, northEdge]] }
        });
      }
    }
  }

  const eastwardGrid =
    condition.id === "currents"
      ? componentFrame(frameData, "eastward_mps")
      : componentFrame(frameData, "eastward_unit");
  const northwardGrid =
    condition.id === "currents"
      ? componentFrame(frameData, "northward_mps")
      : componentFrame(frameData, "northward_unit");

  if (Array.isArray(eastwardGrid) && Array.isArray(northwardGrid)) {
    const range = displayRangeForMetadata(metadata);
    const span = Math.max(range.max - range.min, 1e-6);
    for (let rowIndex = rowStart; rowIndex < rowEndExclusive; rowIndex += stride) {
      for (let columnIndex = colStart; columnIndex < colEndExclusive; columnIndex += stride) {
        if (numericGridValue(frameGrid, rowIndex, columnIndex) === null) {
          continue;
        }

        const centerLatitude = Number(latitudes[rowIndex]);
        const centerLongitude = Number(longitudes[columnIndex]);
        const vector = interpolateVectorAt(centerLatitude, centerLongitude, latitudes, longitudes, eastwardGrid, northwardGrid, latEdges, lonEdges);
        if (!vector) {
          continue;
        }
        const magnitude = condition.id === "currents" ? Math.hypot(vector.eastward, vector.northward) : Math.max(numericGridValue(frameGrid, rowIndex, columnIndex) ?? 0, 0);
        if (!Number.isFinite(magnitude) || magnitude <= 0.0001) {
          continue;
        }

        const directionScale = clamp((magnitude - range.min) / span, 0.15, 1);
        const lengthDegrees = 0.32 * directionScale * Math.max(latEdges[rowIndex + 1] - latEdges[rowIndex], 0.02);
        const vectorMagnitude = Math.hypot(vector.eastward, vector.northward);
        if (!Number.isFinite(vectorMagnitude) || vectorMagnitude <= 1e-6) {
          continue;
        }
        const eastwardUnit = vector.eastward / vectorMagnitude;
        const northwardUnit = vector.northward / vectorMagnitude;
        const cosLatitude = Math.max(Math.cos((centerLatitude * Math.PI) / 180), 0.2);
        const deltaLatitude = northwardUnit * lengthDegrees;
        const deltaLongitude = (eastwardUnit * lengthDegrees) / cosLatitude;
        const start = [centerLongitude - deltaLongitude / 2, centerLatitude - deltaLatitude / 2];
        const end = [centerLongitude + deltaLongitude / 2, centerLatitude + deltaLatitude / 2];
        const normalizedMagnitude = clamp((magnitude - range.min) / span, 0, 1);
        const strokeColor = rgbaString(interpolatePaletteColor(normalizedMagnitude, TEMPERATURE_PALETTES[oceanPaletteName(condition.id)]), 0.94);
        const strokeWidth = 1 + normalizedMagnitude * 1.6;

        vectorFeatures.push({
          type: "Feature",
          properties: {
            kind: "shaft",
            strokeColor,
            strokeWidth
          },
          geometry: {
            type: "LineString",
            coordinates: [start, end]
          }
        });

        const heading = Math.atan2(northwardUnit, eastwardUnit);
        const headLength = lengthDegrees * 0.28;
        const leftAngle = heading + Math.PI - 0.55;
        const rightAngle = heading + Math.PI + 0.55;
        const leftPoint = [
          end[0] + (Math.cos(leftAngle) * headLength) / cosLatitude,
          end[1] + Math.sin(leftAngle) * headLength
        ];
        const rightPoint = [
          end[0] + (Math.cos(rightAngle) * headLength) / cosLatitude,
          end[1] + Math.sin(rightAngle) * headLength
        ];
        vectorFeatures.push({
          type: "Feature",
          properties: {
            kind: "head",
            strokeColor,
            strokeWidth
          },
          geometry: {
            type: "LineString",
            coordinates: [leftPoint, end, rightPoint]
          }
        });
      }
    }
  }

  const collections = {
    scalar: { type: "FeatureCollection", features: scalarFeatures },
    shoreline: { type: "FeatureCollection", features: shorelineFeatures },
    vector: { type: "FeatureCollection", features: vectorFeatures }
  };
  state.oceanVisuals.renderCache.set(cacheKey, collections);
  if (state.oceanVisuals.renderCache.size > 24) {
    const oldestKey = state.oceanVisuals.renderCache.keys().next().value;
    if (oldestKey) {
      state.oceanVisuals.renderCache.delete(oldestKey);
    }
  }
  return collections;
}

function setGeoJsonSourceData(sourceId, payload) {
  const source = state.map?.getSource(sourceId);
  if (source && typeof source.setData === "function") {
    source.setData(payload);
  }
}

async function refreshOceanVisuals() {
  if (!state.map) {
    return;
  }

  ensureOceanSources();
  updateOceanLayerStyles();
  if (!oceanLayerVisible()) {
    setGeoJsonSourceData("ocean-scalar-source", emptyFeatureCollection());
    setGeoJsonSourceData("ocean-shoreline-source", emptyFeatureCollection());
    setGeoJsonSourceData("ocean-vector-source", emptyFeatureCollection());
    return;
  }

  const token = ++state.oceanVisuals.requestToken;
  const queryIndex = await loadActiveQueryIndex();
  if (token !== state.oceanVisuals.requestToken || !queryIndex) {
    return;
  }
  const frameData = await loadActiveFrameData(queryIndex);
  if (token !== state.oceanVisuals.requestToken || !frameData) {
    return;
  }

  const metadata = activeConditionMetadata();
  const condition = activeConditionDefinition();
  if (!metadata || !condition) {
    return;
  }

  const frameIndex = Math.min(state.activeFrameIndex, Math.max((queryIndex.times_utc || []).length - 1, 0));
  const collections = buildOceanRenderCollections(queryIndex, frameData, metadata, condition, frameIndex, state.map.getZoom());
  if (token !== state.oceanVisuals.requestToken) {
    return;
  }

  setGeoJsonSourceData("ocean-scalar-source", collections.scalar);
  setGeoJsonSourceData("ocean-shoreline-source", collections.shoreline);
  setGeoJsonSourceData("ocean-vector-source", collections.vector);
  updateOceanLayerStyles();
}

function nearestIndex(values, target) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error("Index is empty.");
  }

  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  values.forEach((value, index) => {
    const distance = Math.abs(Number(value) - target);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  return bestIndex;
}

async function loadActiveQueryIndex() {
  const conditionId = state.activeConditionId;
  const metadata = activeConditionMetadata();
  if (!conditionId || !metadata?.query_index_url) {
    return null;
  }
  if (state.oceanQueryIndices[conditionId]) {
    return state.oceanQueryIndices[conditionId];
  }

  const response = await fetch(new URL(metadata.query_index_url, window.location.href).toString(), {
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Ocean query index could not be loaded.");
  }
  const payload = await response.json();
  state.oceanQueryIndices[conditionId] = payload;
  return payload;
}

function activeFrameEntry(queryIndex) {
  const frameIndex = Math.min(state.activeFrameIndex, Math.max((queryIndex?.times_utc || []).length - 1, 0));
  return queryIndex?.frames?.[frameIndex] ?? null;
}

async function loadActiveFrameData(queryIndex = null) {
  const resolvedQueryIndex = queryIndex || (await loadActiveQueryIndex());
  const conditionId = state.activeConditionId;
  const metadata = activeConditionMetadata();
  if (!conditionId || !metadata || !resolvedQueryIndex) {
    return null;
  }

  const frameEntry = activeFrameEntry(resolvedQueryIndex);
  if (!frameEntry?.key) {
    const gridKey = metadata.query_value_key || activeConditionDefinition()?.value_key || "values_celsius";
    if (Array.isArray(resolvedQueryIndex?.[gridKey])) {
      return {
        key: resolvedQueryIndex.frame_keys?.[state.activeFrameIndex] ?? null,
        time_utc: resolvedQueryIndex.times_utc?.[state.activeFrameIndex] ?? null,
        [gridKey]: resolvedQueryIndex?.[gridKey]?.[state.activeFrameIndex] ?? null,
        components: Object.fromEntries(
          Object.entries(resolvedQueryIndex?.components || {}).map(([componentName, frames]) => [
            componentName,
            frames?.[state.activeFrameIndex] ?? null
          ])
        )
      };
    }
    return null;
  }

  if (!state.oceanFrameData[conditionId]) {
    state.oceanFrameData[conditionId] = {};
  }
  if (state.oceanFrameData[conditionId][frameEntry.key]) {
    return state.oceanFrameData[conditionId][frameEntry.key];
  }

  const response = await fetch(new URL(frameEntry.data_url, window.location.href).toString(), {
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error("Ocean frame data could not be loaded.");
  }
  const payload = await response.json();
  state.oceanFrameData[conditionId][frameEntry.key] = payload;
  return payload;
}

async function fetchOceanSample(latitude, longitude) {
  const metadata = activeConditionMetadata();
  const condition = activeConditionDefinition();
  const queryIndex = await loadActiveQueryIndex();
  const frameData = await loadActiveFrameData(queryIndex);
  if (!metadata || !condition || !queryIndex || !frameData) {
    return {
      condition_id: state.activeConditionId,
      frame_index: state.activeFrameIndex,
      time_utc: currentFrame()?.time_utc ?? null,
      cell_latitude: null,
      cell_longitude: null,
      primary_value: null,
      primary_unit: condition?.units || "",
      note: "Processed query index is not available."
    };
  }

  const bbox = metadata.region?.bbox;
  if (
    !bbox ||
    latitude < bbox.minimum_latitude ||
    latitude > bbox.maximum_latitude ||
    longitude < bbox.minimum_longitude ||
    longitude > bbox.maximum_longitude
  ) {
    return {
      condition_id: state.activeConditionId,
      frame_index: state.activeFrameIndex,
      time_utc: currentFrame()?.time_utc ?? null,
      cell_latitude: null,
      cell_longitude: null,
      primary_value: null,
      primary_unit: condition.units || "",
      note: "Outside Baltic processing bounds"
    };
  }

  const latitudes = queryIndex.latitudes || [];
  const longitudes = queryIndex.longitudes || [];
  const frameIndex = Math.min(state.activeFrameIndex, Math.max((queryIndex.times_utc || []).length - 1, 0));
  const gridKey = metadata.query_value_key || condition.value_key || "values_celsius";
  const frameGrid = frameData?.[gridKey] ?? queryIndex?.[gridKey]?.[frameIndex] ?? null;
  const geometryCache = queryIndexGeometryCache(queryIndex);
  const latEdges = geometryCache?.latEdges ?? buildCellEdges(latitudes);
  const lonEdges = geometryCache?.lonEdges ?? buildCellEdges(longitudes);
  const rowIndex = clamp(findIntervalIndex(latEdges, latitude), 0, Math.max(latitudes.length - 1, 0));
  const columnIndex = clamp(findIntervalIndex(lonEdges, longitude), 0, Math.max(longitudes.length - 1, 0));
  const cellValue = frameGrid ? numericGridValue(frameGrid, rowIndex, columnIndex) : null;
  const primaryValue =
    frameGrid && cellValue !== null ? interpolateStructuredValue(latitude, longitude, latitudes, longitudes, frameGrid, latEdges, lonEdges) : null;

  const payload = {
    condition_id: state.activeConditionId,
    frame_index: frameIndex,
    time_utc: queryIndex.times_utc?.[frameIndex] || currentFrame()?.time_utc || null,
    cell_latitude: cellValue === null ? null : latitudes[rowIndex] ?? null,
    cell_longitude: cellValue === null ? null : longitudes[columnIndex] ?? null,
    primary_value: primaryValue,
    primary_unit: condition.units || "",
    note: primaryValue === null ? "No water cell at this location" : null
  };
  payload[condition.value_key || "value"] = primaryValue;
  return payload;
}

function infrastructureCategoryDefinition(categoryId) {
  return state.infrastructure.manifest?.layers?.find((layer) => layer.id === categoryId) ?? null;
}

function infrastructureCategoryLabel(categoryId) {
  const style = INFRASTRUCTURE_STYLES[categoryId];
  return t(style?.labelKey ?? "", style?.fallbackLabel ?? categoryId);
}

function infrastructureLayerIds(categoryId) {
  return {
    main: `infrastructure-${categoryId}`,
    accent: `infrastructure-${categoryId}-accent`,
    outline: `infrastructure-${categoryId}-outline`
  };
}

function infrastructureVisibility(categoryId) {
  return state.infrastructure.active && state.infrastructure.categories[categoryId] ? "visible" : "none";
}

function infrastructureInteractiveLayers() {
  return state.infrastructure.interactiveLayerIds.filter((layerId) => state.map?.getLayer(layerId));
}

function noiseLayerId(categoryId, variant = "main") {
  return `noise-${categoryId}-${variant}`;
}

function normalizeNoiseEventGroup(value) {
  const sourceEvent = String(value || "").trim().toLowerCase();
  if (sourceEvent.includes("pile")) {
    return "pile_driving";
  }
  if (sourceEvent.includes("airgun") || sourceEvent.includes("seismic")) {
    return "seismic_airgun";
  }
  if (sourceEvent.includes("explosion")) {
    return "explosion";
  }
  if (sourceEvent.includes("sonar") || sourceEvent.includes("deterrent")) {
    return "sonar_deterrent";
  }
  return sourceEvent ? "other_impulsive" : "unknown";
}

function noiseEventColorExpression() {
  const expression = ["match", ["get", "noise_event_group"]];
  for (const [groupId, group] of Object.entries(NOISE_EVENT_GROUPS)) {
    expression.push(groupId, group.color);
  }
  expression.push("#c8d4dc");
  return expression;
}

function hasTimeDrivenOverlay() {
  return oceanLayerVisible();
}

function hasAnyActiveOverlay() {
  return oceanLayerVisible() || state.infrastructure.active || state.noise.active;
}

function activeNoiseCategoryCount() {
  return NOISE_CATEGORY_ORDER.filter((categoryId) => state.noise.categories[categoryId]).length;
}

function activeInfrastructureCategoryCount() {
  return INFRASTRUCTURE_CATEGORY_ORDER.filter((categoryId) => state.infrastructure.categories[categoryId]).length;
}

function activeOceanConditionEntry() {
  return state.activeConditionId ? state.oceanConditions[state.activeConditionId] ?? null : null;
}

function activeConditionHasLocalData() {
  return Boolean(activeOceanConditionEntry()?.available && activeConditionMetadata());
}

function oceanConditionCardSummary() {
  const condition = activeConditionDefinition();
  if (!condition) {
    return t("map.noOverlaySubtitle", "Select an overlay to explore the Baltic Sea");
  }
  if (activeConditionHasLocalData()) {
    return formatTimestamp(currentFrame()?.time_utc, activeConditionMetadata()?.region?.time_zone ?? "UTC");
  }
  return "Placeholder until processed data is available";
}

function oceanConditionPlaceholderDefinition(conditionId) {
  return OCEAN_CONDITION_PLACEHOLDERS[conditionId] ?? {
    title: "Ocean-condition placeholder",
    copy: "This card is wired for shared time, a legend, and condition-specific controls when processed data becomes available."
  };
}

function isCompactControlLayout() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function activeControlCards() {
  return Object.entries(CONTROL_CARD_DEFINITIONS)
    .filter(([, definition]) => definition.active())
    .sort(([, left], [, right]) => (left.controlPriority ?? 0) - (right.controlPriority ?? 0));
}

function controlCardSummaryElement(cardId) {
  if (cardId === "oceanCondition") {
    return oceanConditionCardSummaryEl;
  }
  if (cardId === "noise") {
    return document.getElementById("noise-card-summary");
  }
  if (cardId === "infrastructure") {
    return document.getElementById("infrastructure-card-summary");
  }
  return null;
}

function controlCardCollapsed(cardId, defaultExpandedCardId = null) {
  if (isCompactControlLayout()) {
    if (!state.controlCards.mobileExpandedId && defaultExpandedCardId) {
      return cardId !== defaultExpandedCardId;
    }
    return state.controlCards.mobileExpandedId !== cardId;
  }
  return Boolean(state.controlCards.collapsed[cardId]);
}

function renderActiveOverlayControls() {
  if (!activeOverlayControlsEl) {
    return;
  }

  const activeCards = activeControlCards();
  const activeCardIds = activeCards.map(([cardId]) => cardId);
  const defaultExpandedCardId = activeCardIds[0] ?? null;

  if (isCompactControlLayout()) {
    if (!state.controlCards.mobileExpandedId || !activeCardIds.includes(state.controlCards.mobileExpandedId)) {
      state.controlCards.mobileExpandedId = defaultExpandedCardId;
    }
  } else {
    state.controlCards.mobileExpandedId = null;
  }

  for (const [cardId, definition] of activeCards) {
    const root = CONTROL_CARD_ELEMENTS[cardId];
    if (!root) {
      continue;
    }

    const collapsed = controlCardCollapsed(cardId, defaultExpandedCardId);
    root.hidden = false;
    root.classList.toggle("is-collapsed", collapsed);
    activeOverlayControlsEl.appendChild(root);

    const summaryEl = controlCardSummaryElement(cardId);
    if (summaryEl) {
      summaryEl.textContent = definition.summary();
    }

    const toggleEl = root.querySelector(`[data-control-card-toggle="${cardId}"]`);
    if (toggleEl) {
      toggleEl.setAttribute("aria-expanded", String(!collapsed));
      const chevronEl = toggleEl.querySelector(".context-card-chevron");
      if (chevronEl) {
        chevronEl.textContent = collapsed ? "▾" : "▴";
      }
    }
  }

  for (const [cardId, root] of Object.entries(CONTROL_CARD_ELEMENTS)) {
    if (!root || activeCardIds.includes(cardId)) {
      continue;
    }
    root.hidden = true;
    root.classList.remove("is-collapsed");
  }

  updateBottomLeftVisibility();
}

function toggleControlCard(cardId) {
  const activeCardIds = activeControlCards().map(([activeId]) => activeId);
  if (!activeCardIds.includes(cardId)) {
    return;
  }

  if (isCompactControlLayout()) {
    if (state.controlCards.mobileExpandedId === cardId) {
      state.controlCards.mobileExpandedId = null;
      state.controlCards.collapsed[cardId] = true;
    } else {
      state.controlCards.mobileExpandedId = cardId;
      for (const activeId of activeCardIds) {
        state.controlCards.collapsed[activeId] = activeId !== cardId;
      }
    }
  } else {
    state.controlCards.collapsed[cardId] = !state.controlCards.collapsed[cardId];
  }

  renderActiveOverlayControls();
}

function updateBottomLeftVisibility() {
  if (!mapBottomLeftEl) {
    return;
  }
  const hasVisibleCard = Object.values(CONTROL_CARD_ELEMENTS).some((element) => element && !element.hidden);
  mapBottomLeftEl.hidden = !hasVisibleCard && clickPanelEl.hidden;
}

function overlayInfoEntry(overlayId) {
  return OVERLAY_INFO_CONTENT[overlayId] ?? null;
}

function renderOverlayInfoPanel() {
  if (!overlayInfoPanelEl || !overlayInfoTitleEl || !overlayInfoSubtitleEl || !overlayInfoBodyEl) {
    return;
  }

  const entry = overlayInfoEntry(state.overlayInfoId);
  if (!entry || state.mode !== "map") {
    overlayInfoPanelEl.hidden = true;
    overlayInfoPanelEl.classList.remove("is-open");
    overlayInfoBodyEl.innerHTML = "";
    overlayInfoButtonEls.forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-expanded", "false");
    });
    return;
  }

  overlayInfoTitleEl.textContent = entry.title;
  overlayInfoSubtitleEl.textContent = entry.subtitle;
  overlayInfoBodyEl.innerHTML = entry.sections
    .map(
      (section) => `
        <section class="overlay-info-section">
          <p class="overlay-info-section-title">${section.heading}</p>
          <p class="overlay-info-section-copy">${section.body}</p>
        </section>
      `
    )
    .join("");
  overlayInfoPanelEl.hidden = false;
  overlayInfoPanelEl.classList.add("is-open");

  overlayInfoButtonEls.forEach((button) => {
    const active = button.dataset.overlayInfoButton === state.overlayInfoId;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-expanded", String(active));
  });
}

function toggleOverlayInfoPanel(overlayId) {
  state.overlayInfoId = state.overlayInfoId === overlayId ? null : overlayId;
  renderOverlayInfoPanel();
}

function activeHeadlineState() {
  const metadata = activeConditionMetadata();
  const condition = activeConditionDefinition();
  if (oceanLayerVisible() && metadata && condition) {
    return {
      title: condition.label,
      subtitle: formatTimestamp(currentFrame()?.time_utc, metadata.region.time_zone)
    };
  }

  if (condition) {
    return {
      title: condition.label,
      subtitle: "Placeholder until processed data is available"
    };
  }

  if (state.noise.active) {
    return {
      title: t("layers.underwaterNoise", "Underwater Noise"),
      subtitle: t("noise.assessmentPeriod", "HELCOM assessment layers · 2016-2021")
    };
  }

  if (state.infrastructure.active) {
    return {
      title: t("layers.infrastructure", "Coastal & Marine Infrastructure"),
      subtitle: t("infrastructure.staticContext", "Static context overlay")
    };
  }

  return {
    title: t("map.noOverlayTitle", "Map view"),
    subtitle: t("map.noOverlaySubtitle", "Select an overlay to explore the Baltic Sea")
  };
}

function updateOverlayDependentPanels() {
  if (!oceanLayerVisible()) {
    clickPanelEl.hidden = true;
  }
  updateBottomLeftVisibility();
}

function renderInfrastructureCategoryButtons() {
  if (!infrastructureCategoryListEl) {
    return;
  }

  infrastructureCategoryListEl.innerHTML = "";
  for (const categoryId of INFRASTRUCTURE_CATEGORY_ORDER) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "infrastructure-category-toggle";
    button.dataset.infrastructureCategory = categoryId;

    const active = Boolean(state.infrastructure.categories[categoryId]);
    button.classList.toggle("is-selected", active);
    button.innerHTML = `
      <span class="infrastructure-category-main">
        <span class="layer-tick">${active ? "✓" : ""}</span>
        <span>${infrastructureCategoryLabel(categoryId)}</span>
      </span>
      <span class="infrastructure-category-meta">${t(INFRASTRUCTURE_STYLES[categoryId].styleLabelKey, INFRASTRUCTURE_STYLES[categoryId].styleFallback)}</span>
    `;
    button.addEventListener("click", () => {
      toggleInfrastructureCategory(categoryId).catch((error) => {
        console.error(error);
        setStatus(error.message || "Infrastructure category could not be toggled.", "error");
      });
    });
    infrastructureCategoryListEl.appendChild(button);
  }
}

function renderInfrastructureLegend() {
  if (!infrastructureLegendEl) {
    return;
  }

  if (!state.infrastructure.active) {
    infrastructureLegendEl.hidden = true;
    infrastructureLegendEl.innerHTML = "";
    return;
  }

  const activeCategories = INFRASTRUCTURE_CATEGORY_ORDER.filter((categoryId) => state.infrastructure.categories[categoryId]);
  if (activeCategories.length === 0) {
    infrastructureLegendEl.hidden = true;
    infrastructureLegendEl.innerHTML = "";
    return;
  }

  const rows = activeCategories.map((categoryId) => {
    const style = INFRASTRUCTURE_STYLES[categoryId];
    const swatchClass =
      style.legendType === "point"
        ? "legend-swatch is-point"
        : style.legendType === "fill"
          ? "legend-swatch is-fill"
          : style.legendType === "route"
            ? "legend-swatch is-route"
            : `legend-swatch is-line${style.legendType === "dashed" ? " legend-dashed" : ""}`;
    const swatchStyle =
      style.legendType === "fill"
        ? `background:${style.color}; color:${style.lineColor ?? style.color};`
        : `background:${style.color}; color:${style.color};`;
    return `
      <div class="infrastructure-legend-row">
        <span class="infrastructure-legend-label">
          <span class="${swatchClass}" style="${swatchStyle}"></span>
          <span>${infrastructureCategoryLabel(categoryId)}</span>
        </span>
        <span>${t(style.styleLabelKey, style.styleFallback)}</span>
      </div>
    `;
  });

  infrastructureLegendEl.hidden = false;
  infrastructureLegendEl.innerHTML = `
    <p class="legend-caption">${t("infrastructure.legendTitle", "Legend")}</p>
    ${rows.join("")}
  `;
}

function updateInfrastructureUi() {
  if (!infrastructureToggleEl || !infrastructurePanelEl) {
    return;
  }

  setLayerButton(
    infrastructureToggleEl,
    t("layers.infrastructure", "Coastal & Marine Infrastructure"),
    state.infrastructure.active
  );
  renderInfrastructureCategoryButtons();
  renderInfrastructureLegend();
}

function renderNoiseCategoryButtons() {
  if (!noiseCategoryListEl) {
    return;
  }

  noiseCategoryListEl.innerHTML = "";
  for (const categoryId of NOISE_CATEGORY_ORDER) {
    const definition = NOISE_LAYER_DEFINITIONS[categoryId];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "infrastructure-category-toggle";
    const active = Boolean(state.noise.categories[categoryId]);
    button.classList.toggle("is-selected", active);
    button.innerHTML = `
      <span class="infrastructure-category-main">
        <span class="layer-tick">${active ? "✓" : ""}</span>
        <span>${t(definition.labelKey, definition.fallbackLabel)}</span>
      </span>
      <span class="infrastructure-category-meta">${definition.period}</span>
    `;
    button.addEventListener("click", () => {
      toggleNoiseCategory(categoryId).catch((error) => {
        console.error(error);
        setStatus(error.message || "Noise category could not be toggled.", "error");
      });
    });
    noiseCategoryListEl.appendChild(button);
  }
}

function renderNoiseLegend() {
  if (!noiseLegendEl) {
    return;
  }

  if (!state.noise.active) {
    noiseLegendEl.hidden = true;
    noiseLegendEl.innerHTML = "";
    return;
  }

  const rows = [];
  if (state.noise.categories.continuousNoise) {
    rows.push(`
      <div class="infrastructure-legend-row">
        <span class="infrastructure-legend-label">
          <span class="legend-swatch is-fill" style="background:rgba(92, 157, 214, 0.42); color:rgba(92, 157, 214, 0.42);"></span>
          <span>${t("noise.legendContinuous", "HELCOM continuous-noise pressure")}</span>
        </span>
        <span>${t("noise.legendNoDb", "Not shown as dB")}</span>
      </div>
    `);
  }
  if (state.noise.categories.impulsivePressure) {
    rows.push(`
      <div class="infrastructure-legend-row">
        <span class="infrastructure-legend-label">
          <span class="legend-swatch is-fill" style="background:rgba(232, 143, 87, 0.4); color:rgba(232, 143, 87, 0.4);"></span>
          <span>${t("noise.legendImpulsivePressure", "HELCOM impulsive-noise pressure")}</span>
        </span>
        <span>${t("noise.legendPressureIndex", "Pressure index")}</span>
      </div>
    `);
  }
  if (state.noise.categories.ecologicalEffect) {
    rows.push(`
      <div class="infrastructure-legend-row">
        <span class="infrastructure-legend-label">
          <span class="legend-swatch is-fill" style="background:rgba(190, 114, 192, 0.38); color:rgba(190, 114, 192, 0.38);"></span>
          <span>${t("noise.legendImpact", "Potential impact on mobile species")}</span>
        </span>
        <span>${t("noise.legendImpactIndex", "Impact index")}</span>
      </div>
    `);
  }
  if (state.noise.categories.impulsiveEvents) {
    for (const [groupId, group] of Object.entries(NOISE_EVENT_GROUPS)) {
      rows.push(`
        <div class="infrastructure-legend-row">
          <span class="infrastructure-legend-label">
            <span class="legend-swatch is-point" style="background:${group.color}; color:${group.color};"></span>
            <span>${t(group.labelKey, group.fallbackLabel)}</span>
          </span>
          <span>${t("noise.legendReportedEvent", "Reported event")}</span>
        </div>
      `);
    }
  }

  if (rows.length === 0) {
    noiseLegendEl.hidden = true;
    noiseLegendEl.innerHTML = "";
    return;
  }

  noiseLegendEl.hidden = false;
  noiseLegendEl.innerHTML = `
    <p class="legend-caption">${t("noise.legendTitle", "Noise legend")}</p>
    ${rows.join("")}
  `;
}

function updateNoiseUi() {
  if (!noiseToggleEl || !noisePanelEl) {
    return;
  }

  setLayerButton(noiseToggleEl, t("layers.underwaterNoise", "Underwater Noise"), state.noise.active);
  renderNoiseCategoryButtons();
  renderNoiseLegend();
}

async function ensureInfrastructureManifest() {
  if (state.infrastructure.manifest) {
    return state.infrastructure.manifest;
  }

  const response = await fetch(INFRASTRUCTURE_MANIFEST_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Infrastructure manifest could not be loaded.");
  }

  state.infrastructure.manifest = await response.json();
  return state.infrastructure.manifest;
}

function registerNoiseEventPopup(layerId) {
  state.map.on("mouseenter", layerId, () => {
    state.map.getCanvas().style.cursor = "pointer";
  });
  state.map.on("mouseleave", layerId, () => {
    state.map.getCanvas().style.cursor = "";
  });
  state.map.on("click", layerId, (event) => {
    const feature = event.features?.[0];
    if (!feature) {
      return;
    }

    const props = feature.properties || {};
    const groupId = props.noise_event_group || normalizeNoiseEventGroup(props.Source_Event);
    const rows = [
      [t("noise.popupEvent", "Event"), t(NOISE_EVENT_GROUPS[groupId]?.labelKey, NOISE_EVENT_GROUPS[groupId]?.fallbackLabel || "Reported event")],
      [t("noise.popupCountry", "Country"), props.Country],
      [t("noise.popupYear", "Year"), props.Year],
      [t("noise.popupStart", "Start"), props.start_date_iso || props.start_date],
      [t("noise.popupEnd", "End"), props.end_date_iso || props.end_date],
      [t("noise.popupMitigation", "Mitigation"), props.sound_mitigation_bool],
      [t("noise.popupValueCode", "Value code"), props.Value_Code]
    ]
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([label, value]) => `<div class="popup-line"><strong>${label}:</strong> ${value}</div>`)
      .join("");

    state.popup?.remove();
    state.popup = new state.maplibregl.Popup({
      offset: 18,
      closeButton: false,
      className: "ship-popup"
    })
      .setLngLat(event.lngLat)
      .setHTML(`
        <div class="popup-title">${t("noise.popupReportedEvent", "Reported impulsive-noise event")}</div>
        <div class="popup-type">${props.Source_Event || t("noise.popupUnknownType", "Unknown event type")}</div>
        ${rows}
        <div class="popup-line"><strong>${t("noise.dataSource", "Data source")}:</strong> HELCOM HOLAS 3 / HELCOM-OSPAR register</div>
      `)
      .addTo(state.map);
  });
}

function setNoiseCategoryVisibility(categoryId) {
  const visibility = state.noise.active && state.noise.categories[categoryId] ? "visible" : "none";
  for (const layerId of [
    noiseLayerId(categoryId, "main"),
    noiseLayerId(categoryId, "outline"),
    noiseLayerId(categoryId, "points"),
    noiseLayerId(categoryId, "polygons")
  ]) {
    if (state.map?.getLayer(layerId)) {
      state.map.setLayoutProperty(layerId, "visibility", visibility);
    }
  }
}

function ensureNoiseRasterLayer(categoryId) {
  if (state.noise.loaded[categoryId]) {
    return;
  }
  const definition = NOISE_LAYER_DEFINITIONS[categoryId];
  const sourceId = noiseLayerId(categoryId, "source");
  const layerId = noiseLayerId(categoryId, "main");
  state.map.addSource(sourceId, {
    type: "raster",
    tiles: definition.tiles,
    tileSize: 256
  });
  const beforeLayerId = state.map.getLayer("selected-location-ring") ? "selected-location-ring" : undefined;
  state.map.addLayer(
    {
      id: layerId,
      type: "raster",
      source: sourceId,
      paint: definition.paint,
      layout: { visibility: state.noise.active && state.noise.categories[categoryId] ? "visible" : "none" }
    },
    beforeLayerId
  );
  state.noise.loaded[categoryId] = true;
}

function ensureNoiseEventLayers() {
  if (state.noise.loaded.impulsiveEvents) {
    return;
  }

  const beforeLayerId = state.map.getLayer("selected-location-ring") ? "selected-location-ring" : undefined;
  state.map.addSource(noiseLayerId("impulsiveEvents", "points-source"), {
    type: "geojson",
    data: NOISE_LAYER_DEFINITIONS.impulsiveEvents.pointsUrl
  });
  state.map.addSource(noiseLayerId("impulsiveEvents", "polygons-source"), {
    type: "geojson",
    data: NOISE_LAYER_DEFINITIONS.impulsiveEvents.polygonsUrl
  });
  state.map.addLayer(
    {
      id: noiseLayerId("impulsiveEvents", "polygons"),
      type: "fill",
      source: noiseLayerId("impulsiveEvents", "polygons-source"),
      paint: {
        "fill-color": noiseEventColorExpression(),
        "fill-opacity": 0.16
      },
      layout: { visibility: state.noise.active && state.noise.categories.impulsiveEvents ? "visible" : "none" }
    },
    beforeLayerId
  );
  state.map.addLayer(
    {
      id: noiseLayerId("impulsiveEvents", "outline"),
      type: "line",
      source: noiseLayerId("impulsiveEvents", "polygons-source"),
      paint: {
        "line-color": noiseEventColorExpression(),
        "line-width": 1,
        "line-opacity": 0.55
      },
      layout: { visibility: state.noise.active && state.noise.categories.impulsiveEvents ? "visible" : "none" }
    },
    beforeLayerId
  );
  state.map.addLayer(
    {
      id: noiseLayerId("impulsiveEvents", "points"),
      type: "circle",
      source: noiseLayerId("impulsiveEvents", "points-source"),
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 5, 3.5, 12, 6.5],
        "circle-color": noiseEventColorExpression(),
        "circle-stroke-color": "#081623",
        "circle-stroke-width": 1.2,
        "circle-opacity": 0.92
      },
      layout: { visibility: state.noise.active && state.noise.categories.impulsiveEvents ? "visible" : "none" }
    },
    beforeLayerId
  );

  registerNoiseEventPopup(noiseLayerId("impulsiveEvents", "points"));
  registerNoiseEventPopup(noiseLayerId("impulsiveEvents", "polygons"));
  state.noise.loaded.impulsiveEvents = true;
}

function ensureNoiseCategoryLoaded(categoryId) {
  if (categoryId === "impulsiveEvents") {
    ensureNoiseEventLayers();
    return;
  }
  ensureNoiseRasterLayer(categoryId);
}

function noiseInteractiveLayers() {
  return [noiseLayerId("impulsiveEvents", "points"), noiseLayerId("impulsiveEvents", "polygons")].filter((layerId) =>
    state.map?.getLayer(layerId)
  );
}

async function toggleNoiseCategory(categoryId) {
  ensureNoiseCategoryLoaded(categoryId);
  state.noise.categories[categoryId] = !state.noise.categories[categoryId];
  setNoiseCategoryVisibility(categoryId);
  updateNoiseUi();
  updateTransparencyPanel();
  updateOverlayDependentPanels();
}

function toggleNoiseOverlay() {
  state.noise.active = !state.noise.active;
  if (state.noise.active) {
    for (const categoryId of NOISE_CATEGORY_ORDER) {
      if (state.noise.categories[categoryId]) {
        ensureNoiseCategoryLoaded(categoryId);
      }
    }
  }
  for (const categoryId of NOISE_CATEGORY_ORDER) {
    setNoiseCategoryVisibility(categoryId);
  }
  updateNoiseUi();
  updateLayerToggleUi();
  updateTransparencyPanel();
  updateOverlayDependentPanels();
  updateChrome();
}

function buildInfrastructurePopup(feature) {
  const props = feature.properties || {};
  const categoryId = props.category || props.infra_category;

  const rowsByCategory = {
    ports: [
      [t("infrastructure.country", "Country"), props.country],
      [t("infrastructure.type", "Type"), props.type || props.infra_subtype],
      [t("infrastructure.importance", "Role"), props.importance]
    ],
    powerPlants: [
      [t("infrastructure.country", "Country"), props.country],
      [t("infrastructure.energySource", "Energy source"), props.energy_source || props.infra_subtype],
      [t("infrastructure.capacity", "Capacity"), props.capacity || (props.capacity_mw ? `${props.capacity_mw} MW` : null)],
      [t("infrastructure.status", "Status"), props.status]
    ],
    windFarms: [
      [t("infrastructure.country", "Country"), props.country],
      [t("infrastructure.status", "Status"), props.status],
      [t("infrastructure.capacity", "Capacity"), props.capacity || (props.capacity_mw ? `${props.capacity_mw} MW` : null)],
      [t("infrastructure.turbines", "Turbines"), props.turbines]
    ],
    cables: [
      [t("infrastructure.type", "Type"), props.type || props.infra_subtype],
      [t("infrastructure.connection", "Connection"), props.connection],
      [t("infrastructure.capacity", "Capacity"), props.capacity]
    ],
    pipelines: [
      [t("infrastructure.type", "Type"), props.type || props.infra_subtype],
      [t("infrastructure.connection", "Connection"), props.connection],
      [t("infrastructure.status", "Status"), props.status]
    ],
    shipping: [
      [t("infrastructure.role", "Role"), props.role],
      [t("infrastructure.traffic", "Traffic"), props.traffic]
    ],
    landUse: [
      [t("infrastructure.type", "Type"), props.land_use || props.infra_subtype],
      [t("infrastructure.context", "Context"), props.context]
    ]
  };

  const lines = (rowsByCategory[categoryId] ?? [])
    .filter(([, value]) => value)
    .map(([label, value]) => `<div class="popup-line"><strong>${label}:</strong> ${value}</div>`)
    .join("");

  return `
    <div class="popup-title">${props.name || infrastructureCategoryLabel(categoryId)}</div>
    <div class="popup-type">${infrastructureCategoryLabel(categoryId)}</div>
    ${lines}
    <div class="popup-line"><strong>${t("infrastructure.dataSource", "Data source")}:</strong> ${props.source_name || props.source || "Prototype bundle"}</div>
  `;
}

function registerInfrastructureLayerEvents(layerId) {
  if (!state.map || state.infrastructure.interactiveLayerIds.includes(layerId)) {
    return;
  }

  state.infrastructure.interactiveLayerIds.push(layerId);
  state.map.on("mouseenter", layerId, () => {
    state.map.getCanvas().style.cursor = "pointer";
  });
  state.map.on("mouseleave", layerId, () => {
    state.map.getCanvas().style.cursor = "";
  });
  state.map.on("click", layerId, (event) => {
    const feature = event.features?.[0];
    if (!feature) {
      return;
    }

    state.popup?.remove();
    state.popup = new state.maplibregl.Popup({
      offset: 18,
      closeButton: false,
      className: "ship-popup"
    })
      .setLngLat(event.lngLat)
      .setHTML(buildInfrastructurePopup(feature))
      .addTo(state.map);
  });
}

function addInfrastructureCategoryLayers(categoryId, data) {
  const style = INFRASTRUCTURE_STYLES[categoryId];
  const layerIds = infrastructureLayerIds(categoryId);
  const sourceId = layerIds.main;
  if (state.map.getSource(sourceId)) {
    return;
  }

  state.map.addSource(sourceId, {
    type: "geojson",
    data
  });

  const beforeLayerId = state.map.getLayer("selected-location-ring") ? "selected-location-ring" : undefined;

  if (style.layerType === "circle") {
    state.map.addLayer(
      {
        id: layerIds.main,
        type: "circle",
        source: sourceId,
        paint: style.paint,
        layout: { visibility: infrastructureVisibility(categoryId) }
      },
      beforeLayerId
    );
    registerInfrastructureLayerEvents(layerIds.main);
    return;
  }

  if (style.layerType === "line") {
    state.map.addLayer(
      {
        id: layerIds.main,
        type: "line",
        source: sourceId,
        paint: style.paint,
        layout: { "line-join": "round", "line-cap": "round", visibility: infrastructureVisibility(categoryId) }
      },
      beforeLayerId
    );
    if (style.accentPaint) {
      state.map.addLayer(
        {
          id: layerIds.accent,
          type: "line",
          source: sourceId,
          paint: style.accentPaint,
          layout: { "line-join": "round", "line-cap": "round", visibility: infrastructureVisibility(categoryId) }
        },
        beforeLayerId
      );
      registerInfrastructureLayerEvents(layerIds.accent);
    } else {
      registerInfrastructureLayerEvents(layerIds.main);
    }
    return;
  }

  if (style.layerType === "fill") {
    state.map.addLayer(
      {
        id: layerIds.main,
        type: "fill",
        source: sourceId,
        paint: style.paint,
        layout: { visibility: infrastructureVisibility(categoryId) }
      },
      beforeLayerId
    );
    state.map.addLayer(
      {
        id: layerIds.outline,
        type: "line",
        source: sourceId,
        paint: style.outlinePaint,
        layout: { visibility: infrastructureVisibility(categoryId) }
      },
      beforeLayerId
    );
    registerInfrastructureLayerEvents(layerIds.main);
  }
}

function setInfrastructureCategoryVisibility(categoryId) {
  const layerIds = infrastructureLayerIds(categoryId);
  const visibility = infrastructureVisibility(categoryId);
  for (const layerId of [layerIds.main, layerIds.accent, layerIds.outline]) {
    if (state.map?.getLayer(layerId)) {
      state.map.setLayoutProperty(layerId, "visibility", visibility);
    }
  }
}

async function loadInfrastructureCategory(categoryId) {
  await ensureInfrastructureManifest();
  if (state.infrastructure.loadedCategories[categoryId]) {
    return;
  }

  const manifestCategory =
    state.infrastructure.manifest.categories?.find((item) => item.id === categoryId) ||
    infrastructureCategoryDefinition(categoryId);
  if (!manifestCategory?.url) {
    throw new Error(`Infrastructure category "${categoryId}" is missing a data URL.`);
  }

  const response = await fetch(new URL(manifestCategory.url, window.location.href).toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${infrastructureCategoryLabel(categoryId)} could not be loaded.`);
  }

  const data = await response.json();
  addInfrastructureCategoryLayers(categoryId, data);
  state.infrastructure.loadedCategories[categoryId] = true;
}

async function ensureInfrastructureOverlayReady() {
  await ensureInfrastructureManifest();
  for (const categoryId of INFRASTRUCTURE_CATEGORY_ORDER) {
    await loadInfrastructureCategory(categoryId);
  }
  state.infrastructure.loaded = true;
}

async function toggleInfrastructureOverlay() {
  if (!state.infrastructure.active) {
    setStatus(t("status.loadingInfrastructure", "Loading infrastructure overlay..."));
    await ensureInfrastructureOverlayReady();
    clearStatus();
  }

  state.infrastructure.active = !state.infrastructure.active;
  for (const categoryId of INFRASTRUCTURE_CATEGORY_ORDER) {
    setInfrastructureCategoryVisibility(categoryId);
  }
  updateInfrastructureUi();
  updateLayerToggleUi();
  updateTransparencyPanel();
  updateOverlayDependentPanels();
}

async function toggleInfrastructureCategory(categoryId) {
  if (!state.infrastructure.active) {
    await toggleInfrastructureOverlay();
  }
  if (!state.infrastructure.loadedCategories[categoryId]) {
    await loadInfrastructureCategory(categoryId);
  }

  state.infrastructure.categories[categoryId] = !state.infrastructure.categories[categoryId];
  setInfrastructureCategoryVisibility(categoryId);
  updateInfrastructureUi();
  renderActiveOverlayControls();
}

function mapStyle() {
  return {
    version: 8,
    sources: {
      "eox-satellite": { type: "raster", tiles: [EOX_SATELLITE_TILES], tileSize: 256, minzoom: 0, maxzoom: 14 },
      "eox-blackmarble": { type: "raster", tiles: [EOX_BLACKMARBLE_TILES], tileSize: 256, minzoom: 0, maxzoom: 18 },
      "eox-labels": { type: "raster", tiles: [EOX_LABELS_TILES], tileSize: 256, minzoom: 0, maxzoom: 18 },
      "eox-streets": { type: "raster", tiles: [EOX_STREETS_TILES], tileSize: 256, minzoom: 0, maxzoom: 18 },
      "eox-bright-labels": { type: "raster", tiles: [EOX_BRIGHT_LABELS_TILES], tileSize: 256, minzoom: 0, maxzoom: 18 },
      "eox-coastline": { type: "raster", tiles: [EOX_COASTLINE_TILES], tileSize: 256, minzoom: 0, maxzoom: 18 }
    },
    layers: [
      { id: "background", type: "background", paint: { "background-color": "#040814" } },
      { id: "eox-satellite", type: "raster", source: "eox-satellite", paint: { "raster-fade-duration": 0, "raster-saturation": 0.06, "raster-contrast": 0.1 } },
      { id: "eox-blackmarble", type: "raster", source: "eox-blackmarble", paint: { "raster-fade-duration": 0, "raster-opacity": 0 } },
      { id: "eox-streets", type: "raster", source: "eox-streets", paint: { "raster-fade-duration": 0, "raster-opacity": 0.32 } },
      { id: "eox-labels", type: "raster", source: "eox-labels", paint: { "raster-fade-duration": 0, "raster-opacity": 0.92 } },
      { id: "eox-bright-labels", type: "raster", source: "eox-bright-labels", layout: { visibility: "none" }, paint: { "raster-fade-duration": 0, "raster-opacity": 0.9 } },
      { id: "eox-coastline", type: "raster", source: "eox-coastline", paint: { "raster-fade-duration": 0, "raster-opacity": 0.72 } }
    ]
  };
}

function updateStaticPanels() {
  sourceDetailEl.textContent = t("transparency.temperatureDetail", "Modelled sea-surface temperature");
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const parsed = Number.parseInt(normalized, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255
  };
}

function getPaletteDefinition() {
  return TEMPERATURE_PALETTES[state.palette] ?? TEMPERATURE_PALETTES.blueRed;
}

function buildPaletteGradient(palette = getPaletteDefinition()) {
  return `linear-gradient(90deg, ${palette.stops.map(({ stop, color }) => `${color} ${Math.round(stop * 100)}%`).join(", ")})`;
}

function interpolatePaletteColor(value, palette = getPaletteDefinition()) {
  if (value <= palette.stops[0].stop) {
    return hexToRgb(palette.stops[0].color);
  }
  if (value >= palette.stops[palette.stops.length - 1].stop) {
    return hexToRgb(palette.stops[palette.stops.length - 1].color);
  }

  for (let index = 0; index < palette.stops.length - 1; index += 1) {
    const start = palette.stops[index];
    const end = palette.stops[index + 1];
    if (value >= start.stop && value <= end.stop) {
      const startColor = hexToRgb(start.color);
      const endColor = hexToRgb(end.color);
      const ratio = (value - start.stop) / (end.stop - start.stop || 1);
      return {
        r: Math.round(startColor.r + (endColor.r - startColor.r) * ratio),
        g: Math.round(startColor.g + (endColor.g - startColor.g) * ratio),
        b: Math.round(startColor.b + (endColor.b - startColor.b) * ratio)
      };
    }
  }

  return hexToRgb("#ffffff");
}

function updateLegendAppearance() {
  const gradient = buildPaletteGradient();
  document.querySelectorAll(".legend-bar, .timeline-legend-bar").forEach((element) => {
    element.style.background = gradient;
  });
  if (oceanConditionLegendBarEl && state.activeConditionId) {
    oceanConditionLegendBarEl.style.background = gradient;
  }
}

function updatePaletteButtons() {
  const oceanConditionActive = Boolean(state.activeConditionId);
  for (const button of paletteOptionEls) {
    button.classList.toggle("is-selected", button.dataset.palette === state.palette);
    button.disabled = !oceanConditionActive;
  }
  paletteButtonEl.disabled = !oceanConditionActive;
  paletteCurrentEl.textContent = t("accessibility.scaleButton", "Colorscale");
  for (const preview of palettePreviewEls) {
    const paletteName = preview.dataset.palettePreview;
    const palette = TEMPERATURE_PALETTES[paletteName] ?? TEMPERATURE_PALETTES.blueRed;
    preview.style.background = buildPaletteGradient(palette);
  }
}

function updateChrome() {
  const headline = activeHeadlineState();
  mapHeadlineTitleEl.textContent = headline.title;
  mapHeadlineTimeEl.textContent = headline.subtitle;

  const condition = activeConditionDefinition();
  if (oceanConditionCardLabelEl) {
    oceanConditionCardLabelEl.textContent = condition?.label || "Ocean condition";
  }
  if (oceanConditionCardSummaryEl) {
    oceanConditionCardSummaryEl.textContent = oceanConditionCardSummary();
  }

  const metadata = activeConditionMetadata();
  const frame = currentFrame();
  if (!condition) {
    if (timePrimaryEl) {
      timePrimaryEl.textContent = t("map.noOverlaySubtitle", "Select an overlay to explore the Baltic Sea");
    }
    if (timeSecondaryEl) {
      timeSecondaryEl.textContent = "";
    }
    if (oceanConditionCurrentValueEl) {
      oceanConditionCurrentValueEl.textContent = "--";
    }
    if (oceanConditionCurrentNoteEl) {
      oceanConditionCurrentNoteEl.textContent = "Switch on an ocean condition to see contextual controls here.";
    }
    if (oceanConditionLegendEl) {
      oceanConditionLegendEl.hidden = true;
    }
    if (oceanConditionRenderModeListEl) {
      oceanConditionRenderModeListEl.hidden = true;
      oceanConditionRenderModeListEl.innerHTML = "";
    }
    if (oceanConditionPlaceholderEl) {
      oceanConditionPlaceholderEl.hidden = true;
      oceanConditionPlaceholderEl.innerHTML = "";
    }
    updateOverlayDependentPanels();
    return;
  }

  if (!metadata || !frame) {
    const placeholder = oceanConditionPlaceholderDefinition(condition.id);
    if (timePrimaryEl) {
      timePrimaryEl.textContent = "Processed frames not available yet";
    }
    if (timeSecondaryEl) {
      timeSecondaryEl.textContent = `${condition.time_resolution_label || "Native"} data will slot into the shared timeline here.`;
    }
    if (oceanConditionCurrentValueEl) {
      oceanConditionCurrentValueEl.textContent = `${condition.label} · ${condition.units || ""}`.trim();
    }
    if (oceanConditionCurrentNoteEl) {
      oceanConditionCurrentNoteEl.textContent = "This control card is ready now and will switch to live data automatically once processed frames exist.";
    }
    if (oceanConditionLegendEl) {
      oceanConditionLegendEl.hidden = true;
    }
    renderOceanRenderModes();
    if (oceanConditionPlaceholderEl) {
      oceanConditionPlaceholderEl.hidden = false;
      oceanConditionPlaceholderEl.innerHTML = `
        <p class="context-placeholder-title">${placeholder.title}</p>
        <p class="context-placeholder-copy">${placeholder.copy}</p>
        <p class="context-placeholder-meta">Units: ${condition.units || "n/a"} · Resolution: ${condition.time_resolution_label || "native"} · Source: ${condition.source_label || "Pending source metadata"}</p>
      `;
    }
    updateOverlayDependentPanels();
    return;
  }

  const frameTime = formatTimestamp(frame.time_utc, metadata.region.time_zone);
  const frameMin = frame.min_celsius ?? frame.min_value ?? frame.min ?? null;
  const frameMax = frame.max_celsius ?? frame.max_value ?? frame.max ?? null;
  const valueRange = metadata.value_range_celsius ?? metadata.value_range ?? null;
  timePrimaryEl.textContent = frameTime;

  const leadHours = Math.round((new Date(frame.time_utc) - new Date()) / 36e5);
  if (leadHours > 0) {
    timeSecondaryEl.textContent = t("map.hoursAhead", "{count} hours ahead", { count: leadHours });
  } else if (leadHours < 0) {
    timeSecondaryEl.textContent = t("map.hoursBehind", "{count} hours behind now", { count: Math.abs(leadHours) });
  } else {
    timeSecondaryEl.textContent = t("map.closestToNow", "Closest available to now");
  }

  if (oceanConditionCurrentValueEl) {
    oceanConditionCurrentValueEl.textContent = state.selectedLocation?.sampleText || `${condition.label} · ${condition.units || ""}`.trim();
  }
  if (oceanConditionCurrentNoteEl) {
    oceanConditionCurrentNoteEl.textContent = state.selectedLocation
      ? t("map.selectedCoordinates", "{lat} - {lon}", {
          lat: formatCoordinate(state.selectedLocation.latitude, "N", "S"),
          lon: formatCoordinate(state.selectedLocation.longitude, "E", "W")
        })
      : "Tap the map to sample a local water value.";
  }

  oceanConditionLegendTitleEl.textContent =
    `${condition.label} · ${t(getPaletteDefinition().labelKey, getPaletteDefinition().fallbackLabel)}`;
  oceanConditionLegendRangeEl.textContent =
    typeof frameMin === "number" && typeof frameMax === "number" ? `${frameMin.toFixed(1)} to ${frameMax.toFixed(1)}` : "";
  oceanConditionLegendMinEl.textContent = typeof valueRange?.display_min === "number" ? valueRange.display_min.toFixed(1) : "";
  oceanConditionLegendMaxEl.textContent = typeof valueRange?.display_max === "number" ? valueRange.display_max.toFixed(1) : "";
  oceanConditionLegendUnitEl.textContent = condition.units || "";
  oceanConditionLegendEl.hidden = false;

  if (oceanConditionPlaceholderEl) {
    oceanConditionPlaceholderEl.hidden = true;
    oceanConditionPlaceholderEl.innerHTML = "";
  }

  renderOceanRenderModes();

  if (state.activeConditionId !== "temperature" && state.activeConditionId !== "salinity" && state.activeConditionId !== "oxygen" && state.activeConditionId !== "seaLevel" && state.activeConditionId !== "currents" && state.activeConditionId !== "waves") {
    oceanConditionLegendEl.hidden = true;
  }

  if (condition.id === "temperature" || condition.id === "salinity" || condition.id === "oxygen" || condition.id === "seaLevel" || condition.id === "currents" || condition.id === "waves") {
    oceanConditionLegendRangeEl.textContent =
      typeof frameMin === "number" && typeof frameMax === "number" ? `${frameMin.toFixed(1)} to ${frameMax.toFixed(1)}` : "";
  }

  updateOverlayDependentPanels();
  updateLegendAppearance();
}

function updateTransparencyPanel() {
  const metadata = activeConditionMetadata();
  const condition = activeConditionDefinition();
  if (state.noise.active) {
    sourceSummaryEl.textContent = t("transparency.noiseSummary", "HELCOM / ICES - modelled and reported underwater-noise data");
    sourceDetailEl.textContent = t("transparency.noiseDetail", "Assessment pressure layers and reported impulsive-noise events");
    const rows = [
      t("transparency.noisePeriod", "Assessment period: {value}", { value: "2016-2021" }),
      t("transparency.noiseCaution", "Continuous and impulsive metrics are shown separately and are not combined into one number."),
      t("transparency.noiseReporting", "Reported events depend on national reporting completeness.")
    ];
    transparencyDetailEl.innerHTML = rows.map((row) => `<p>${row}</p>`).join("");
    return;
  }

  if (state.infrastructure.active) {
    sourceSummaryEl.textContent = t("transparency.infrastructureSummary", "Curated Baltic infrastructure prototype");
    sourceDetailEl.textContent = t("transparency.infrastructureDetail", "Open-data prototype bundle combining ports, energy, routes and land-use context");
    const rows = [
      t("transparency.infrastructureSource", "Infrastructure overlay: {value}", {
        value: state.infrastructure.manifest?.overlay?.source_summary || t("infrastructure.prototypeSource", "Curated open-data prototype")
      }),
      t("transparency.infrastructureLicense", "Infrastructure licence note: {value}", {
        value: state.infrastructure.manifest?.overlay?.license_note || t("infrastructure.prototypeLicense", "Mixed open licences; see documentation.")
      })
    ];
    transparencyDetailEl.innerHTML = rows.map((row) => `<p>${row}</p>`).join("");
    return;
  }

  sourceSummaryEl.textContent = state.satelliteWorking
    ? t("transparency.summaryOnlineSimple", "Copernicus Marine + EOX Cloudless + OSM overlay")
    : t("transparency.summaryOffline", "Copernicus Marine + local fallback coastline");

  sourceDetailEl.textContent = condition?.source_label || t("transparency.temperatureDetail", "Modelled sea-surface temperature");
  const rows = [
    t("transparency.updated", "Last update: {value}", {
      value: formatTimestamp(metadata?.provenance?.retrieved_at_utc, "UTC")
    }),
    t("transparency.forecastWindow", "Forecast window: {start} to {end}", {
      start: formatTimestamp(metadata?.provenance?.requested_start_utc, "UTC"),
      end: formatTimestamp(metadata?.provenance?.requested_end_utc, "UTC")
    }),
    `Product: ${condition?.product_id || "--"}`,
    `Dataset: ${condition?.dataset_id || "--"}`
  ];

  transparencyDetailEl.innerHTML = rows.map((row) => `<p>${row}</p>`).join("");
}

function updateFallbackAppearance() {
  if (!state.map?.getLayer("land-mask")) {
    return;
  }

  state.map.setPaintProperty("land-mask", "raster-opacity", state.satelliteWorking ? 0.03 : 0.98);
  updateTransparencyPanel();
  if (!state.satelliteWorking) {
    setStatus(t("status.fallbackMap", "The live basemap did not load, so the viewer fell back to the local coastline layer."), "warning");
  }
}

function applyNightMode(frame) {
  if (!state.map) {
    return;
  }

  const nightOpacity = frame.is_night ? 0.95 : 0;
  const satelliteOpacity = frame.is_night ? 0.22 : 1;
  const dayLabels = state.labelsVisible && !frame.is_night ? "visible" : "none";
  const nightLabels = state.labelsVisible && frame.is_night ? "visible" : "none";

  state.map.setPaintProperty("eox-blackmarble", "raster-opacity", nightOpacity);
  state.map.setPaintProperty("eox-satellite", "raster-opacity", satelliteOpacity);
  state.map.setPaintProperty("eox-streets", "raster-opacity", frame.is_night ? 0.18 : 0.32);
  state.map.setLayoutProperty("eox-labels", "visibility", dayLabels);
  state.map.setLayoutProperty("eox-streets", "visibility", state.labelsVisible ? "visible" : "none");
  state.map.setLayoutProperty("eox-bright-labels", "visibility", nightLabels);

}

function addOceanLayers() {
  const metadata = activeConditionMetadata();
  ensureOceanSources();
  if (!metadata?.fallback || state.map.getSource("land-mask")) {
    return;
  }

  state.map.addSource("land-mask", {
    type: "image",
    url: metadata.fallback.land_mask_url,
    coordinates:
      metadata.fallback.land_mask_coordinates ??
      imageCoordinatesFromBbox([
        [metadata.region.bbox.minimum_longitude, metadata.region.bbox.minimum_latitude],
        [metadata.region.bbox.maximum_longitude, metadata.region.bbox.maximum_latitude]
      ])
  });
  state.map.addLayer({
    id: "land-mask",
    type: "raster",
    source: "land-mask",
    paint: { "raster-opacity": state.satelliteWorking ? 0.03 : 0.98, "raster-fade-duration": 0 }
  });
  refreshOceanVisuals().catch((error) => {
    console.error(error);
  });
}

function ensureSelectedLocationLayer() {
  if (state.map.getSource("selected-location")) {
    return;
  }

  state.map.addSource("selected-location", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });
  state.map.addLayer({
    id: "selected-location-ring",
    type: "circle",
    source: "selected-location",
    paint: {
      "circle-radius": 10,
      "circle-color": "rgba(0, 0, 0, 0)",
      "circle-stroke-color": "#dff7ff",
      "circle-stroke-width": 2.2
    }
  });
  state.map.addLayer({
    id: "selected-location-dot",
    type: "circle",
    source: "selected-location",
    paint: {
      "circle-radius": 4,
      "circle-color": "#7bd0c6",
      "circle-stroke-color": "#0b1c2d",
      "circle-stroke-width": 1.4
    }
  });
}

function setSelectedLocationMarker() {
  const source = state.map?.getSource("selected-location");
  if (!source) {
    return;
  }

  const data = state.selectedLocation
    ? {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [state.selectedLocation.longitude, state.selectedLocation.latitude]
            }
          }
        ]
      }
    : { type: "FeatureCollection", features: [] };

  source.setData(data);
}

function updateOverlayFrame() {
  const frame = currentFrame();
  if (!frame) {
    return;
  }
  applyNightMode(frame);
  refreshOceanVisuals().catch((error) => {
    console.error(error);
  });
  updateChrome();
  setOceanVisibility();
  updateSelectedLocationValues().catch((error) => {
    console.error(error);
  });
}

function setOceanVisibility() {
  updateOceanLayerStyles();
  updateChrome();
}

function updateViewToggle() {
  viewToggleEl.textContent = state.labelsVisible ? t("map.hideLabels", "Hide labels") : t("map.showLabels", "Show labels");
}

function setLayerButton(button, label, active) {
  if (!button) {
    return;
  }
  button.classList.toggle("is-selected", active);
  button.innerHTML = `
    <span class="layer-main">
      <span class="layer-tick">${active ? "✓" : ""}</span>
      <span>${label}</span>
    </span>
  `;
}

function updateStatusForVisibleLayers() {
  clearStatus();
}

function updateOceanConditionButtons() {
  for (const conditionId of OCEAN_CONDITION_ORDER) {
    const button = OCEAN_CONDITION_BUTTONS[conditionId];
    if (!button) {
      continue;
    }
    const entry = state.oceanConditions[conditionId];
    const label = entry?.condition?.label || button.textContent || conditionId;
    setLayerButton(button, label, state.activeConditionId === conditionId);
    button.disabled = false;
    button.classList.toggle("is-disabled", false);
  }
}

function renderOceanRenderModes() {
  if (!oceanConditionRenderModeListEl) {
    return;
  }

  const modes = renderModeOptions();
  if (modes.length === 0) {
    oceanConditionRenderModeListEl.hidden = true;
    oceanConditionRenderModeListEl.innerHTML = "";
    return;
  }

  oceanConditionRenderModeListEl.hidden = false;
  oceanConditionRenderModeListEl.innerHTML = modes
    .map(
      (mode) => `
        <button class="infrastructure-category-toggle${activeRenderModeId() === mode.id ? " is-selected" : ""}" type="button" data-render-mode="${mode.id}">
          <span class="infrastructure-category-main">
            <span class="layer-tick">${activeRenderModeId() === mode.id ? "✓" : ""}</span>
            <span>${mode.label}</span>
          </span>
          <span class="infrastructure-category-meta">${state.activeConditionId === "currents" ? "Current field" : "Wave field"}</span>
        </button>
      `
    )
    .join("");
  oceanConditionRenderModeListEl.querySelectorAll("[data-render-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.oceanRenderModes[state.activeConditionId] = button.dataset.renderMode;
      renderOceanRenderModes();
      updateOverlayFrame();
    });
  });
}

function updateLayerToggleUi() {
  updateOceanConditionButtons();
  renderOceanRenderModes();
  updateNoiseUi();
  updateInfrastructureUi();
  updateStatusForVisibleLayers();
}

function nearestFrameIndexForTimestamp(metadata, timestamp) {
  if (!metadata?.frames?.length || !timestamp) {
    return metadata?.initial_frame_index ?? 0;
  }

  const targetTime = new Date(timestamp).getTime();
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  metadata.frames.forEach((frame, index) => {
    const distance = Math.abs(new Date(frame.time_utc).getTime() - targetTime);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function setActiveOceanCondition(conditionId) {
  const entry = state.oceanConditions[conditionId];
  if (!entry?.condition) {
    setStatus(`${conditionId} is not configured in the current manifest.`, "warning");
    return;
  }

  if (state.activeConditionId === conditionId) {
    state.requestedTimeUtc = currentFrame()?.time_utc ?? state.requestedTimeUtc;
    state.activeConditionId = null;
    state.selectedLocation = null;
    clickPanelEl.hidden = true;
    updatePaletteButtons();
    updateLayerToggleUi();
    setOceanVisibility();
    updateChrome();
    updateTransparencyPanel();
    renderActiveOverlayControls();
    updateOverlayDependentPanels();
    return;
  }

  const previousFrame = currentFrame();
  state.activeConditionId = conditionId;
  if (entry.metadata) {
    state.metadata = entry.metadata;
    state.activeFrameIndex = nearestFrameIndexForTimestamp(entry.metadata, state.requestedTimeUtc || previousFrame?.time_utc);
    state.requestedTimeUtc = entry.metadata.frames?.[state.activeFrameIndex]?.time_utc ?? state.requestedTimeUtc;
  }
  syncTimelineUi();
  updatePaletteButtons();
  updateLayerToggleUi();
  renderActiveOverlayControls();
  setOceanVisibility();
  updateChrome();
  updateTransparencyPanel();
  if (entry.metadata) {
    updateOverlayFrame();
  } else {
    clickPanelEl.hidden = true;
    updateBottomLeftVisibility();
  }
}

function toggleTemperatureLayer() {
  setActiveOceanCondition("temperature");
}

function toggleLabelsLayer() {
  state.labelsVisible = !state.labelsVisible;
  updateViewToggle();
  if (state.map && activeConditionMetadata()) {
    applyNightMode(currentFrame());
  }
}

function setPalette(paletteName) {
  if (!TEMPERATURE_PALETTES[paletteName] || state.palette === paletteName) {
    return;
  }
  state.palette = paletteName;
  updatePaletteButtons();
  updateLegendAppearance();
  closePaletteMenu();
  if (state.map?.isStyleLoaded()) {
    updateOverlayFrame();
  }
}

async function setSelectedLocation(latitude, longitude) {
  state.selectedLocation = {
    latitude,
    longitude,
    sampleText: null
  };
  setSelectedLocationMarker();
  await updateSelectedLocationValues();
}

async function updateSelectedLocationValues() {
  const metadata = activeConditionMetadata();
  const condition = activeConditionDefinition();
  if (!state.selectedLocation || !metadata || !oceanLayerVisible() || !condition) {
    if (state.selectedLocation) {
      state.selectedLocation.sampleText = null;
    }
    clickPanelEl.hidden = true;
    renderActiveOverlayControls();
    return;
  }

  const requestToken = ++state.selectedLocationRequestToken;
  const { latitude, longitude } = state.selectedLocation;
  const sample = await fetchOceanSample(latitude, longitude);
  if (requestToken !== state.selectedLocationRequestToken) {
    return;
  }

  const primaryValue = typeof sample.primary_value === "number" ? sample.primary_value : null;
  const unit = sample.primary_unit || condition.units || "";
  state.selectedLocation.sampleText = primaryValue === null ? null : `${primaryValue.toFixed(1)} ${unit}`;

  clickedPrimaryValueEl.textContent = primaryValue === null ? `${condition.label}: no water cell` : `${primaryValue.toFixed(1)} ${unit}`;
  clickedLayerNameEl.textContent = condition.label;

  clickedTimeEl.textContent = formatTimestamp(sample.time_utc ?? currentFrame().time_utc, metadata.region.time_zone);
  clickedCoordinatesEl.textContent = t("map.selectedCoordinates", "{lat} - {lon}", {
    lat: formatCoordinate(latitude, "N", "S"),
    lon: formatCoordinate(longitude, "E", "W")
  });
  clickPanelEl.hidden = primaryValue === null;
  renderActiveOverlayControls();
  updateChrome();
}

async function handleMapClick(event) {
  if (state.mode === "home") {
    setMode("map");
    clickPanelEl.hidden = true;
    return;
  }

  const noiseLayers = noiseInteractiveLayers();
  if (noiseLayers.length > 0 && state.map.queryRenderedFeatures(event.point, { layers: noiseLayers }).length > 0) {
    return;
  }

  const interactiveLayers = infrastructureInteractiveLayers();
  if (interactiveLayers.length > 0 && state.map.queryRenderedFeatures(event.point, { layers: interactiveLayers }).length > 0) {
    return;
  }

  if (!oceanLayerVisible()) {
    clickPanelEl.hidden = true;
    return;
  }

  const { lat, lng } = event.lngLat;
  const sample = await fetchOceanSample(lat, lng);
  if (typeof sample.primary_value !== "number") {
    clickPanelEl.hidden = true;
    return;
  }

  await setSelectedLocation(lat, lng);
}

function registerInteractions(maplibregl) {
  if (state.map.__interactionsRegistered) {
    return;
  }
  state.map.__interactionsRegistered = true;

  state.map.scrollZoom.enable();
  state.map.dragPan.enable();
  state.map.touchZoomRotate.enable();
  state.map.doubleClickZoom.enable();
  state.map.keyboard.enable();
  if (state.map.touchPitch && typeof state.map.touchPitch.enable === "function") {
    state.map.touchPitch.enable();
  }

  state.map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
  const handleTimeSelection = (event) => {
    event.stopPropagation();
    state.activeFrameIndex = Number(timeSliderEl.value);
    state.requestedTimeUtc = currentFrame()?.time_utc ?? state.requestedTimeUtc;
    updateOverlayFrame();
  };

  timeSliderEl.addEventListener("input", handleTimeSelection);
  timeSliderEl.addEventListener("change", handleTimeSelection);
  oceanConditionPanelEl?.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  oceanConditionPanelEl?.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
  });

  state.map.on("click", (event) => {
    handleMapClick(event).catch((error) => {
      console.error(error);
    });
  });

  state.map.on("moveend", () => {
    refreshOceanVisuals().catch((error) => {
      console.error(error);
    });
  });

  state.map.on("zoomend", () => {
    refreshOceanVisuals().catch((error) => {
      console.error(error);
    });
  });
}

function initializeMapUi() {
  addOceanLayers();
  ensureSelectedLocationLayer();
  registerInteractions(state.maplibregl);
  updateOverlayFrame();
  renderOverlayInfoPanel();
  updateTransparencyPanel();
  updateLayerToggleUi();
  updateViewToggle();
  updateFallbackAppearance();
  setSelectedLocationMarker();
  updateOverlayDependentPanels();
  clearStatus();
}

async function loadMapLibre() {
  if (window.maplibregl) {
    return window.maplibregl;
  }

  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = MAPLIBRE_JS_URL;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("MapLibre GL JS could not be loaded."));
    document.head.appendChild(script);
  });

  return window.maplibregl;
}

function bindUi() {
  heroEnterMapEl.addEventListener("click", () => setMode("map"));
  topEnterMapEl.addEventListener("click", () => setMode("map"));
  previewEnterMapEl.addEventListener("click", () => setMode("map"));
  exitMapEl.addEventListener("click", () => setMode("home"));
  temperatureToggleEl.addEventListener("click", toggleTemperatureLayer);
  currentsToggleEl?.addEventListener("click", () => setActiveOceanCondition("currents"));
  salinityToggleEl?.addEventListener("click", () => setActiveOceanCondition("salinity"));
  oxygenToggleEl?.addEventListener("click", () => setActiveOceanCondition("oxygen"));
  wavesToggleEl?.addEventListener("click", () => setActiveOceanCondition("waves"));
  seaLevelToggleEl?.addEventListener("click", () => setActiveOceanCondition("seaLevel"));
  noiseToggleEl?.addEventListener("click", toggleNoiseOverlay);
  infrastructureToggleEl?.addEventListener("click", () => {
    toggleInfrastructureOverlay().catch((error) => {
      console.error(error);
      setStatus(error.message || "Infrastructure overlay could not be toggled.", "error");
    });
  });
  viewToggleEl.addEventListener("click", toggleLabelsLayer);
  paletteOptionEls.forEach((button) => {
    button.addEventListener("click", () => {
      setPalette(button.dataset.palette);
    });
  });
  mapContainerEl.addEventListener("click", () => {
    if (state.mode === "home") {
      setMode("map");
    }
  });
  controlCardToggleEls.forEach((toggleEl) => {
    toggleEl.addEventListener("click", () => {
      toggleControlCard(toggleEl.dataset.controlCardToggle);
    });
  });
  overlayInfoButtonEls.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleOverlayInfoPanel(button.dataset.overlayInfoButton);
    });
  });
  overlayInfoCloseEl?.addEventListener("click", () => {
    state.overlayInfoId = null;
    renderOverlayInfoPanel();
  });
  window.addEventListener("resize", () => {
    renderActiveOverlayControls();
    renderOverlayInfoPanel();
  });
}

function syncTimelineUi() {
  const metadata = activeConditionMetadata();
  if (!metadata?.frames?.length) {
    timeSliderEl.min = "0";
    timeSliderEl.max = "0";
    timeSliderEl.step = "1";
    timeSliderEl.value = "0";
    return;
  }
  timeSliderEl.min = "0";
  timeSliderEl.max = String(metadata.frames.length - 1);
  timeSliderEl.step = "1";
  timeSliderEl.value = String(state.activeFrameIndex);
}

async function bootstrap() {
  try {
    if (window.location.protocol === "file:") {
      throw new Error(
        "This page should not be opened directly from the file system. Run `python scripts/build_site.py`, start `python frontend/serve_frontend.py`, then open http://127.0.0.1:8000/."
      );
    }

    bindUi();
    bindLanguageMenu();
    bindPaletteMenu();
    await loadTranslations("en");
    applyTranslations();

    setStatus(t("status.loadingMetadata", "Loading processed metadata..."));
    const manifestResponse = await fetch(OCEAN_MANIFEST_URL, { cache: "no-store" });
    if (!manifestResponse.ok) {
      throw new Error(
        "Processed ocean assets were not found yet. Run `python scripts/build_site.py`, then restart the frontend server."
      );
    }
    state.oceanManifest = await manifestResponse.json();
    state.oceanConditions = Object.fromEntries(
      (state.oceanManifest.conditions || []).map((condition) => [condition.id, condition])
    );
    state.activeConditionId = state.oceanManifest.default_condition_id || "temperature";
    state.metadata = activeConditionMetadata();
    if (!state.metadata) {
      setStatus(
        t(
          "status.noOceanDataYet",
          "No processed ocean-condition assets are published yet. The site shell is live and will switch to live data automatically after the updater runs."
        ),
        "warning"
      );
    }

    state.activeFrameIndex = state.metadata?.initial_frame_index ?? 0;
    state.requestedTimeUtc = currentFrame()?.time_utc ?? null;
    syncTimelineUi();
    updateChrome();

    setStatus(t("status.loadingMap", "Loading map renderer..."));
    state.maplibregl = await loadMapLibre();
    const initialRegion = state.metadata?.region || state.oceanManifest.region;
    state.map = new state.maplibregl.Map({
      container: mapContainerEl,
      style: mapStyle(),
      center: initialRegion.initial_view.center,
      zoom: initialRegion.initial_view.zoom,
      pitch: 42,
      bearing: 18,
      maxPitch: 76,
      minZoom: 2.4,
      maxZoom: 18.5,
      attributionControl: true,
      dragRotate: true,
      pitchWithRotate: true
    });

    const fallbackTimer = window.setTimeout(() => {
      state.satelliteWorking = false;
      if (state.map && state.map.isStyleLoaded()) {
        initializeMapUi();
        updateFallbackAppearance();
      }
    }, 5000);

    state.map.on("load", () => {
      initializeMapUi();
    });

    state.map.on("sourcedata", (event) => {
      if (event.sourceId === "eox-satellite" && event.isSourceLoaded) {
        state.satelliteWorking = true;
        window.clearTimeout(fallbackTimer);
        updateFallbackAppearance();
      }
    });

    state.map.on("error", (event) => {
      const message = String(event?.error?.message || "");
      const url = String(event?.error?.url || "");
      if (url.includes("tiles.maps.eox.at") || message.includes("tiles.maps.eox.at")) {
        state.satelliteWorking = false;
        if (state.map && state.map.isStyleLoaded()) {
          initializeMapUi();
          updateFallbackAppearance();
        }
      }
    });
  } catch (error) {
    console.error(error);
    setStatus(error.message || "The app could not be initialized.", "error");
  }
}

bootstrap();
