from playwright.sync_api import Page, expect, sync_playwright
import json
import time

def test_chat_flow(page: Page):
    # Mock the API response
    mock_config = {
        "id": "test-id",
        "name": "Test Page",
        "sections": [
            {
                "id": "hero-1",
                "type": "hero",
                "order": 0,
                "variant": "full-width",
                "headline": "Mocked Hero",
                "subheadline": "Mocked Subheadline",
                "ctaText": "Click Me",
                "showForm": False
            }
        ],
        "design": {
            "primaryColor": "#000000",
            "secondaryColor": "#ffffff",
            "fontFamily": "Inter",
            "buttonStyle": "rounded"
        },
        "integrations": {},
        "createdAt": "2023-01-01T00:00:00Z",
        "updatedAt": "2023-01-01T00:00:00Z"
    }

    mock_session = {
        "id": "session-1",
        "messages": [
            {"role": "user", "content": "Test Page", "timestamp": 1234567890},
            {"role": "assistant", "content": "Done", "timestamp": 1234567891}
        ],
        "lpConfig": mock_config,
        "createdAt": 1234567890,
        "updatedAt": 1234567891
    }

    def handle_route(route):
        print("Intercepted /api/chat")
        route.fulfill(json={"session": mock_session, "config": mock_config})

    page.route("**/api/chat", handle_route)

    # 1. Load Page
    print("Loading page...")
    page.goto("http://localhost:5173")

    # 2. Verify Welcome Screen
    print("Verifying Welcome Screen...")
    expect(page.get_by_text("What are we building today?")).to_be_visible()

    # 3. Take Screenshot of Welcome Screen
    page.screenshot(path="verification/1_welcome.png")

    # 4. Interact
    print("Entering prompt...")
    # Find textarea
    page.locator("textarea").fill("Test Page")
    # Click submit
    page.locator("button[type='submit']").click()

    # Wait for change
    print("Waiting for preview...")
    # Expect "Mocked Hero" to appear in preview
    expect(page.get_by_text("Mocked Hero")).to_be_visible()

    # 5. Verify Sidebar
    print("Verifying Sidebar...")
    expect(page.get_by_text("AI Assistant")).to_be_visible()

    # 6. Take Screenshot of Result
    page.screenshot(path="verification/2_result.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_chat_flow(page)
            print("Verification script finished successfully.")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()
