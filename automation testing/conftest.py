"""Pytest fixtures for UI automation (steps, screenshots, baseline diffs)."""

from __future__ import annotations

import sys
from contextlib import contextmanager
from pathlib import Path
from typing import Optional, Union

import allure
import pytest

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))

from step_helpers import capture_screenshot, compare_with_baseline

BASELINE_DIR = BASE_DIR / "goldens"
ARTIFACT_DIR = Path.cwd() / "reports" / "artifacts"
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)


@pytest.hookimpl(hookwrapper=True, tryfirst=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)


@pytest.fixture(autouse=True)
def capture_artifacts_on_failure(request):
    """Automatically attach a screenshot when a test fails."""
    yield
    driver = request.node.funcargs.get("driver")
    if not driver:
        return
    rep_call = getattr(request.node, "rep_call", None)
    if rep_call and rep_call.failed:
        capture_screenshot(driver, f"{request.node.name}_failure")


@pytest.fixture
def step(request):
    """Context manager to log a step, capture a screenshot, and compare with a baseline."""
    driver = request.getfixturevalue("driver")

    @contextmanager
    def _step(
        name: str,
        *,
        baseline: Optional[Union[str, Path]] = None,
        tolerance: float = 5.0,
    ):
        with allure.step(name):
            yield
            image = capture_screenshot(driver, name)
            if baseline:
                baseline_path = BASELINE_DIR / Path(baseline)
                passed, diff, rms = compare_with_baseline(image, baseline_path, tolerance)
                if diff is not None:
                    diff_path = ARTIFACT_DIR / f"{Path(baseline_path).stem}_diff.png"
                    diff.save(diff_path)
                    allure.attach.file(
                        str(diff_path),
                        name=f"{name} diff",
                        attachment_type=allure.attachment_type.PNG,
                    )
                if rms is not None:
                    allure.attach(
                        f"RMS difference: {rms:.2f}",
                        name=f"{name} baseline result",
                        attachment_type=allure.attachment_type.TEXT,
                    )
                if not passed:
                    pytest.fail(
                        f"Baseline mismatch for '{name}' (file: {baseline_path.name})."
                    )

    return _step
