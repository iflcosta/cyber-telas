"""
Stories/Reels Instagram — Campanha Consumidor Final (B2C)
Cyber Informática — Laminação OCA / troca de vidro

Gera os 3 slides em 1080x1920 (proporção 9:16) — formato que ocupa a tela
cheia do celular em Stories e Reels. O carrossel de Feed (1080x1350, 4:5,
gerado por gerar_carrossel_b2c.py / gerar_slide1.py) continua existindo à
parte: o Feed nunca exibe acima de 4:5, então este é um segundo conjunto
para outra colocação, não um substituto.

Reaproveita paleta, fontes e primitivas de desenho do carrossel de Feed;
reimplementa apenas os elementos cujo layout depende do tamanho do canvas
(wordmark/dots, eyebrow badge, canvas base com orbs) para o novo H.
"""
import os
import sys

from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gerar_carrossel_b2c import (  # noqa: E402
    NAVY_950, NAVY_800, WHITE, GRAY_300, GRAY_400, GRAY_500,
    CYBER_BLUE_LIGHT, CIRCUIT_GREEN, CIRCUIT_GREEN_DARK, RED,
    font, text_w, draw_centered, gradient_text, rounded_rect, glow_orb,
    check_icon, cross_icon,
    F_DISPLAY_BOLD, F_BODY_REG, F_BODY_BOLD, F_MONO_BOLD, F_MONO_REG,
)
from gerar_slide1 import crop_to_ratio, vertical_gradient_alpha, SRC_PHOTO  # noqa: E402

W, H = 1080, 1920
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "stories")

# Cabeçalho e rodapé respeitam a faixa de ~250px que o Instagram reserva em
# Stories/Reels pagos para sobrepor UI nativa (chip de perfil/fechar no topo,
# barra de resposta/CTA no rodapé) — nada de conteúdo relevante entra nela.
HEADER_Y = 250
DOT_Y = 264
BADGE_Y = 340
SAFE_BOTTOM = H - 290


def base_canvas_dark():
    img = Image.new("RGB", (W, H), NAVY_950)
    orb1, pad1 = glow_orb(560, CYBER_BLUE_LIGHT, 140, alpha=55)
    img.paste(orb1, (W - 440 - pad1, -280 - pad1), orb1)
    orb2, pad2 = glow_orb(520, CIRCUIT_GREEN, 150, alpha=50)
    img.paste(orb2, (-240 - pad2, H - 520 - pad2), orb2)
    return img


def dot_indicator(draw, right_x, y, dot_index, total=3, r=7, gap=22):
    cx = right_x - (total - 1) * gap
    for i in range(total):
        cx_i = cx + i * gap
        if i == dot_index:
            draw.ellipse([cx_i - r, y - r, cx_i + r, y + r], fill=CIRCUIT_GREEN)
        else:
            draw.ellipse([cx_i - r, y - r, cx_i + r, y + r], outline=GRAY_500, width=2)


def wordmark_header(draw, dot_index, total=3):
    f_word = font(F_MONO_BOLD, 26)
    draw.text((64, HEADER_Y), "CYBER INFORMÁTICA", font=f_word, fill=CYBER_BLUE_LIGHT, anchor="la")
    dot_indicator(draw, W - 64, DOT_Y, dot_index, total)


def eyebrow_badge(draw, cx, y, label):
    f_eb = font(F_MONO_BOLD, 22)
    tw = text_w(draw, label, f_eb)
    pad_x, pad_y = 24, 13
    box = [cx - tw / 2 - pad_x, y, cx + tw / 2 + pad_x, y + 22 + pad_y * 2]
    rounded_rect(draw, box, radius=24, fill=None, outline=CIRCUIT_GREEN, width=2)
    draw.text((cx, y + pad_y), label, font=f_eb, fill=CIRCUIT_GREEN, anchor="ma")
    return box[3]


# ============================================================
# SLIDE 1 — Foto real (hook), espelha o H1 do site
# ============================================================
def make_slide_1():
    photo = Image.open(SRC_PHOTO).convert("RGB")
    photo = crop_to_ratio(photo, W / H)
    photo = photo.resize((W, H), Image.LANCZOS)
    img = photo.convert("RGB")

    top_scrim = Image.new("RGB", (W, H), NAVY_950)
    top_alpha = vertical_gradient_alpha((W, H), [(0.0, 190), (0.09, 80), (0.18, 0), (1.0, 0)])
    img.paste(top_scrim, (0, 0), top_alpha)

    bottom_scrim = Image.new("RGB", (W, H), NAVY_950)
    bottom_alpha = vertical_gradient_alpha((W, H), [(0.0, 0), (0.48, 0), (0.60, 170), (0.76, 235), (1.0, 250)])
    img.paste(bottom_scrim, (0, 0), bottom_alpha)

    draw = ImageDraw.Draw(img)
    wordmark_header(draw, dot_index=0)
    eyebrow_badge(draw, W / 2, BADGE_Y, "LAMINAÇÃO OCA · 1 / 3")

    f_h1 = font(F_DISPLAY_BOLD, 58)
    y = 1300
    draw_centered(draw, W / 2, y, "Tela trincou,", f_h1, WHITE)
    y += 70
    draw_centered(draw, W / 2, y, "mas funciona normal?", f_h1, WHITE)
    y += 70
    gradient_text(img, (W / 2, y), "Troque só o vidro.", f_h1, CYBER_BLUE_LIGHT, CIRCUIT_GREEN, anchor="ma")
    draw = ImageDraw.Draw(img)
    y += 96

    f_sub = font(F_BODY_REG, 29)
    draw_centered(draw, W / 2, y, "Se o toque e as cores continuam normais,", f_sub, GRAY_300)
    y += 40
    draw_centered(draw, W / 2, y, "seu display original está ótimo.", f_sub, GRAY_300)

    f_hint = font(F_MONO_REG, 24)
    draw_centered(draw, W / 2, SAFE_BOTTOM, "Arraste e veja a diferença →", f_hint, CYBER_BLUE_LIGHT)

    return img


# ============================================================
# SLIDE 2 — Paralela vs. Original
# ============================================================
def make_slide_2():
    img = base_canvas_dark()
    draw = ImageDraw.Draw(img)

    wordmark_header(draw, dot_index=1)
    y = eyebrow_badge(draw, W / 2, BADGE_Y, "LAMINAÇÃO OCA · 2 / 3")

    f_h1 = font(F_DISPLAY_BOLD, 66)
    y2 = y + 66
    draw_centered(draw, W / 2, y2, "Não é tela nova.", f_h1, WHITE)
    y2 += 86
    draw_centered(draw, W / 2, y2, "Não é paralela.", f_h1, WHITE)
    y2 += 96
    gradient_text(img, (W / 2, y2), "É a SUA tela original.", f_h1, CYBER_BLUE_LIGHT, CIRCUIT_GREEN, anchor="ma")
    draw = ImageDraw.Draw(img)

    col_y = y2 + 110
    col_w = (W - 64 * 2 - 24) / 2
    col_h = 760
    left_x = 64
    right_x = 64 + col_w + 24

    # Título ocupa os primeiros ~190px do card; os 3 itens dividem o
    # restante em fatias iguais (em vez de ficarem colados no topo com
    # uma sobra vazia embaixo).
    title_zone = 190
    bottom_pad = 60
    item_zone_h = col_h - title_zone - bottom_pad
    slot_h = item_zone_h / 3
    f_col_title = font(F_BODY_BOLD, 40)
    f_item = font(F_BODY_REG, 34)
    icon_r = 30
    line_gap = 46

    rounded_rect(draw, [left_x, col_y, left_x + col_w, col_y + col_h], radius=30,
                 fill=(30, 14, 14), outline=(120, 40, 40), width=2)
    draw.text((left_x + 36, col_y + 46), "Tela paralela", font=f_col_title, fill=(252, 165, 165), anchor="la")

    items_bad = [
        "Cores desbotadas,\nbrilho fraco no sol",
        "Toque que falha\nou digita sozinho",
        "Digital na tela\npara de funcionar",
    ]
    for i, it in enumerate(items_bad):
        slot_top = col_y + title_zone + i * slot_h
        item_h = icon_r * 2 if len(it.split("\n")) == 1 else line_gap * len(it.split("\n"))
        iy = slot_top + (slot_h - item_h) / 2
        cross_icon(draw, left_x + 58, iy + icon_r - 6, icon_r, RED)
        lines = it.split("\n")
        ly = iy
        for line in lines:
            draw.text((left_x + 112, ly), line, font=f_item, fill=GRAY_300, anchor="la")
            ly += line_gap

    rounded_rect(draw, [right_x, col_y, right_x + col_w, col_y + col_h], radius=30,
                 fill=(8, 36, 26), outline=CIRCUIT_GREEN_DARK, width=2)
    draw.text((right_x + 36, col_y + 46), "Display original", font=f_col_title, fill=CIRCUIT_GREEN, anchor="la")

    items_good = [
        "Cores e brilho\nidênticos de fábrica",
        "Toque original,\npreciso, sem falha",
        "Biometria\npreservada",
    ]
    for i, it in enumerate(items_good):
        slot_top = col_y + title_zone + i * slot_h
        item_h = icon_r * 2 if len(it.split("\n")) == 1 else line_gap * len(it.split("\n"))
        iy = slot_top + (slot_h - item_h) / 2
        check_icon(draw, right_x + 58, iy + icon_r - 6, icon_r, CIRCUIT_GREEN)
        lines = it.split("\n")
        ly = iy
        for line in lines:
            draw.text((right_x + 112, ly), line, font=f_item, fill=WHITE, anchor="la")
            ly += line_gap

    f_hint = font(F_MONO_REG, 24)
    draw_centered(draw, W / 2, SAFE_BOTTOM, "Arraste para o orçamento →", f_hint, CYBER_BLUE_LIGHT)

    return img


# ============================================================
# SLIDE 3 — CTA
# ============================================================
def make_slide_3():
    img = base_canvas_dark()
    draw = ImageDraw.Draw(img)

    wordmark_header(draw, dot_index=2)
    y = eyebrow_badge(draw, W / 2, BADGE_Y, "ORÇAMENTO · 3 / 3")

    f_h1 = font(F_DISPLAY_BOLD, 66)
    y2 = y + 130
    draw_centered(draw, W / 2, y2, "Salve seu", f_h1, WHITE)
    y2 += 84
    gradient_text(img, (W / 2, y2), "display original.", f_h1, CYBER_BLUE_LIGHT, CIRCUIT_GREEN, anchor="ma")
    draw = ImageDraw.Draw(img)
    y2 += 100

    f_sub = font(F_BODY_REG, 30)
    draw_centered(draw, W / 2, y2, "Trocamos só o vidro externo —", f_sub, GRAY_300)
    y2 += 40
    draw_centered(draw, W / 2, y2, "sua tela de fábrica continua a mesma.", f_sub, GRAY_300)
    y2 += 130

    card_x, card_w = 64, W - 128
    card_y, card_h = y2, 340
    rounded_rect(draw, [card_x, card_y, card_x + card_w, card_y + card_h], radius=30,
                 fill=NAVY_800, outline=(51, 92, 158), width=1)

    f_price_label = font(F_MONO_BOLD, 20)
    draw_centered(draw, W / 2, card_y + 40, "ECONOMIA", f_price_label, GRAY_400)
    f_price = font(F_DISPLAY_BOLD, 50)
    draw_centered(draw, W / 2, card_y + 70, "Até 70% mais barato", f_price, CIRCUIT_GREEN)
    f_price_sub = font(F_BODY_REG, 27)
    draw_centered(draw, W / 2, card_y + 140, "que uma tela nova na autorizada", f_price_sub, GRAY_300)

    draw.line([(card_x + 44, card_y + 216), (card_x + card_w - 44, card_y + 216)], fill=(51, 92, 158), width=1)

    f_garantia = font(F_BODY_BOLD, 27)
    garantia_txt = "90 dias de garantia do serviço"
    gw = text_w(draw, garantia_txt, f_garantia)
    icon_r = 26
    gx0 = W / 2 - gw / 2 - icon_r * 2 - 14
    check_icon(draw, gx0, card_y + 268, icon_r, CIRCUIT_GREEN)
    draw.text((W / 2 - gw / 2 + icon_r, card_y + 254), garantia_txt, font=f_garantia, fill=WHITE, anchor="la")

    btn_y = card_y + card_h + 100
    btn_w, btn_h = card_w, 140
    btn_x = card_x
    rounded_rect(draw, [btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=btn_h // 2, fill=CIRCUIT_GREEN)
    f_btn = font(F_BODY_BOLD, 37)
    draw.text((btn_x + btn_w / 2, btn_y + btn_h / 2), "Peça seu orçamento no WhatsApp",
               font=f_btn, fill=NAVY_950, anchor="mm")

    f_hours = font(F_MONO_REG, 23)
    draw_centered(draw, W / 2, btn_y + btn_h + 34, "Seg–Sex · Resposta em poucas horas", f_hours, GRAY_400)

    f_disc = font(F_BODY_REG, 21)
    disc_y = btn_y + btn_h + 150
    draw_centered(draw, W / 2, disc_y, "Laboratório independente — não somos", f_disc, GRAY_500)
    draw_centered(draw, W / 2, disc_y + 32, "autorizados de fábrica.", f_disc, GRAY_500)

    return img


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    slides = [
        ("stories-b2c-1-capa.png", make_slide_1),
        ("stories-b2c-2-comparativo.png", make_slide_2),
        ("stories-b2c-3-cta.png", make_slide_3),
    ]
    for name, fn in slides:
        im = fn()
        path = os.path.join(OUT_DIR, name)
        im.save(path, "PNG")
        print(f"OK: {path} ({im.size})")
