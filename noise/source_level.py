from __future__ import annotations

import math
from dataclasses import dataclass

from ais.providers import VesselSnapshot


REFERENCE_LENGTH_M = 100.0
DEFAULT_UNCERTAINTY_DB = 6.0


@dataclass(frozen=True, slots=True)
class SourceModelResult:
    category: str
    frequency_hz: int
    source_level_db: float
    reference_level_db: float
    uncertainty_db: float


REFERENCE_MODELS = {
    "cargo": {
        "label": "Cargo vessel",
        "reference_speed_knots": 14.0,
        "levels_db": {63: 188.0, 125: 181.0},
        "default_length_m": 185.0,
    },
    "tanker": {
        "label": "Tanker",
        "reference_speed_knots": 13.0,
        "levels_db": {63: 186.5, 125: 179.5},
        "default_length_m": 170.0,
    },
    "passenger": {
        "label": "Passenger vessel",
        "reference_speed_knots": 18.0,
        "levels_db": {63: 183.5, 125: 177.0},
        "default_length_m": 130.0,
    },
    "tug": {
        "label": "Tug / service",
        "reference_speed_knots": 9.0,
        "levels_db": {63: 176.0, 125: 171.0},
        "default_length_m": 38.0,
    },
    "fishing": {
        "label": "Fishing / workboat",
        "reference_speed_knots": 10.0,
        "levels_db": {63: 173.0, 125: 168.0},
        "default_length_m": 28.0,
    },
    "other": {
        "label": "Other vessel",
        "reference_speed_knots": 12.0,
        "levels_db": {63: 178.5, 125: 172.5},
        "default_length_m": 60.0,
    },
}


def _category_for_ship_type(ship_type: str) -> str:
    normalized = ship_type.lower()
    if "cargo" in normalized or "container" in normalized or "ro-ro" in normalized:
        return "cargo"
    if "tanker" in normalized:
        return "tanker"
    if "passenger" in normalized or "ferry" in normalized or "cruise" in normalized:
        return "passenger"
    if "tug" in normalized or "service" in normalized or "pilot" in normalized:
        return "tug"
    if "fishing" in normalized or "trawler" in normalized:
        return "fishing"
    return "other"


def estimate_source_level(vessel: VesselSnapshot, frequency_hz: int = 63) -> SourceModelResult:
    category_key = _category_for_ship_type(vessel.ship_type)
    reference = REFERENCE_MODELS[category_key]
    speed_knots = max(0.8, vessel.speed_knots or 0.8)
    length_m = vessel.length_m or reference["default_length_m"]
    speed_term_db = 60.0 * math.log10(speed_knots / reference["reference_speed_knots"])
    length_term_db = 20.0 * math.log10(max(12.0, length_m) / REFERENCE_LENGTH_M)
    if speed_knots < 2.0:
        speed_term_db -= 8.0

    reference_level_db = reference["levels_db"].get(frequency_hz, reference["levels_db"][63])
    source_level_db = reference_level_db + speed_term_db + length_term_db
    return SourceModelResult(
        category=reference["label"],
        frequency_hz=frequency_hz,
        source_level_db=source_level_db,
        reference_level_db=reference_level_db,
        uncertainty_db=DEFAULT_UNCERTAINTY_DB,
    )
