from playwright.sync_api import sync_playwright

def verify_preview(page):
    print("Navigating to homepage...")
    page.goto("http://localhost:5173/")

    # Wait for the main content to load.
    # Based on the code, if no sections, it shows "Nenhuma seção adicionada".
    # Or if there is a main layout.

    print("Waiting for content...")
    # Just wait for the body to be visible or some text
    page.wait_for_selector("body")

    # Take a screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification/preview.png")
    print("Screenshot saved to verification/preview.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_preview(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
