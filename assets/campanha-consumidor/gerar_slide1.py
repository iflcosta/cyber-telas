"""
Carrossel Instagram — Campanha Consumidor Final (B2C)
Cyber Informática — Laminação OCA / troca de vidro

Gera o slide 1 (1080x1350, proporção 4:5) a partir da FOTO REAL enviada
pelo usuário (Copilot_20260717_171915.png, raiz do repo), aplicando o
mesmo sistema visual dos slides 2 e 3 (wordmark, dots, eyebrow badge,
headline com gradiente).
"""
import os
import sys

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gerar_carrossel_b2c import (  # noqa: E402
    W, H, NAVY_950, WHITE, GRAY_300, CYBER_BLUE_LIGHT, CIRCUIT_GREEN,
    font, draw_centered, gradient_text, wordmark_header, eyebrow_badge,
    F_DISPLAY_BOLD, F_BODY_REG, F_MONO_REG,
)

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_PHOTO = os.path.join(OUT_DIR, "raw", "slide1-foto-original.png")


def crop_to_ratio(img, target_ratio, top_bias=0.42):
    """Corta para a proporção alvo (W/H), mantendo o sujeito (mãos + aparelho)
    levemente acima do centro vertical em vez de cortar simétrico."""
    w, h = img.size
    cur_ratio = w / h
    if cur_ratio > target_ratio:
        new_w = int(h * target_ratio)
        x0 = (w - new_w) // 2
        return img.crop((x0, 0, x0 + new_w, h))
    else:
        new_h = int(w / target_ratio)
        slack = h - new_h
        y0 = int(slack * top_bias)
        return img.crop((0, y0, w, y0 + new_h))


def vertical_gradient_alpha(size, stops):
    """stops: lista de (posição 0..1, alpha 0..255) ordenada. Retorna imagem L."""
    w, h = size
    grad = Image.new("L", (1, h))
    px = grad.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        for i in range(len(stops) - 1):
            t0, a0 = stops[i]
            t1, a1 = stops[i + 1]
            if t0 <= t <= t1:
                local = (t - t0) / max(t1 - t0, 1e-6)
                px[0, y] = int(a0 + (a1 - a0) * local)
                break
        else:
            px[0, y] = stops[-1][1]
    return grad.resize((w, h))


def make_slide_1():
    photo = Image.open(SRC_PHOTO).convert("RGB")
    photo = crop_to_ratio(photo, W / H, top_bias=0.35)
    photo = photo.resize((W, H), Image.LANCZOS)
    img = photo.convert("RGB")

    # Scrim superior — legibilidade do wordmark/badge
    top_scrim = Image.new("RGB", (W, H), NAVY_950)
    top_alpha = vertical_gradient_alpha((W, H), [(0.0, 195), (0.16, 60), (0.30, 0), (1.0, 0)])
    img.paste(top_scrim, (0, 0), top_alpha)

    # Scrim inferior — legibilidade do headline/subtexto
    bottom_scrim = Image.new("RGB", (W, H), NAVY_950)
    bottom_alpha = vertical_gradient_alpha((W, H), [(0.0, 0), (0.52, 0), (0.68, 150), (0.82, 235), (1.0, 250)])
    img.paste(bottom_scrim, (0, 0), bottom_alpha)

    draw = ImageDraw.Draw(img)

    wordmark_header(img, draw, dot_index=0)
    draw = ImageDraw.Draw(img)
    eyebrow_badge(draw, W / 2, 140, "LAMINAÇÃO OCA · 1 / 3")

    f_h1 = font(F_DISPLAY_BOLD, 60)
    y = H - 400
    draw_centered(draw, W / 2, y, "Vidro trincado.", f_h1, WHITE)
    y += 76
    gradient_text(img, (W / 2, y), "Display 100% original.", f_h1, CYBER_BLUE_LIGHT, CIRCUIT_GREEN, anchor="ma")
    draw = ImageDraw.Draw(img)
    y += 92

    f_sub = font(F_BODY_REG, 27)
    draw_centered(draw, W / 2, y, "Sem tela paralela. Trocamos só o vidro", f_sub, GRAY_300)
    y += 36
    draw_centered(draw, W / 2, y, "externo — o display de fábrica continua o mesmo.", f_sub, GRAY_300)

    f_hint = font(F_MONO_REG, 22)
    draw_centered(draw, W / 2, H - 90, "Arraste e veja a diferença →", f_hint, CYBER_BLUE_LIGHT)

    return img


if __name__ == "__main__":
    im = make_slide_1()
    path = os.path.join(OUT_DIR, "carrossel-b2c-1-capa.png")
    im.save(path, "PNG")
    print(f"OK: {path} ({im.size})")
