#!/usr/bin/env python3
"""
Convierte un PDF en páginas WebP ligeras (2 tamaños por página) para el visor de catálogos.

Uso:
    python pdf_a_webp.py MI_CATALOGO.pdf clave "Título del catálogo"

    clave   → nombre corto sin espacios (ej. trabajos, lecturas, premium)

Requisitos (una sola vez):
    pip install pillow pymupdf
    (alternativa: tener instalado "poppler" con pdftoppm)

Resultado:
    ../catalogos/<clave>/p01-800.webp, p01-1400.webp, p02-800.webp, ...
    y al final imprime el bloque que debes pegar dentro de catalogs-data.js
"""
import os, subprocess, sys, tempfile, glob
from PIL import Image

SIZES = (800, 1400)      # 800 → celulares (carga rápida) · 1400 → pantallas grandes/retina
QUALITY = 74             # 70-80 = buena calidad y muy ligero


def pdf_to_pngs(pdf, outdir):
    """Devuelve la lista de imágenes (una por página), a buen tamaño para reducir."""
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(pdf)
        paths = []
        for i, page in enumerate(doc, 1):
            zoom = 1500 / page.rect.width
            pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
            p = os.path.join(outdir, f"pg{i:03d}.png")
            pix.save(p)
            paths.append(p)
        return paths
    except ImportError:
        pass
    # alternativa: poppler
    subprocess.run(["pdftoppm", "-r", "150", "-png", pdf, os.path.join(outdir, "pg")], check=True)
    return sorted(glob.glob(os.path.join(outdir, "pg*.png")))


def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    pdf, key = sys.argv[1], sys.argv[2]
    title = sys.argv[3] if len(sys.argv) > 3 else key.capitalize()
    site = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    out = os.path.join(site, "catalogos", key)
    os.makedirs(out, exist_ok=True)

    entries = []
    with tempfile.TemporaryDirectory() as tmp:
        pages = pdf_to_pngs(pdf, tmp)
        for i, png in enumerate(pages, 1):
            im = Image.open(png).convert("RGB")
            for w in SIZES:
                h = round(im.height * w / im.width)
                im.resize((w, h), Image.LANCZOS).save(
                    os.path.join(out, f"p{i:02d}-{w}.webp"), "WEBP", quality=QUALITY, method=6)
            big_h = round(im.height * SIZES[-1] / im.width)
            entries.append(f'      {{ base: "catalogos/{key}/p{i:02d}", w: {SIZES[-1]}, h: {big_h} }}')

    total = sum(os.path.getsize(f) for f in glob.glob(os.path.join(out, "*.webp")))
    print(f"\n✔ {len(entries)} páginas convertidas · {total/1024:.0f} KB en total\n")
    print("Pega esto dentro de CATALOGS en catalogs-data.js:\n")
    print(f'  {key}: {{\n    title: "{title}",\n    mode: "images",\n    watermark: true,\n    pages: [\n' + ",\n".join(entries) + "\n    ]\n  }")


if __name__ == "__main__":
    main()
