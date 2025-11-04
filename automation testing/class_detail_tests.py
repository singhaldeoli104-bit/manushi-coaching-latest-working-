import os
import time
import pytest
from appium import webdriver
from appium.options.android import UiAutomator2Options
from appium.webdriver.common.appiumby import AppiumBy
from selenium.common.exceptions import NoSuchElementException

APPIUM_SERVER = os.getenv("APPIUM_SERVER_URL", "http://127.0.0.1:4723/wd/hub")
APP_PACKAGE = os.getenv("ANDROID_APP_PACKAGE", "com.packagecheck.dev")
APP_ACTIVITY = os.getenv("ANDROID_APP_ACTIVITY", ".MainActivity")

DEFAULT_CAPS = {
    "platformName": "Android",
    "automationName": "UiAutomator2",
    "deviceName": os.getenv("ANDROID_DEVICE_NAME", "Android Device"),
    "appPackage": APP_PACKAGE,
    "appActivity": APP_ACTIVITY,
    "noReset": True,
    "fullReset": False,
    "newCommandTimeout": 240,
    "ignoreHiddenApiPolicyError": True,
}

# Centralised selectors - tweak if the UI text changes
SELECTORS = {
    "top_bar_title": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Class Details")'),
    "back_button": (AppiumBy.ACCESSIBILITY_ID, "Back"),
    "overview_tab": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Overview")'),
    "doubts_tab": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Doubts")'),
    "resources_tab": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Resources")'),
    "doubts_empty_title": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().textContains("No doubts")'),
    "doubts_empty_cta": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().textContains("Ask")'),
    "resources_empty_title": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().textContains("No resources")'),
    "class_subject": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("English")'),
    "status_badge": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().textContains("COMPLETED")'),
    "teacher_name": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().textContains("Teacher")'),
    "schedule_row": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().textContains("Sun")'),
    "duration_row": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().textContains("60")'),
    "bottom_tab_home": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Home")'),
    "bottom_tab_classes": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Classes")'),
    "bottom_tab_study": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Study")'),
    "bottom_tab_progress": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Progress")'),
    "bottom_tab_connect": (AppiumBy.ANDROID_UIAUTOMATOR, 'new UiSelector().text("Connect")'),
}


@pytest.fixture(scope="module")
def driver():
    options = UiAutomator2Options()
    for key, value in DEFAULT_CAPS.items():
        options.set_capability(key, value)

    drv = webdriver.Remote(command_executor=APPIUM_SERVER, options=options)
    yield drv
    drv.quit()


def wait_for(driver, selector, timeout=25):
    end = time.time() + timeout
    by, value = selector
    while time.time() < end:
        try:
            elem = driver.find_element(by, value)
            if elem:
                return elem
        except NoSuchElementException:
            pass
        time.sleep(0.5)
    raise AssertionError(f"Element {selector} not found within {timeout}s")


def scroll_into_view(driver, text):
    driver.find_element(
        AppiumBy.ANDROID_UIAUTOMATOR,
        f'new UiScrollable(new UiSelector().scrollable(true)).scrollTextIntoView("{text}")'
    )


class TestClassDetailScreen:
    def test_initial_load(self, driver, step):
        with step("Class header renders"):
            wait_for(driver, SELECTORS["top_bar_title"])
            wait_for(driver, SELECTORS["class_subject"])
            wait_for(driver, SELECTORS["status_badge"])
            wait_for(driver, SELECTORS["teacher_name"])
            wait_for(driver, SELECTORS["schedule_row"])
            wait_for(driver, SELECTORS["duration_row"])

        with step("Bottom navigation visible"):
            for tab_selector in (
                "bottom_tab_home",
                "bottom_tab_classes",
                "bottom_tab_study",
                "bottom_tab_progress",
                "bottom_tab_connect",
            ):
                wait_for(driver, SELECTORS[tab_selector])

    def test_tab_switching(self, driver, step):
        with step("Overview tab active"):
            wait_for(driver, SELECTORS["overview_tab"]).click()
            wait_for(driver, SELECTORS["class_subject"])

        with step("Doubts tab empty state"):
            wait_for(driver, SELECTORS["doubts_tab"]).click()
            wait_for(driver, SELECTORS["doubts_empty_title"])
            wait_for(driver, SELECTORS["doubts_empty_cta"])

        with step("Resources tab empty state"):
            wait_for(driver, SELECTORS["resources_tab"]).click()
            wait_for(driver, SELECTORS["resources_empty_title"])

        with step("Rapid tab switching"):
            for tab in ("overview_tab", "doubts_tab", "resources_tab", "overview_tab"):
                wait_for(driver, SELECTORS[tab]).click()

    def test_doubts_cta(self, driver, step):
        with step("Ask question CTA navigates"):
            wait_for(driver, SELECTORS["doubts_tab"]).click()
            wait_for(driver, SELECTORS["doubts_empty_cta"]).click()
            driver.back()

    def test_bottom_navigation(self, driver, step):
        with step("Bottom nav traversal"):
            wait_for(driver, SELECTORS["bottom_tab_home"]).click()
            scroll_into_view(driver, "Classes")
            wait_for(driver, SELECTORS["bottom_tab_classes"]).click()
            wait_for(driver, SELECTORS["bottom_tab_study"]).click()
            wait_for(driver, SELECTORS["bottom_tab_progress"]).click()
            wait_for(driver, SELECTORS["bottom_tab_connect"]).click()

    def test_network_retry_placeholder(self, driver):
        pytest.skip("Toggle connectivity and implement retry once hooks are available")
