from __future__ import annotations

import re
import sys
from pathlib import Path


ROBOTS_META = '<meta name="robots" content="noindex, nofollow, noarchive">'
STAGING_MARKER = """<style data-staging-marker>
[data-staging-badge]{position:fixed;z-index:2147483647;left:12px;bottom:12px;padding:7px 10px;background:#ff4f24;color:#fff;border:1px solid rgba(255,255,255,.55);font:600 11px/1 Arial,sans-serif;letter-spacing:.08em;pointer-events:none}
</style>"""
STAGING_BADGE = '<div data-staging-badge aria-label="Testumgebung">STAGING</div>'


def prepare_html(path: Path) -> None:
    html = path.read_text(encoding="utf-8")

    robots_pattern = re.compile(
        r'<meta\s+name=["\']robots["\'][^>]*>', re.IGNORECASE
    )
    if robots_pattern.search(html):
        html = robots_pattern.sub(ROBOTS_META, html, count=1)
    else:
        html = re.sub(
            r"</head>",
            f"    {ROBOTS_META}\n    {STAGING_MARKER}\n  </head>",
            html,
            count=1,
            flags=re.IGNORECASE,
        )

    html = re.sub(
        r"(<body\b[^>]*>)",
        rf"\1{STAGING_BADGE}",
        html,
        count=1,
        flags=re.IGNORECASE,
    )
    path.write_text(html, encoding="utf-8", newline="\n")


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: prepare_staging.py <staging-root>")

    root = Path(sys.argv[1]).resolve()
    if not root.is_dir():
        raise SystemExit(f"Staging root does not exist: {root}")

    for html_path in root.rglob("*.html"):
        prepare_html(html_path)

    (root / "robots.txt").write_text(
        "User-agent: *\nDisallow: /\n", encoding="ascii", newline="\n"
    )


if __name__ == "__main__":
    main()
