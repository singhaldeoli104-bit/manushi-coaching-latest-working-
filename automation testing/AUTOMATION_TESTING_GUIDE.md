## Mobile UI Automation – Quick Start

All automation work lives in `automation testing/`. Tests use Appium + pytest with Allure reporting and step-by-step screenshots.

### 1. One-Time Setup
- Install Node.js ≥ 16 (for Appium) and Python ≥ 3.10.
- Install the Android SDK / Platform Tools and ensure `adb` is on `PATH`.
- Install the Allure CLI (already unpacked at `C:\Tools\allure-2.35.1`).
- From `C:\PC` run:
  ```powershell
  python -m venv .venv
  .\.venv\Scripts\Activate.ps1
  python -m pip install --upgrade pip
  python -m pip install pytest Appium-Python-Client allure-pytest Pillow
  npm install -g appium
  appium driver install uiautomator2
  ```
- Add `C:\Tools\allure-2.35.1\bin` to your user `PATH` (System Properties → Environment Variables).

### 2. Daily Test Run
1. **Start Appium**  
   ```powershell
   appium --base-path /wd/hub
   ```
   Leave this window open.
2. **Prep the device**  
   - Connect or start the emulator.  
   - Verify with `adb devices` (status must be `device`).  
   - Launch the React Native app so ClassDetailScreen is reachable (dev flag `SHOW_STUDENT_SCREENS_DIRECTLY` should be `true`).
3. **Activate the virtualenv** in a new PowerShell window:  
   ```powershell
   cd C:\PC
   .\.venv\Scripts\Activate.ps1
   ```
4. **Run the suite** (screenshots + Allure data):  
   ```powershell
   python -m pytest ".\automation testing\class_detail_tests.py" --alluredir=reports\allure-data
   ```

### 3. View Reports
- **Interactive dashboard** (auto-opens in browser, best for review):  
  ```powershell
  allure serve reports\allure-data
  ```
- **Static export** (share or print to PDF):  
  ```powershell
  allure generate reports\allure-data -o reports\allure-report --clean
  ```
  Open `reports\allure-report\index.html` via a local HTTP server or print to PDF from the served dashboard.

### 4. Baseline Screenshots
- Store expected PNGs in `automation testing/goldens/` (e.g., `overview_tab.png`).
- The `step` fixture automatically compares the current screenshot with the baseline when you pass `baseline="overview_tab.png"`.  
- If the diff exceeds the default RMS tolerance (5.0) the test fails, attaches the diff image to Allure, and drops a copy in `reports/artifacts/`.

### 5. Writing Tests
- Import selectors or helpers at the top of the test module.
- Wrap each logical check in `with step("Description", baseline="optional.png"):` to log the action, capture a screenshot, and (optionally) compare to the stored baseline.
- Use `wait_for` or similar helpers to stabilise before taking screenshots.
- Add new pytest files under `automation testing/`—the shared fixtures in `conftest.py` automatically enable step logging, screenshots, and failure captures.

### 6. Troubleshooting
- **Appium fails with hidden API error**: the default capabilities already set `ignoreHiddenApiPolicyError=True`. If you see permission issues, reboot the device and restart Appium.
- **Selectors breaking**: prefer `testID`/`accessibilityLabel` in the React Native code to avoid fragile text selectors.
- **Allure “Loading…”**: use `allure serve …` or run a local `python -m http.server` from `reports\allure-report` and open via `http://localhost:PORT/index.html`.

### 7. Updating Baselines
- Regenerate a screenshot for the desired state using the existing test.
- Copy the PNG from the Allure attachment or `reports/artifacts/` into `automation testing/goldens/` with the correct filename.
- Re-run the suite to confirm the baseline passes.

### 8. Extending Coverage
- Add new tests (e.g., teacher or parent flows) with the same pattern:
  ```python
  def test_new_flow(driver, step):
      with step("Describe action", baseline="optional.png"):
          # perform actions/assertions
  ```
- Export logcat or additional artifacts within the `step` context as needed; attach with `allure.attach` for later review.

You now have a push-button harness: start Appium, activate the venv, run pytest, and open the Allure dashboard. Every step is logged with screenshots and optional baseline validation so the team can review regressions quickly.
