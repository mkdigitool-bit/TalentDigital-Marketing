#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Telecharge les polices Google (Archivo + JetBrains Mono) et genere fonts.css."""
import os
import re
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUB = os.path.join(ROOT, "public", "fonts")
CSS_OUT = os.path.join(ROOT, "src", "styles", "fonts.css")
URL = (
    "https://fonts.googleapis.com/css2?"
    "family=Archivo:wght@400;500;600;700;800;900"
    "&family=JetBrains+Mono:wght@400;500;700&display=swap"
)
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)

BLOCK_RE = re.compile(r"/\*\s*(?P<subset>[^*]+?)\s*\*/\s*@font-face\s*\{(?P<body>[^}]+)\}", re.S)


def fetch(url, ua=None):
    req = urllib.request.Request(url, headers={"User-Agent": ua or UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read()


def main():
    os.makedirs(PUB, exist_ok=True)
    css = fetch(URL).decode("utf-8")
    faces = []
    used = set()
    for m in BLOCK_RE.finditer(css):
        subset = m.group("subset").strip()
        if subset not in ("latin", "latin-ext"):
            continue
        body = m.group("body")
        fam = re.search(r"font-family:\s*'([^']+)'", body).group(1)
        weight = re.search(r"font-weight:\s*(\d+)", body).group(1)
        style = re.search(r"font-style:\s*(\w+)", body).group(1)
        src = re.search(r"url\((https://[^)]+\.woff2)\)", body).group(1)
        rng = re.search(r"unicode-range:\s*([^;]+);", body)
        unicode_range = rng.group(1).strip() if rng else None

        slug = re.sub(r"[^a-z0-9]+", "-", fam.lower()).strip("-")
        name = f"{slug}-{weight}-{subset}.woff2"
        path = os.path.join(PUB, name)
        if name not in used:
            with open(path, "wb") as fh:
                fh.write(fetch(src))
            used.add(name)
        entry = [f"@font-face {{", f"  font-family: '{fam}';", f"  font-style: {style};",
                 f"  font-weight: {weight};", "  font-display: swap;",
                 f"  src: url('/fonts/{name}') format('woff2');"]
        if unicode_range:
            entry.append(f"  unicode-range: {unicode_range};")
        entry.append("}")
        faces.append("\n".join(entry))

    with open(CSS_OUT, "w", encoding="utf-8") as fh:
        fh.write("/* Polices auto-hebergees - genere le 2026-11-15 */\n")
        fh.write("\n".join(faces) + "\n")
    print(f"{len(used)} fichiers woff2 -> public/fonts")
    print(f"{len(faces)} blocs @font-face -> src/styles/fonts.css")


if __name__ == "__main__":
    main()
