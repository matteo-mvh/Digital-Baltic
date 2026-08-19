from __future__ import annotations

import math


def db_to_linear(level_db: float) -> float:
    return 10 ** (level_db / 10.0)


def linear_to_db(value: float) -> float:
    return 10.0 * math.log10(max(value, 1e-15))


def estimate_transmission_loss(distance_m: float, frequency_hz: int = 63) -> float:
    distance_m = max(distance_m, 50.0)
    distance_km = distance_m / 1000.0
    geometric_db = 15.0 * math.log10(distance_m)
    absorption_db = {63: 0.002, 125: 0.004}.get(frequency_hz, 0.003) * distance_km
    shallow_water_penalty_db = 0.85 * math.sqrt(distance_km)
    return geometric_db + absorption_db + shallow_water_penalty_db


def estimate_received_level_db(source_level_db: float, distance_m: float, frequency_hz: int = 63) -> float:
    return source_level_db - estimate_transmission_loss(distance_m, frequency_hz=frequency_hz)
