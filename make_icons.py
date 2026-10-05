"""Creates the TogetherPay launcher icons inside the generated Android project.
Run by the GitHub workflow after `npx cap add android`. Needs Pillow (pip install pillow)."""
import os
from PIL import Image, ImageDraw

NAVY = (11, 42, 111, 255)
BLUE = (29, 78, 216, 255)
WHITE = (255, 255, 255, 255)
RES = os.path.join("android", "app", "src", "main", "res")


def shield(d, cx, cy, w, h):
    pts = [(cx - w / 2, cy - h / 2), (cx + w / 2, cy - h / 2), (cx + w / 2, cy + h * 0.08), (cx, cy + h / 2), (cx - w / 2, cy + h * 0.08)]
    d.polygon(pts, fill=WHITE)
    lw = max(2, int(w * 0.11))
    p = [(cx - w * 0.22, cy - h * 0.02), (cx - w * 0.05, cy + h * 0.16), (cx + w * 0.25, cy - h * 0.16)]
    d.line(p, fill=BLUE, width=lw, joint="curve")
    for q in (p[0], p[2]):
        d.ellipse([q[0] - lw / 2, q[1] - lw / 2, q[0] + lw / 2, q[1] + lw / 2], fill=BLUE)


def foreground(n):
    s = n * 4
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    shield(ImageDraw.Draw(im), s / 2, s / 2, s * 0.34, s * 0.40)
    return im.resize((n, n), Image.LANCZOS)


def legacy(n, round_):
    s = n * 4
    im = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if round_:
        d.ellipse([0, 0, s - 1, s - 1], fill=NAVY)
    else:
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.22), fill=NAVY)
    shield(d, s / 2, s / 2, s * 0.46, s * 0.54)
    return im.resize((n, n), Image.LANCZOS)


def main():
    sizes = {"mdpi": (48, 108), "hdpi": (72, 162), "xhdpi": (96, 216), "xxhdpi": (144, 324), "xxxhdpi": (192, 432)}
    for dpi, (small, big) in sizes.items():
        folder = os.path.join(RES, "mipmap-" + dpi)
        if not os.path.isdir(folder):
            continue
        foreground(big).save(os.path.join(folder, "ic_launcher_foreground.png"))
        legacy(small, False).save(os.path.join(folder, "ic_launcher.png"))
        legacy(small, True).save(os.path.join(folder, "ic_launcher_round.png"))
    with open(os.path.join(RES, "values", "ic_launcher_background.xml"), "w") as f:
        f.write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0B2A6F</color>\n</resources>\n')
    print("Icons created")


if __name__ == "__main__":
    main()
