from playwright.sync_api import sync_playwright

def verify_preview(page):
    print("Navegando para a página inicial...")
    page.goto("http://localhost:5173/")

    # Aguardar o conteúdo principal carregar.
    # Com base no código, se não houver seções, mostra "Nenhuma seção adicionada".
    # Ou se houver um layout principal.

    print("Aguardando conteúdo...")
    # Apenas aguardar o corpo ficar visível ou algum texto
    page.wait_for_selector("body")

    # Tirar um print
    print("Tirando captura de tela...")
    page.screenshot(path="verification/preview.png")
    print("Captura de tela salva em verification/preview.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_preview(page)
        except Exception as e:
            print(f"Erro: {e}")
        finally:
            browser.close()
