from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

if __package__ in {None, ""}:
    sys.path.append(str(Path(__file__).resolve().parents[1]))

from data_pipeline.config import (
    BALTIC_REGION,
    FRONTEND_DIR,
    SITE_DATA_ROOT,
    SITE_DIR,
)
from data_pipeline.ocean_layers import OCEAN_CONDITION_ORDER, ocean_condition_definitions


def _copy_tree(source: Path, target: Path) -> None:
    if not source.exists():
        return
    shutil.copytree(source, target, dirs_exist_ok=True)


def _placeholder_manifest() -> dict[str, object]:
    definitions = ocean_condition_definitions()
    conditions = [
        {
            "id": condition_id,
            "label": definitions[condition_id]["label"],
            "available": False,
            "condition": definitions[condition_id],
        }
        for condition_id in OCEAN_CONDITION_ORDER
    ]
    return {
        "region": {
            "name": BALTIC_REGION["name"],
            "bbox": BALTIC_REGION["bbox"],
            "initial_view": {
                "center": BALTIC_REGION["default_center"],
                "zoom": BALTIC_REGION["default_zoom"],
            },
            "max_bounds": BALTIC_REGION["max_bounds"],
            "time_zone": BALTIC_REGION["time_zone"],
        },
        "default_condition_id": "temperature",
        "conditions": conditions,
    }


def build_site() -> None:
    if SITE_DIR.exists():
        shutil.rmtree(SITE_DIR)
    SITE_DIR.mkdir(parents=True, exist_ok=True)

    for filename in ("index.html", "app.js", "styles.css"):
        shutil.copy2(FRONTEND_DIR / filename, SITE_DIR / filename)

    _copy_tree(FRONTEND_DIR / "locales", SITE_DIR / "locales")
    _copy_tree(FRONTEND_DIR / "infrastructure", SITE_DIR / "infrastructure")
    _copy_tree(FRONTEND_DIR / "noise", SITE_DIR / "noise")

    data_target = SITE_DIR / "data"
    if SITE_DATA_ROOT.exists():
        _copy_tree(SITE_DATA_ROOT, data_target)

    manifest_path = data_target / "ocean" / "manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    if not manifest_path.exists():
        manifest_path.write_text(json.dumps(_placeholder_manifest(), indent=2), encoding="utf-8")

    (SITE_DIR / ".nojekyll").write_text("", encoding="utf-8")


if __name__ == "__main__":
    build_site()
