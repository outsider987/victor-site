"""Capture 開票所 from a running ~/github/vote dev server (default: localhost:5188)."""
from pathlib import Path
from sys import argv

from playwright.sync_api import sync_playwright

base = (argv[1] if len(argv) > 1 else "http://127.0.0.1:5188").rstrip("/")
out = Path(__file__).parent / "out"
out.mkdir(exist_ok=True)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        headless=True,
        executable_path="/usr/bin/google-chrome",
        args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
    )
    for mode in ("mayor", "council"):
        page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=2, locale="zh-TW")
        page.goto(f"{base}/?source=replay&mode={mode}&t=0.75&intro=0&c=63000", wait_until="domcontentloaded")
        page.locator("#loading.is-done").wait_for(timeout=45000)
        page.wait_for_timeout(2000)
        assert "2022 開票重播" in page.title()
        assert page.locator("#seat-decided").inner_text().strip().isdigit()
        page.add_style_tag(content="#duel-flash, #callout { display: none !important } ")
        page.screenshot(path=str(out / f"vote-{mode}.png"))
        page.close()
    browser.close()
