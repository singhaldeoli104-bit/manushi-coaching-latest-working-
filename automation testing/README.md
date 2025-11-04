# Teacher Dashboard Automation

This folder contains an initial Appium + pytest harness that automates the
`OLD/TEACHER_DASHBOARD_TEST_CHECKLIST.md` regression pass for the new teacher
dashboard screen.  The goal is to convert the manual checklist into executable
tests that can run locally against a connected Android device or an emulator.

## Folder Contents
- `teacher_dashboard_tests.py` – pytest module that drives the Android app with
  Appium and covers the highest‑value scenarios from the checklist (dashboard
  load, card presence, navigation buttons, analytics hooks, edge conditions).

## Prerequisites
1. Appium Server (2.x) running locally: `appium --base-path /wd/hub`
2. Android SDK tools (`adb`) with a physical device or emulator attached.
3. Python 3.10+ with dependencies:
   ```bash
   pip install pytest Appium-Python-Client
   ```
4. Build of the teacher app installed on the target device. Supply the package
   and launchable activity via environment variables if they differ from the
   defaults used in the script.

## Running The Suite
```bash
pytest "automation testing/teacher_dashboard_tests.py"
```

Useful environment variables (all optional):

| Variable | Purpose |
|----------|---------|
| `APPIUM_SERVER_URL` | Override the Appium server endpoint (default `http://127.0.0.1:4723/wd/hub`). |
| `ANDROID_APP_PACKAGE` | Application package name (default `com.packagecheck.dev`). |
| `ANDROID_APP_ACTIVITY` | Launch activity (default `.MainActivity`). |
| `TEACHER_EMAIL` / `TEACHER_PASSWORD` | Credentials for the automated login flow (used by `login_if_necessary`). |

## Mapping To The Checklist

| Checklist Section | Automated Coverage |
|-------------------|--------------------|
| Test 1 – Dashboard Load | `test_dashboard_load_and_cards` verifies welcome text, card count, and action buttons. |
| Test 2 – Navigation Actions | `test_primary_navigation_buttons` asserts each dashboard CTA responds, fires analytics log markers, and returns safely. |
| Test 3 – Bottom Navigation | `test_bottom_nav_tabs` covers Home / Classes / Students / Analytics / More tabs. |
| Tests 7/8 – Analytics | `assert_logcat_event` helper inspects logcat for the expected tracking entries after each action. |
| Test 15 – Scroll Performance | `test_dashboard_scroll_performance` scrolls the dashboard and captures timing metrics. |
| Acceptance Criteria | `test_type_safety_and_lint_commands` runs TypeScript and ESLint checks (skipped by default; enable with `RUN_STATIC_CHECKS=1`). |

The remaining checklist items require either backend verification (RLS, data
shape) or multi-device matrix testing. Those are called out as TODO comments in
the test module so you can extend the suite incrementally.

## Next Steps
- Populate missing accessibility IDs in `LOCATORS` to stabilise element lookups.
- Extend the pytest module with data assertions (attendance values, analytics
  payloads) once the API contracts are documented.
- Integrate the suite with CI (e.g. GitHub Actions + Android emulator) to run on
  each pull request.
