"""
Logo otimizado para header/footer em alta resolução.
Gera versão com altura maior (88px) sem perder qualidade.
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

# Logo com altura maior (88px) para HEADER
def make_logo_header_big():
    icon_size = 220
    text_height = 200
    gap = 36

    temp_img = Image.new('RGBA', (1, 1))
    temp_draw = ImageDraw.Draw(temp_img)
    f_cyber = get_font(96, bold=False)
    f_informatica = get_font(96, bold=True)
    f_tagline = get_font(28, bold=True)

    bbox1 = temp_draw.textbbox((0, 0), "Cyber ", font=f_cyber)
    bbox2 = temp_draw.textbbox((0, 0), "Informática", font=f_informatica)
    text_w = (bbox2[2] - bbox2[0]) + (bbox1[2] - bbox1[0])

    bbox_tag = temp_draw.textbbox((0, 0), "CENTRO DE REMANUFATURA INDUSTRIAL", font=f_tagline)
    tag_w = bbox_tag[2] - bbox_tag[0]

    content_w = max(icon_size + gap + text_w, icon_size + gap + tag_w)
    W = int(content_w)
    H = icon_size

    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    icon = make_monogram(icon_size)
    img.paste(icon, (0, 0), icon)

    text_x = icon_size + gap
    color_main = WHITE
    color_brand = GREEN
    color_tag = (138, 164, 196)

    cyber_y = 22
    tagline_y = cyber_y + 130
    line_y = tagline_y + 42

    draw.text((text_x, cyber_y), "Cyber ", font=f_cyber, fill=color_main)
    bbox_cyber = draw.textbbox((text_x, cyber_y), "Cyber ", font=f_cyber)
    cyber_w = bbox_cyber[2] - bbox_cyber[0]
    draw.text((text_x + cyber_w, cyber_y), "Informática", font=f_informatica, fill=color_brand)

    draw.text((text_x, tagline_y), "CENTRO DE REMANUFATURA INDUSTRIAL", font=f_tagline, fill=color_tag)

    line_w = 420
    for i in range(line_w):
        ratio = i / line_w
        r = int(GREEN[0] * (1 - ratio) + BLUE[0] * ratio)
        g = int(GREEN[1] * (1 - ratio) + BLUE[1] * ratio)
        b = int(GREEN[2] * (1 - ratio) + BLUE[2] * ratio)
        draw.line([(text_x + i, line_y), (text_x + i, line_y + 6)], fill=(r, g, b))

    return img

# Logo com altura maior (96px) para FOOTER
def make_logo_footer_big():
    icon_size = 220
    gap = 36

    temp_img = Image.new('RGBA', (1, 1))
    temp_draw = ImageDraw.Draw(temp_img)
    f_cyber = get_font(96, bold=False)
    f_informatica = get_font(96, bold=True)
    f_tagline = get_font(28, bold=True)

    bbox1 = temp_draw.textbbox((0, 0), "Cyber ", font=f_cyber)
    bbox2 = temp_draw.textbbox((0, 0), "Informática", font=f_informatica)
    text_w = (bbox2[2] - bbox2[0]) + (bbox1[2] - bbox1[0])

    bbox_tag = temp_draw.textbbox((0, 0), "CENTRO DE REMANUFATURA INDUSTRIAL", font=f_tagline)
    tag_w = bbox_tag[2] - bbox_tag[0]

    content_w = max(icon_size + gap + text_w, icon_size + gap + tag_w)
    W = int(content_w)
    H = icon_size

    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    icon = make_monogram(icon_size)
    img.paste(icon, (0, 0), icon)

    text_x = icon_size + gap
    color_main = WHITE
    color_brand = BLUE
    color_tag = (102, 163, 255)

    cyber_y = 22
    tagline_y = cyber_y + 130
    line_y = tagline_y + 42

    draw.text((text_x, cyber_y), "Cyber ", font=f_cyber, fill=color_main)
    bbox_cyber = draw.textbbox((text_x, cyber_y), "Cyber ", font=f_cyber)
    cyber_w = bbox_cyber[2] - bbox_cyber[0]
    draw.text((text_x + cyber_w, cyber_y), "Informática", font=f_informatica, fill=color_brand)

    draw.text((text_x, tagline_y), "CENTRO DE REMANUFATURA INDUSTRIAL", font=f_tagline, fill=color_tag)

    line_w = 420
    for i in range(line_w):
        ratio = i / line_w
        r = int(GREEN[0] * (1 - ratio) + BLUE[0] * ratio)
        g = int(GREEN[1] * (1 - ratio) + BLUE[1] * ratio)
        b = int(GREEN[2] * (1 - ratio) + BLUE[2] * ratio)
        draw.line([(text_x + i, line_y), (text_x + i, line_y + 6)], fill=(r, g, b))

    return img

# Versão HEADER
logo_header = make_logo_header_big()
logo_header.save(os.path.join(OUTPUT_DIR, "logo-horizontal-header.png"), "PNG", quality=95)
print(f"logo-horizontal-header.png ({logo_header.size})")

# Versão FOOTER
logo_footer = make_logo_footer_big()
logo_footer.save(os.path.join(OUTPUT_DIR, "logo-horizontal-footer.png"), "PNG", quality=95)
print(f"logo-horizontal-footer.png ({logo_footer.size})")

# Previews em fundo escuro
W, H = logo_header.size
preview = Image.new('RGBA', (W, H), (10, 25, 41, 255))
preview.paste(logo_header, (0, 0), logo_header)
preview.save(os.path.join(OUTPUT_DIR, "logo-horizontal-header-preview.png"))
W, H = logo_footer.size
preview = Image.new('RGBA', (W, H), (10, 25, 41, 255))
preview.paste(logo_footer, (0, 0), logo_footer)
preview.save(os.path.join(OUTPUT_DIR, "logo-horizontal-footer-preview.png"))

# Salvar também em assets
logo_header.save(os.path.join(OUTPUT_DIR, "assets", "logo-horizontal-header.png"), "PNG", quality=95)
logo_footer.save(os.path.join(OUTPUT_DIR, "assets", "logo-horizontal-footer.png"), "PNG", quality=95)

print("\nConcluído!")
