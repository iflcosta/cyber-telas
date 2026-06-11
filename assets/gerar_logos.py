"""
Geração de logos PNG da Cyber Informática — Versão 2 (refinada)
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Paleta
NAVY = (10, 25, 41)
NAVY_MID = (17, 34, 64)
BLUE = (0, 102, 255)
BLUE_DARK = (0, 82, 204)
GREEN = (0, 255, 136)
WHITE = (255, 255, 255)
GRAY = (74, 85, 104)
LIGHT_GRAY = (138, 164, 196)

OUTPUT_DIR = r"C:\Users\User\Documents\laminacao\assets"

def get_font(size, bold=False):
    paths = [
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\calibrib.ttf" if bold else r"C:\Windows\Fonts\calibri.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    return ImageFont.load_default()

def rounded_rect_gradient(size, color1, color2, radius_ratio=0.22):
    """Cria imagem com gradiente e cantos arredondados."""
    radius = int(size * radius_ratio)
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))

    # Preenche com gradiente
    for i in range(size):
        ratio = i / size
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        ImageDraw.Draw(img).line([(0, i), (size, i)], fill=(r, g, b))

    # Aplica máscara arredondada
    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size-1, size-1], radius=radius, fill=255)

    result = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    result.paste(img, (0, 0), mask)
    return result

def make_monogram_clean(size):
    """Monograma limpo com C estilizado (formato que lembra um 'C' com barra horizontal)."""
    radius = int(size * 0.22)
    img = rounded_rect_gradient(size, BLUE, BLUE_DARK, 0.22)
    draw = ImageDraw.Draw(img)

    # Letra C estilizada — em forma de C aberta na direita
    # Usando proporção: C ocupa 50% do quadrado, centralizada
    margin = size * 0.25
    c_x = margin
    c_y = margin
    c_w = size - 2 * margin
    c_h = size - 2 * margin
    t = size * 0.14  # espessura

    # Cantos arredondados no C
    corner = int(t * 0.4)

    # Topo (com cantos arredondados esquerda)
    draw.rounded_rectangle(
        [c_x, c_y, c_x + c_w, c_y + t],
        radius=corner,
        fill=WHITE
    )
    # Esquerda (vertical, full height)
    draw.rectangle([c_x, c_y, c_x + t, c_y + c_h], fill=WHITE)
    # Base (com cantos arredondados esquerda)
    draw.rounded_rectangle(
        [c_x, c_y + c_h - t, c_x + c_w, c_y + c_h],
        radius=corner,
        fill=WHITE
    )

    # Bolinha indicadora verde (canto superior direito, FORA do C)
    dot_r = int(size * 0.07)
    dot_x = int(size * 0.80)
    dot_y = int(size * 0.20)
    # Anel decorativo
    draw.ellipse(
        [dot_x - dot_r*1.8, dot_y - dot_r*1.8, dot_x + dot_r*1.8, dot_y + dot_r*1.8],
        outline=(GREEN[0], GREEN[1], GREEN[2], 80), width=2
    )
    # Bolinha
    draw.ellipse(
        [dot_x - dot_r, dot_y - dot_r, dot_x + dot_r, dot_y + dot_r],
        fill=GREEN
    )

    return img

def make_logo_horizontal(dark=False):
    """Logo horizontal com ícone + texto."""
    icon_size = 200
    text_height = 180
    padding_x = 40
    padding_y = 30
    gap = 30

    # Calcula largura do texto
    temp_img = Image.new('RGBA', (1, 1))
    temp_draw = ImageDraw.Draw(temp_img)
    f_cyber = get_font(76, bold=False)
    f_informatica = get_font(76, bold=True)
    f_tagline = get_font(22, bold=True)

    bbox1 = temp_draw.textbbox((0, 0), "Cyber ", font=f_cyber)
    bbox2 = temp_draw.textbbox((0, 0), "Informática", font=f_informatica)
    text_w = (bbox2[2] - bbox2[0]) + (bbox1[2] - bbox1[0])

    bbox_tag = temp_draw.textbbox((0, 0), "CENTRO DE REMANUFATURA INDUSTRIAL", font=f_tagline)
    tag_w = bbox_tag[2] - bbox_tag[0]

    # Largura final
    content_w = max(icon_size + gap + text_w, icon_size + gap + tag_w)
    W = int(content_w + 2 * padding_x)
    H = icon_size + 2 * padding_y

    # Background
    bg = NAVY + (255,) if dark else (255, 255, 255, 0)
    img = Image.new('RGBA', (W, H), bg)
    draw = ImageDraw.Draw(img)

    # Ícone
    icon = make_monogram_clean(icon_size)
    icon_y = (H - icon_size) // 2
    img.paste(icon, (padding_x, icon_y), icon)

    # Texto
    text_x = padding_x + icon_size + gap
    color_main = WHITE if dark else NAVY
    color_brand = GREEN if dark else BLUE
    color_tag = (102, 163, 255) if dark else (74, 85, 104)

    # Posiciona vertical
    text_block_y = (H - text_height) // 2
    cyber_y = text_block_y
    tagline_y = cyber_y + 105
    line_y = tagline_y + 35

    # "Cyber" + "Informática"
    draw.text((text_x, cyber_y), "Cyber ", font=f_cyber, fill=color_main)
    bbox_cyber = draw.textbbox((text_x, cyber_y), "Cyber ", font=f_cyber)
    cyber_w = bbox_cyber[2] - bbox_cyber[0]
    draw.text((text_x + cyber_w, cyber_y), "Informática", font=f_informatica, fill=color_brand)

    # Tagline
    draw.text((text_x, tagline_y), "CENTRO DE REMANUFATURA INDUSTRIAL", font=f_tagline, fill=color_tag)

    # Linha decorativa
    line_w = 300
    for i in range(line_w):
        ratio = i / line_w
        r = int(GREEN[0] * (1 - ratio) + BLUE[0] * ratio)
        g = int(GREEN[1] * (1 - ratio) + BLUE[1] * ratio)
        b = int(GREEN[2] * (1 - ratio) + BLUE[2] * ratio)
        draw.line([(text_x + i, line_y), (text_x + i, line_y + 4)], fill=(r, g, b))

    return img

def make_social_square():
    """Logo quadrado para redes sociais (perfil)."""
    W, H = 800, 800
    img = Image.new('RGBA', (W, H), NAVY)
    draw = ImageDraw.Draw(img)

    # Gradiente sutil no background
    for i in range(H):
        ratio = i / H
        r = int(NAVY[0] + (NAVY_MID[0] - NAVY[0]) * ratio * 0.6)
        g = int(NAVY[1] + (NAVY_MID[1] - NAVY[1]) * ratio * 0.6)
        b = int(NAVY[2] + (NAVY_MID[2] - NAVY[2]) * ratio * 0.6)
        draw.line([(0, i), (W, i)], fill=(r, g, b))

    # Linhas de circuito decorativas
    circuit_color = (0, 255, 136, 60)
    for line in [
        ((0, 100), (240, 100)), ((240, 100), (240, 200)),
        ((560, 0), (560, 160)), ((560, 160), (700, 160)),
        ((0, 700), (160, 700)), ((160, 700), (160, 600)),
        ((640, 700), (800, 700)), ((640, 600), (640, 700)),
    ]:
        draw.line(line, fill=circuit_color, width=2)
    for pt in [(240, 100), (240, 200), (560, 160), (160, 600), (640, 600)]:
        draw.ellipse([pt[0]-4, pt[1]-4, pt[0]+4, pt[1]+4], fill=(0, 255, 136, 130))

    # Ícone central
    icon = make_monogram_clean(220)
    icon_x = (W - 220) // 2
    icon_y = 200
    img.paste(icon, (icon_x, icon_y), icon)

    # Textos
    f_cyber = get_font(82, bold=False)
    f_informatica = get_font(82, bold=True)
    f_tagline = get_font(28, bold=True)
    f_sub = get_font(30, bold=False)

    # "Cyber" + "Informática" centralizado
    bbox1 = draw.textbbox((0, 0), "Cyber ", font=f_cyber)
    bbox2 = draw.textbbox((0, 0), "Informática", font=f_informatica)
    w1 = bbox1[2] - bbox1[0]
    w2 = bbox2[2] - bbox2[0]
    total_w = w1 + w2
    start_x = (W - total_w) // 2

    draw.text((start_x, 480), "Cyber ", font=f_cyber, fill=WHITE)
    draw.text((start_x + w1, 480), "Informática", font=f_informatica, fill=GREEN)

    # Tagline
    tagline = "CENTRO DE REMANUFATURA INDUSTRIAL"
    bbox_tag = draw.textbbox((0, 0), tagline, font=f_tagline)
    w_tag = bbox_tag[2] - bbox_tag[0]
    draw.text(((W - w_tag) // 2, 600), tagline, font=f_tagline, fill=(102, 163, 255))

    # Linha decorativa
    line_y = 650
    line_w = 260
    line_x = (W - line_w) // 2
    for i in range(line_w):
        ratio = i / line_w
        r = int(GREEN[0] * (1 - ratio) + BLUE[0] * ratio)
        g = int(GREEN[1] * (1 - ratio) + BLUE[1] * ratio)
        b = int(GREEN[2] * (1 - ratio) + BLUE[2] * ratio)
        draw.line([(line_x + i, line_y), (line_x + i, line_y + 5)], fill=(r, g, b))

    # Subtítulo
    sub = "Laminação OCA · Remanufatura de Displays"
    bbox_sub = draw.textbbox((0, 0), sub, font=f_sub)
    w_sub = bbox_sub[2] - bbox_sub[0]
    draw.text(((W - w_sub) // 2, 690), sub, font=f_sub, fill=(138, 164, 196))

    return img

# ============================================================
# EXECUÇÃO
# ============================================================
print("Gerando logos Cyber Informática v2...")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Logo horizontal (light)
logo_h = make_logo_horizontal(dark=False)
logo_h.save(os.path.join(OUTPUT_DIR, "logo-horizontal-light.png"), "PNG", quality=95)
print(f"  - logo-horizontal-light.png ({logo_h.size})")

# Logo horizontal (dark)
logo_d = make_logo_horizontal(dark=True)
logo_d.save(os.path.join(OUTPUT_DIR, "logo-horizontal-dark.png"), "PNG", quality=95)
print(f"  - logo-horizontal-dark.png ({logo_d.size})")

# Logo horizontal (transparente)
logo_t = make_logo_horizontal(dark=False)
logo_t.save(os.path.join(OUTPUT_DIR, "logo-horizontal.png"), "PNG", quality=95)
print(f"  - logo-horizontal.png ({logo_t.size})")

# Monograma em vários tamanhos
for size in [512, 256, 128, 64, 32]:
    m = make_monogram_clean(size)
    m.save(os.path.join(OUTPUT_DIR, f"logo-monograma-{size}.png"), "PNG")
    print(f"  - logo-monograma-{size}.png")

# Favicon
fav = make_monogram_clean(256)
fav.save(os.path.join(OUTPUT_DIR, "favicon-256.png"), "PNG")
print(f"  - favicon-256.png")

# Redes sociais
social = make_social_square()
social.save(os.path.join(OUTPUT_DIR, "logo-redes-sociais-800.png"), "PNG", quality=95)
print(f"  - logo-redes-sociais-800.png")

# OG image (1200x630)
og = make_social_square().resize((1200, 630))
og.save(os.path.join(OUTPUT_DIR, "og-image-1200x630.png"), "PNG", quality=90)
print(f"  - og-image-1200x630.png")

print("\nConcluído!")
print(f"Arquivos em: {OUTPUT_DIR}")
