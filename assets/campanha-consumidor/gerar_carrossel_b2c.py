"""
Carrossel Instagram — Campanha Consumidor Final (B2C)
Cyber Informática — Laminação OCA / troca de vidro

Gera os slides 2 e 3 do carrossel (1080x1350, proporção 4:5).
O slide 1 usa uma FOTO REAL (mesma linhagem estética de
public/hero-laminacao.png) e é montado por gerar_slide1.py, que reaproveita
as funções deste módulo.

Paleta e copy alinhadas ao site (apps/telas/app/page.tsx):
- Slide 2 espelha a seção "ParallelObjection" (paralela vs. original)
- Slide 3 espelha a seção "Cotacao" / CTA final (WhatsApp + garantia)
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

# ============================================================
# Paleta — idêntica aos tokens do site (tailwind.config.ts)
# ============================================================
NAVY_950 = (5, 10, 20)      # #050a14
NAVY_900 = (10, 25, 41)     # #0a1929
NAVY_800 = (17, 34, 64)     # #112240
CYBER_BLUE = (0, 102, 255)      # #0066ff
CYBER_BLUE_HOVER = (0, 82, 204) # #0052cc
CYBER_BLUE_LIGHT = (51, 133, 255) # #3385ff
CIRCUIT_GREEN = (0, 255, 136)      # #00ff88
CIRCUIT_GREEN_DARK = (0, 204, 106) # #00cc6a
WHITE = (255, 255, 255)
GRAY_300 = (209, 213, 219)
GRAY_400 = (156, 163, 175)
GRAY_500 = (107, 114, 128)
RED = (239, 68, 68)
RED_DIM = (127, 40, 40)

W, H = 1080, 1350

FONT_DIR = "/root/.claude/skills/canvas-design/canvas-fonts"
F_DISPLAY_BOLD = os.path.join(FONT_DIR, "BricolageGrotesque-Bold.ttf")
F_BODY_REG = os.path.join(FONT_DIR, "Outfit-Regular.ttf")
F_BODY_BOLD = os.path.join(FONT_DIR, "Outfit-Bold.ttf")
F_MONO_BOLD = os.path.join(FONT_DIR, "JetBrainsMono-Bold.ttf")
F_MONO_REG = os.path.join(FONT_DIR, "JetBrainsMono-Regular.ttf")

OUT_DIR = os.path.dirname(os.path.abspath(__file__))


def font(path, size):
    return ImageFont.truetype(path, size)


def text_w(draw, txt, f):
    b = draw.textbbox((0, 0), txt, font=f)
    return b[2] - b[0]


def draw_centered(draw, cx, y, txt, f, fill, tracking=0):
    if tracking == 0:
        draw.text((cx, y), txt, font=f, fill=fill, anchor="ma")
        return
    total_w = sum(text_w(draw, ch, f) + tracking for ch in txt) - tracking
    x = cx - total_w / 2
    for ch in txt:
        draw.text((x, y), ch, font=f, fill=fill, anchor="la")
        x += text_w(draw, ch, f) + tracking


def gradient_text(base_img, xy, txt, f, color1, color2, anchor="la", vertical=False):
    """Renderiza texto com gradiente linear (equivalente ao .gradient-text do site)."""
    mask = Image.new("L", base_img.size, 0)
    mdraw = ImageDraw.Draw(mask)
    mdraw.text(xy, txt, font=f, fill=255, anchor=anchor)
    bbox = mask.getbbox()
    if bbox is None:
        return
    grad = Image.new("RGB", base_img.size, color1)
    gdraw = ImageDraw.Draw(grad)
    x0, y0, x1, y1 = bbox
    span = (x1 - x0) if not vertical else (y1 - y0)
    span = max(span, 1)
    for i in range(span):
        ratio = i / span
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        if vertical:
            gdraw.line([(x0, y0 + i), (x1, y0 + i)], fill=(r, g, b))
        else:
            gdraw.line([(x0 + i, y0), (x0 + i, y1)], fill=(r, g, b))
    base_img.paste(grad, (0, 0), mask)


def rounded_rect(draw, box, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def glow_orb(size, color, blur, alpha=70):
    # Canvas maior que o orb para o blur não ser cortado nas bordas (evita
    # a aparência de "bloco sólido" quando o glow é colado perto da margem).
    pad = blur * 3
    canvas = size + pad * 2
    img = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([pad, pad, pad + size, pad + size], fill=color + (alpha,))
    return img.filter(ImageFilter.GaussianBlur(blur)), pad


def base_canvas_dark():
    img = Image.new("RGB", (W, H), NAVY_950)
    # orbs — ecoam os dois blurs sutis do hero do site (top-right blue / bottom-left green)
    orb1, pad1 = glow_orb(520, CYBER_BLUE, 130, alpha=60)
    img.paste(orb1, (W - 420 - pad1, -260 - pad1), orb1)
    orb2, pad2 = glow_orb(460, CIRCUIT_GREEN, 130, alpha=55)
    img.paste(orb2, (-220 - pad2, H - 300 - pad2), orb2)
    return img


def dot_indicator(draw, right_x, y, dot_index, total=3, r=6, gap=20):
    """Bolinhas desenhadas à mão (glifos ● ○ não renderizam de forma confiável
    em todas as fontes mono usadas)."""
    cx = right_x - (total - 1) * gap
    for i in range(total):
        cx_i = cx + i * gap
        if i == dot_index:
            draw.ellipse([cx_i - r, y - r, cx_i + r, y + r], fill=CIRCUIT_GREEN)
        else:
            draw.ellipse([cx_i - r, y - r, cx_i + r, y + r], outline=GRAY_500, width=2)


def wordmark_header(img, draw, dot_index, total=3):
    # Wordmark mono, canto superior esquerdo
    f_word = font(F_MONO_BOLD, 24)
    draw.text((64, 56), "CYBER INFORMÁTICA", font=f_word, fill=CYBER_BLUE_LIGHT, anchor="la")
    # Indicador de progresso do carrossel, canto superior direito
    dot_indicator(draw, W - 64, 68, dot_index, total)


def eyebrow_badge(draw, cx, y, label):
    f_eb = font(F_MONO_BOLD, 20)
    tw = text_w(draw, label, f_eb)
    pad_x, pad_y = 22, 12
    box = [cx - tw / 2 - pad_x, y, cx + tw / 2 + pad_x, y + 20 + pad_y * 2]
    rounded_rect(draw, box, radius=22, fill=None, outline=CIRCUIT_GREEN, width=2)
    draw.text((cx, y + pad_y), label, font=f_eb, fill=CIRCUIT_GREEN, anchor="ma")
    return box[3]


def check_icon(draw, cx, cy, r, color):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=4)
    draw.line(
        [(cx - r * 0.45, cy + r * 0.05), (cx - r * 0.1, cy + r * 0.4), (cx + r * 0.5, cy - r * 0.35)],
        fill=color, width=5, joint="curve",
    )


def cross_icon(draw, cx, cy, r, color):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=4)
    off = r * 0.4
    draw.line([(cx - off, cy - off), (cx + off, cy + off)], fill=color, width=5)
    draw.line([(cx - off, cy + off), (cx + off, cy - off)], fill=color, width=5)


# ============================================================
# SLIDE 2 — Paralela vs. Original (espelha ParallelObjection do site)
# ============================================================
def make_slide_2():
    img = base_canvas_dark()
    draw = ImageDraw.Draw(img)

    wordmark_header(img, draw, dot_index=1)

    y = eyebrow_badge(draw, W / 2, 140, "LAMINAÇÃO OCA · 2 / 3")

    f_h1 = font(F_DISPLAY_BOLD, 58)
    y2 = y + 46
    draw_centered(draw, W / 2, y2, "Não é tela nova.", f_h1, WHITE)
    y2 += 68
    draw_centered(draw, W / 2, y2, "Não é paralela.", f_h1, WHITE)
    y2 += 78
    gradient_text(img, (W / 2, y2), "É a SUA tela original.", f_h1, CYBER_BLUE_LIGHT, CIRCUIT_GREEN, anchor="ma")
    draw = ImageDraw.Draw(img)  # redraw handle após paste do gradiente

    # Duas colunas comparativas
    col_y = y2 + 110
    col_w = (W - 64 * 2 - 24) / 2
    col_h = 560
    left_x = 64
    right_x = 64 + col_w + 24

    # Coluna esquerda — paralela (vermelho)
    rounded_rect(draw, [left_x, col_y, left_x + col_w, col_y + col_h], radius=28,
                 fill=(30, 14, 14), outline=(120, 40, 40), width=2)
    f_col_title = font(F_BODY_BOLD, 30)
    draw.text((left_x + 32, col_y + 34), "Tela paralela", font=f_col_title, fill=(252, 165, 165), anchor="la")

    items_bad = [
        "Cores desbotadas,\nbrilho fraco no sol",
        "Toque que falha\nou digita sozinho",
        "Digital na tela\npara de funcionar",
    ]
    iy = col_y + 110
    f_item = font(F_BODY_REG, 24)
    for it in items_bad:
        cross_icon(draw, left_x + 46, iy + 18, 20, RED)
        lines = it.split("\n")
        ly = iy
        for line in lines:
            draw.text((left_x + 88, ly), line, font=f_item, fill=GRAY_300, anchor="la")
            ly += 32
        iy += 118

    # Coluna direita — original (verde)
    rounded_rect(draw, [right_x, col_y, right_x + col_w, col_y + col_h], radius=28,
                 fill=(8, 36, 26), outline=CIRCUIT_GREEN_DARK, width=2)
    draw.text((right_x + 32, col_y + 34), "Display original", font=f_col_title, fill=CIRCUIT_GREEN, anchor="la")

    items_good = [
        "Cores e brilho\nidênticos aos de fábrica",
        "Toque original,\npreciso, sem fantasma",
        "Biometria\nfuncionando 100%",
    ]
    iy = col_y + 110
    for it in items_good:
        check_icon(draw, right_x + 46, iy + 18, 20, CIRCUIT_GREEN)
        lines = it.split("\n")
        ly = iy
        for line in lines:
            draw.text((right_x + 88, ly), line, font=f_item, fill=WHITE, anchor="la")
            ly += 32
        iy += 118

    # Rodapé — swipe hint
    f_hint = font(F_MONO_REG, 22)
    draw_centered(draw, W / 2, H - 90, "Arraste para o orçamento →", f_hint, CYBER_BLUE_LIGHT)

    return img


# ============================================================
# SLIDE 3 — CTA (espelha a seção "Cotacao" / FinalCta do site)
# ============================================================
def make_slide_3():
    img = base_canvas_dark()
    draw = ImageDraw.Draw(img)

    wordmark_header(img, draw, dot_index=2)

    y = eyebrow_badge(draw, W / 2, 150, "ORÇAMENTO · 3 / 3")

    f_h1 = font(F_DISPLAY_BOLD, 64)
    y2 = y + 70
    draw_centered(draw, W / 2, y2, "Salve seu", f_h1, WHITE)
    y2 += 76
    gradient_text(img, (W / 2, y2), "display original.", f_h1, CYBER_BLUE_LIGHT, CIRCUIT_GREEN, anchor="ma")
    draw = ImageDraw.Draw(img)
    y2 += 100

    f_sub = font(F_BODY_REG, 28)
    draw_centered(draw, W / 2, y2, "Trocamos só o vidro externo — sua tela", f_sub, GRAY_300)
    y2 += 38
    draw_centered(draw, W / 2, y2, "de fábrica continua a mesma.", f_sub, GRAY_300)
    y2 += 70

    # Card de preço/garantia
    card_x, card_w = 64, W - 128
    card_y, card_h = y2, 210
    rounded_rect(draw, [card_x, card_y, card_x + card_w, card_y + card_h], radius=28,
                 fill=NAVY_800, outline=(51, 92, 158), width=1)

    f_price_label = font(F_MONO_BOLD, 18)
    draw_centered(draw, W / 2, card_y + 28, "ECONOMIA", f_price_label, GRAY_400)
    f_price = font(F_DISPLAY_BOLD, 46)
    draw_centered(draw, W / 2, card_y + 54, "Até 70% mais barato", f_price, CIRCUIT_GREEN)
    f_price_sub = font(F_BODY_REG, 24)
    draw_centered(draw, W / 2, card_y + 112, "que uma tela nova na autorizada", f_price_sub, GRAY_300)

    # Divisor
    draw.line([(card_x + 40, card_y + 156), (card_x + card_w - 40, card_y + 156)], fill=(51, 92, 158), width=1)

    f_garantia = font(F_BODY_BOLD, 24)
    garantia_txt = "90 dias de garantia do serviço"
    gw = text_w(draw, garantia_txt, f_garantia)
    icon_r = 14
    gx0 = W / 2 - gw / 2 - icon_r * 2 - 10
    check_icon(draw, gx0, card_y + 182, icon_r, CIRCUIT_GREEN)
    draw.text((W / 2 - gw / 2 + icon_r, card_y + 170), garantia_txt, font=f_garantia, fill=WHITE, anchor="la")

    # Botão CTA WhatsApp
    btn_y = card_y + card_h + 60
    btn_w, btn_h = card_w, 110
    btn_x = card_x
    rounded_rect(draw, [btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=btn_h // 2, fill=CIRCUIT_GREEN)
    f_btn = font(F_BODY_BOLD, 32)
    draw.text((btn_x + btn_w / 2, btn_y + btn_h / 2), "Peça seu orçamento no WhatsApp",
               font=f_btn, fill=NAVY_950, anchor="mm")

    f_hours = font(F_MONO_REG, 20)
    draw_centered(draw, W / 2, btn_y + btn_h + 24, "Seg–Sex · Resposta em poucas horas", f_hours, GRAY_400)

    # Disclaimer de transparência (compliance)
    f_disc = font(F_BODY_REG, 18)
    draw_centered(draw, W / 2, H - 70, "Laboratório independente — não somos autorizados", f_disc, GRAY_500)
    draw_centered(draw, W / 2, H - 46, "Apple ou Samsung.", f_disc, GRAY_500)

    return img


if __name__ == "__main__":
    slides = [
        ("carrossel-b2c-2-comparativo.png", make_slide_2),
        ("carrossel-b2c-3-cta.png", make_slide_3),
    ]
    for name, fn in slides:
        im = fn()
        path = os.path.join(OUT_DIR, name)
        im.save(path, "PNG")
        print(f"OK: {path} ({im.size})")
