"""Shared helpers for Appium UI step logging and screenshot comparisons."""

import io
from pathlib import Path
from typing import Optional, Tuple

import allure
from PIL import Image, ImageChops, ImageStat


def capture_screenshot(driver, name: str) -> Image.Image:
    """Capture a screenshot from the Appium driver, attach to Allure, and return a Pillow image."""
    png_bytes = driver.get_screenshot_as_png()
    allure.attach(png_bytes, name=name, attachment_type=allure.attachment_type.PNG)
    return Image.open(io.BytesIO(png_bytes)).convert("RGB")


def ensure_png_suffix(path: Path) -> Path:
    """Ensure the provided path has a .png suffix."""
    if path.suffix:
        return path
    return path.with_suffix(".png")


def compare_with_baseline(
    actual: Image.Image,
    baseline_path: Path,
    tolerance: float = 5.0,
) -> Tuple[bool, Optional[Image.Image], Optional[float]]:
    """Compare an actual screenshot with a baseline image.

    Returns a tuple of (passed, diff_image, rms_score).
    If the baseline file does not exist, returns (True, None, None).
    """
    baseline_path = ensure_png_suffix(baseline_path)

    if not baseline_path.exists():
        allure.attach(
            str(baseline_path),
            name="Baseline missing",
            attachment_type=allure.attachment_type.TEXT,
        )
        return True, None, None

    baseline = Image.open(baseline_path).convert("RGB")
    actual_resized = actual.resize(baseline.size) if actual.size != baseline.size else actual

    diff = ImageChops.difference(actual_resized, baseline)
    stat = ImageStat.Stat(diff)
    # Root-mean-square of RGB channels, combined
    rms = sum(value ** 2 for value in stat.rms) ** 0.5
    passed = rms <= tolerance
    return passed, diff, rms
