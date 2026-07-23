from __future__ import annotations

import re
import sys
from pathlib import Path


ALLOWED_PROJECTS = {
    "50-jahre-europa-park.html",
    "dj-bobo-evolut30n-tour.html",
    "novartis-medportal.html",
    "photography.html",
    "tnw-website.html",
    "voltron-nevera-tv-werbespot.html",
}

NON_PROJECT_WORKS_PAGES = {"photography.html", "works.html"}


def is_project_page(path: Path) -> bool:
    html = path.read_text(encoding="utf-8")
    return '<body data-page="works"' in html


def curate_works_page(path: Path) -> None:
    html = path.read_text(encoding="utf-8")
    card_pattern = re.compile(
        r'\s*<a class="redox-project-card"(?: id="[^"]+")? '
        r'href="(?P<href>[^"]+\.html)">.*?</a>',
        re.DOTALL,
    )

    def keep_allowed(match: re.Match[str]) -> str:
        return match.group(0) if match.group("href") in ALLOWED_PROJECTS else ""

    html = card_pattern.sub(keep_allowed, html)
    path.write_text(html, encoding="utf-8", newline="\n")


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: prepare_production.py <production-root>")

    root = Path(sys.argv[1]).resolve()
    if not root.is_dir():
        raise SystemExit(f"Production root does not exist: {root}")

    for html_path in root.glob("*.html"):
        if (
            html_path.name not in ALLOWED_PROJECTS
            and html_path.name not in NON_PROJECT_WORKS_PAGES
            and is_project_page(html_path)
        ):
            html_path.unlink()

    curate_works_page(root / "works.html")


if __name__ == "__main__":
    main()
