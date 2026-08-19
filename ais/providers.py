from __future__ import annotations

import json
import math
from dataclasses import asdict, dataclass
from datetime import UTC, datetime
from typing import Any
from urllib.parse import urlencode
from urllib.request import urlopen


@dataclass(slots=True)
class VesselSnapshot:
    mmsi: str
    latitude: float
    longitude: float
    speed_knots: float
    course_degrees: float | None
    heading_degrees: float | None
    ship_type: str
    ship_type_code: str | None
    length_m: float | None
    width_m: float | None
    draft_m: float | None
    name: str
    timestamp_utc: str
    source: str

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class AisProvider:
    provider_name = "unknown"
    mode = "demo"

    def fetch_vessels(self) -> list[VesselSnapshot]:
        raise NotImplementedError


class DemoAisProvider(AisProvider):
    provider_name = "Demo AIS"
    mode = "demo"

    def __init__(self, bbox: dict[str, float]) -> None:
        self._bbox = bbox
        self._base_time = datetime(2026, 8, 19, 0, 0, tzinfo=UTC).timestamp()
        self._vessels = [
            {
                "mmsi": "219001001",
                "name": "AURORA SOUND",
                "ship_type": "Cargo vessel",
                "ship_type_code": "70",
                "length_m": 198.0,
                "width_m": 31.0,
                "draft_m": 9.2,
                "speed_knots": 14.8,
                "heading_degrees": 162.0,
                "course_degrees": 160.0,
                "track": [(12.62, 56.09), (12.54, 55.96), (12.48, 55.84), (12.44, 55.7)],
            },
            {
                "mmsi": "219001002",
                "name": "ORESUND STAR",
                "ship_type": "Passenger vessel",
                "ship_type_code": "60",
                "length_m": 122.0,
                "width_m": 22.0,
                "draft_m": 5.4,
                "speed_knots": 17.5,
                "heading_degrees": 22.0,
                "course_degrees": 24.0,
                "track": [(12.49, 55.55), (12.51, 55.63), (12.54, 55.72), (12.58, 55.82)],
            },
            {
                "mmsi": "219001003",
                "name": "SCAN TANKER",
                "ship_type": "Tanker",
                "ship_type_code": "80",
                "length_m": 144.0,
                "width_m": 24.0,
                "draft_m": 7.1,
                "speed_knots": 11.2,
                "heading_degrees": 205.0,
                "course_degrees": 202.0,
                "track": [(12.84, 56.15), (12.78, 56.02), (12.71, 55.9), (12.63, 55.76)],
            },
            {
                "mmsi": "219001004",
                "name": "PORT WORKER",
                "ship_type": "Tug / service",
                "ship_type_code": "52",
                "length_m": 36.0,
                "width_m": 12.0,
                "draft_m": 3.8,
                "speed_knots": 7.5,
                "heading_degrees": 284.0,
                "course_degrees": 281.0,
                "track": [(12.71, 55.74), (12.66, 55.72), (12.58, 55.72), (12.52, 55.73)],
            },
        ]

    def _interpolate_track(self, track: list[tuple[float, float]], phase: float) -> tuple[float, float]:
        segment_count = len(track) - 1
        scaled = phase * segment_count
        index = min(segment_count - 1, int(math.floor(scaled)))
        local = scaled - index
        lon0, lat0 = track[index]
        lon1, lat1 = track[index + 1]
        return lon0 + (lon1 - lon0) * local, lat0 + (lat1 - lat0) * local

    def fetch_vessels(self) -> list[VesselSnapshot]:
        now = datetime.now(UTC)
        elapsed_hours = (now.timestamp() - self._base_time) / 3600.0
        vessels: list[VesselSnapshot] = []

        for offset, vessel in enumerate(self._vessels):
            phase = ((elapsed_hours / 3.8) + offset * 0.19) % 1.0
            longitude, latitude = self._interpolate_track(vessel["track"], phase)
            longitude = min(
                self._bbox["maximum_longitude"] - 0.01,
                max(self._bbox["minimum_longitude"] + 0.01, longitude),
            )
            latitude = min(
                self._bbox["maximum_latitude"] - 0.01,
                max(self._bbox["minimum_latitude"] + 0.01, latitude),
            )
            vessels.append(
                VesselSnapshot(
                    mmsi=vessel["mmsi"],
                    latitude=latitude,
                    longitude=longitude,
                    speed_knots=vessel["speed_knots"],
                    course_degrees=vessel["course_degrees"],
                    heading_degrees=vessel["heading_degrees"],
                    ship_type=vessel["ship_type"],
                    ship_type_code=vessel["ship_type_code"],
                    length_m=vessel["length_m"],
                    width_m=vessel["width_m"],
                    draft_m=vessel["draft_m"],
                    name=vessel["name"],
                    timestamp_utc=now.isoformat(),
                    source=self.provider_name,
                ),
            )

        return vessels


class MarineTrafficAisProvider(AisProvider):
    provider_name = "MarineTraffic AIS"
    mode = "live"

    def __init__(self, api_key: str, bbox: dict[str, float], timespan_minutes: int = 30) -> None:
        self._api_key = api_key
        self._bbox = bbox
        self._timespan_minutes = max(5, min(1440, timespan_minutes))

    @staticmethod
    def _as_float(value: Any, divide_by: float = 1.0) -> float | None:
        if value in ("", None):
            return None
        try:
            return float(value) / divide_by
        except (TypeError, ValueError):
            return None

    @staticmethod
    def _as_heading(value: Any) -> float | None:
        heading = MarineTrafficAisProvider._as_float(value)
        if heading in (None, -1.0, 511.0):
            return None
        return heading

    def fetch_vessels(self) -> list[VesselSnapshot]:
        query = urlencode(
            {
                "v": 2,
                "protocol": "jsono",
                "timespan": self._timespan_minutes,
                "limit": 2000,
                "MINLAT": self._bbox["minimum_latitude"],
                "MAXLAT": self._bbox["maximum_latitude"],
                "MINLON": self._bbox["minimum_longitude"],
                "MAXLON": self._bbox["maximum_longitude"],
            },
        )
        url = f"https://services.marinetraffic.com/api/exportvessels-custom-area/{self._api_key}?{query}"
        with urlopen(url, timeout=20) as response:
            payload = json.loads(response.read().decode("utf-8"))

        rows = payload.get("DATA", payload)
        vessels: list[VesselSnapshot] = []

        for row in rows:
            latitude = self._as_float(row.get("LAT"))
            longitude = self._as_float(row.get("LON"))
            speed_knots = self._as_float(row.get("SPEED"), divide_by=10.0)
            if latitude is None or longitude is None:
                continue

            vessels.append(
                VesselSnapshot(
                    mmsi=str(row.get("MMSI", "")).strip(),
                    latitude=latitude,
                    longitude=longitude,
                    speed_knots=speed_knots or 0.0,
                    course_degrees=self._as_float(row.get("COURSE")),
                    heading_degrees=self._as_heading(row.get("HEADING")),
                    ship_type=str(
                        row.get("TYPE_NAME")
                        or row.get("AIS_TYPE_SUMMARY")
                        or row.get("MARKET")
                        or "Unknown"
                    ).strip(),
                    ship_type_code=str(row.get("SHIPTYPE") or "").strip() or None,
                    length_m=self._as_float(row.get("LENGTH")),
                    width_m=self._as_float(row.get("WIDTH")),
                    draft_m=self._as_float(row.get("DRAUGHT"), divide_by=10.0),
                    name=str(row.get("SHIPNAME") or "Unnamed vessel").strip(),
                    timestamp_utc=str(row.get("TIMESTAMP") or datetime.now(UTC).isoformat()),
                    source=self.provider_name,
                ),
            )

        return vessels
