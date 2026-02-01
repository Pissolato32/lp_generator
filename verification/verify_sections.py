from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173")

    expect(page.get_by_text("O que vamos construir hoje?")).to_be_visible()

    page.get_by_role("textbox").fill("Create a landing page")
    page.get_by_role("textbox").press("Enter")

    # Wait for LivePreview
    expect(page.get_by_role("heading", name="Hero Section")).to_be_visible(timeout=10000)

    # Check for Pricing (Heading)
    expect(page.get_by_role("heading", name="Nossos Planos")).to_be_visible()

    # Check for FAQ (Heading)
    expect(page.get_by_role("heading", name="Perguntas Frequentes")).to_be_visible()

    # Screenshot
    page.screenshot(path="verification/verification.png", full_page=True)
    print("Verification passed!")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
