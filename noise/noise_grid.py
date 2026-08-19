from __future__ import annotations

import math
from dataclasses import dataclass

from ais.providers import VesselSnapshot

from .propagation import db_to_linear, estimate_received_level_db, linear_to_db
from .source_level import SourceModelResult, estimate_source_level


EARTH_RADIUS_M = 6_371_000.0


@dataclass(slots=True)
class NoiseGridResult:
    values_db: list[list[float | None]]
    min_db: float
    max_db: float
    dominant_mmsi: list[list[str | None]]


def haversine_distance_m(lat0: float, lon0: float, lat1: float, lon1: float) -> float:
    phi0 = math.radians(lat0)
    phi1 = math.radians(lat1)
    dphi = math.radians(lat1 - lat0)
    dlambda = math.radians(lon1 - lon0)
    a = math.sin(dphi / 2.0) ** 2 + math.cos(phi0) * math.cos(phi1) * math.sin(dlambda / 2.0) ** 2
    return 2.0 * EARTH_RADIUS_M * math.atan2(math.sqrt(a), math.sqrt(max(0.0, 1.0 - a)))


def build_noise_grid(
    vessels: list[VesselSnapshot],
    latitudes: list[float],
    longitudes: list[float],
    water_mask: list[list[bool]],
    frequency_hz: int = 63,
) -> NoiseGridResult:
    source_levels: dict[str, SourceModelResult] = {
        vessel.mmsi: estimate_source_level(vessel, frequency_hz=frequency_hz) for vessel in vessels
    }
    values_db: list[list[float | None]] = []
    dominant_mmsi: list[list[str | None]] = []
    minimum_db = float("inf")
    maximum_db = float("-inf")

    for row_index, latitude in enumerate(latitudes):
        row_values: list[float | None] = []
        row_dominant: list[str | None] = []

        for col_index, longitude in enumerate(longitudes):
            if not water_mask[row_index][col_index]:
                row_values.append(None)
                row_dominant.append(None)
                continue

            energy_sum = 0.0
            strongest_energy = 0.0
            strongest_ship: str | None = None

            for vessel in vessels:
                source = source_levels[vessel.mmsi]
                distance_m = haversine_distance_m(latitude, longitude, vessel.latitude, vessel.longitude)
                received_db = estimate_received_level_db(
                    source.source_level_db,
                    distance_m=distance_m,
                    frequency_hz=frequency_hz,
                )
                energy = db_to_linear(received_db)
                energy_sum += energy
                if energy > strongest_energy:
                    strongest_energy = energy
                    strongest_ship = vessel.mmsi

            if energy_sum <= 0.0:
                row_values.append(None)
                row_dominant.append(None)
                continue

            level_db = linear_to_db(energy_sum)
            minimum_db = min(minimum_db, level_db)
            maximum_db = max(maximum_db, level_db)
            row_values.append(round(level_db, 2))
            row_dominant.append(strongest_ship)

        values_db.append(row_values)
        dominant_mmsi.append(row_dominant)

    if minimum_db == float("inf"):
        minimum_db = 0.0
        maximum_db = 0.0

    return NoiseGridResult(
        values_db=values_db,
        min_db=minimum_db,
        max_db=maximum_db,
        dominant_mmsi=dominant_mmsi,
    )
