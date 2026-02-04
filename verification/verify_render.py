
from playwright.sync_api import sync_playwright, expect

def verify_live_preview():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to app
        page.goto("http://localhost:5173")

        # Wait for Welcome Screen title
        page.wait_for_selector("text=O que vamos construir hoje?")

        print("Welcome screen loaded successfully.")

        # Screenshot
        page.screenshot(path="verification/live_preview_verification.png")

        browser.close()
        print("Verification script completed successfully.")

if __name__ == "__main__":
    verify_live_preview()
