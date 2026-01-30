from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Collect logs
        logs = []
        page.on("console", lambda msg: logs.append(msg.text) if "PROFILER" in msg.text else None)

        print("Navigating to app...")
        page.goto("http://localhost:5173")

        # Wait for app to load
        page.wait_for_selector("button[title='Adicionar seção']")

        print("Adding 10 sections...")
        add_btn = page.get_by_title("Adicionar seção")

        for i in range(10):
            add_btn.click()
            # Click 'Hero Section'
            page.get_by_text("Hero Section").click()
            # Wait a bit for render
            time.sleep(0.1)

        print("Selecting first section...")
        page.locator("text=Hero").first.click()

        # Clear previous logs to measure update cost only
        logs.clear()

        print("Typing into headline...")
        # Find headline input by placeholder
        input_locator = page.get_by_placeholder("Seu título impactante")

        # Type 'Test' - 4 keystrokes
        input_locator.fill("") # Clear first
        input_locator.press_sequentially("Test", delay=100)

        # Wait for logs
        time.sleep(1)

        item_renders = len([l for l in logs if "Item Render" in l])
        list_renders = len([l for l in logs if "SectionList Render" in l])

        print(f"METRICS_START")
        print(f"Item Renders: {item_renders}")
        print(f"SectionList Renders: {list_renders}")
        print(f"METRICS_END")

        # Take screenshot
        page.screenshot(path="verification/optimization_proof.png")

        browser.close()

if __name__ == "__main__":
    run()
