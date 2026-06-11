"""
Gera versão do logo horizontal com cores otimizadas para header escuro.
Problema: o logo horizontal light tem o 'Cyber' em azul, e o 'Informática' em azul.
Ambos ficam invisíveis sobre fundo navy escuro.
Solução: criar versão onde 'Cyber' fica em branco, e 'Informática' em verde (Circuit Green).
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Paleta
NAVY = (10, 25, 41)
BLUE = (0, 102, 255)
BLUE_DARK = (0, 82, 204)
GREEN = (0, 255, 136)
WHITE = (255, 255, 255)

OUTPUT_DIR = r"C:\Users\User\Documents\laminacao"

def get_font(size, bold=False):
    paths = [
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
    ]
    for p in paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except:
                pass
    return ImageFont.load_default()

def rounded_rect_gradient(size, color1, color2, radius_ratio=0.22):
    radius = int(size * radius_ratio)
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    for i in range(size):
        ratio = i / size
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        ImageDraw.Draw(img).line([(0, i), (size, i)], fill=(r, g, b))
    mask = Image.new('L', (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size-1, size-1], radius=radius, fill=255)
    result = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    result.paste(img, (0, 0), mask)
    return result

def make_monogram(size):
    img = rounded_rect_gradient(size, BLUE, BLUE_DARK, 0.22)
    draw = ImageDraw.Draw(img)
    margin = size * 0.25
    c_x = margin
    c_y = margin
    c_w = size - 2 * margin
    c_h = size - 2 * margin
    t = size * 0.14
    corner = int(t * 0.4)
    draw.rounded_rectangle([c_x, c_y, c_x + c_w, c_y + t], radius=corner, fill=WHITE)
    draw.rectangle([c_x, c_y, c_x + t, c_y + c_h], fill=WHITE)
    draw.rounded_rectangle([c_x, c_y + c_h - t, c_x + c_w, c_y + c_h], radius=corner, fill=WHITE)
    dot_r = int(size * 0.07)
    dot_x = int(size * 0.80)
    dot_y = int(size * 0.20)
    draw.ellipse([dot_x - dot_r*1.8, dot_y - dot_r*1.8, dot_x + dot_r*1.8, dot_y + dot_r*1.8],
                 outline=(GREEN[0], GREEN[1], GREEN[2], 80), width=2)
    draw.ellipse([dot_x - dot_r, dot_y - dot_r, dot_x + dot_r, dot_y + dot_r], fill=GREEN)
    return img

# Logo para header (Cyber em branco, Informática em verde) sobre fundo escuro
def make_logo_for_dark_header():
    icon_size = 200
    text_height = 180
    padding_x = 40
    padding_y = 30
    gap = 30

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

    content_w = max(icon_size + gap + text_w, icon_size + gap + tag_w)
    W = int(content_w + 2 * padding_x)
    H = icon_size + 2 * padding_y

    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    icon = make_monogram(icon_size)
    icon_y = (H - icon_size) // 2
    img.paste(icon, (padding_x, icon_y), icon)

    text_x = padding_x + icon_size + gap
    # Cores otimizadas para fundo escuro: Cyber BRANCO, Informática VERDE
    color_main = WHITE
    color_brand = GREEN
    color_tag = (138, 164, 196)  # light gray para tagline

    text_block_y = (H - text_height) // 2
    cyber_y = text_block_y
    tagline_y = cyber_y + 105
    line_y = tagline_y + 35

    draw.text((text_x, cyber_y), "Cyber ", font=f_cyber, fill=color_main)
    bbox_cyber = draw.textbbox((text_x, cyber_y), "Cyber ", font=f_cyber)
    cyber_w = bbox_cyber[2] - bbox_cyber[0]
    draw.text((text_x + cyber_w, cyber_y), "Informática", font=f_informatica, fill=color_brand)

    draw.text((text_x, tagline_y), "CENTRO DE REMANUFATURA INDUSTRIAL", font=f_tagline, fill=color_tag)

    line_w = 300
    for i in range(line_w):
        ratio = i / line_w
        r = int(GREEN[0] * (1 - ratio) + BLUE[0] * ratio)
        g = int(GREEN[1] * (1 - ratio) + BLUE[1] * ratio)
        b = int(GREEN[2] * (1 - ratio) + BLUE[2] * ratio)
        draw.line([(text_x + i, line_y), (text_x + i, line_y + 4)], fill=(r, g, b))

    return img

# Versão para header: cyber branco + informatica verde
logo_header = make_logo_for_dark_header()
# Renderiza em fundo NAVY para visualizar corretamente
W, H = logo_header.size
preview_img = Image.new('RGBA', (W, H), (10, 25, 41, 255))
preview_img.paste(logo_header, (0, 0), logo_header)
preview_img.save(os.path.join(OUTPUT_DIR, "logo-horizontal-header-preview.png"), "PNG", quality=95)
logo_header.save(os.path.join(OUTPUT_DIR, "logo-horizontal-header.png"), "PNG", quality=95)
print(f"logo-horizontal-header.png ({logo_header.size})")

# Versão para footer (igual ao header mas com cor mais brand)
# Cyber BRANCO + Informática AZUL
def make_logo_for_footer():
    icon_size = 200
    text_height = 180
    padding_x = 40
    padding_y = 30
    gap = 30

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

    content_w = max(icon_size + gap + text_w, icon_size + gap + tag_w)
    W = int(content_w + 2 * padding_x)
    H = icon_size + 2 * padding_y

    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    icon = make_monogram(icon_size)
    icon_y = (H - icon_size) // 2
    img.paste(icon, (padding_x, icon_y), icon)

    text_x = padding_x + icon_size + gap
    color_main = WHITE
    color_brand = BLUE
    color_tag = (102, 163, 255)  # light blue

    text_block_y = (H - text_height) // 2
    cyber_y = text_block_y
    tagline_y = cyber_y + 105
    line_y = tagline_y + 35

    draw.text((text_x, cyber_y), "Cyber ", font=f_cyber, fill=color_main)
    bbox_cyber = draw.textbbox((text_x, cyber_y), "Cyber ", font=f_cyber)
    cyber_w = bbox_cyber[2] - bbox_cyber[0]
    draw.text((text_x + cyber_w, cyber_y), "Informática", font=f_informatica, fill=color_brand)

    draw.text((text_x, tagline_y), "CENTRO DE REMANUFATURA INDUSTRIAL", font=f_tagline, fill=color_tag)

    line_w = 300
    for i in range(line_w):
        ratio = i / line_w
        r = int(GREEN[0] * (1 - ratio) + BLUE[0] * ratio)
        g = int(GREEN[1] * (1 - ratio) + BLUE[1] * ratio)
        b = int(GREEN[2] * (1 - ratio) + BLUE[2] * ratio)
        draw.line([(text_x + i, line_y), (text_x + i, line_y + 4)], fill=(r, g, b))

    return img

logo_footer = make_logo_for_footer()
logo_footer.save(os.path.join(OUTPUT_DIR, "logo-horizontal-footer.png"), "PNG", quality=95)
print(f"logo-horizontal-footer.png ({logo_footer.size})")

# Salvar também em assets
logo_header.save(os.path.join(OUTPUT_DIR, "assets", "logo-horizontal-header.png"), "PNG", quality=95)
logo_footer.save(os.path.join(OUTPUT_DIR, "assets", "logo-horizontal-footer.png"), "PNG", quality=95)
print("Concluído!")
