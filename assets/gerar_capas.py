"""
Geração de capas para redes sociais — Cyber Informática
- Facebook: 820x312
- LinkedIn: 1584x396
- YouTube: 2560x1440
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

def draw_cyber_background(img, draw):
    """Desenha o fundo cyber com circuito decorativo."""
    W, H = img.size
    # Gradiente sutil
    for i in range(H):
        ratio = i / H
        r = int(NAVY[0] + (NAVY_MID[0] - NAVY[0]) * ratio * 0.5)
        g = int(NAVY[1] + (NAVY_MID[1] - NAVY[1]) * ratio * 0.5)
        b = int(NAVY[2] + (NAVY_MID[2] - NAVY[2]) * ratio * 0.5)
        draw.line([(0, i), (W, i)], fill=(r, g, b))

    # Padrão de circuito (densidade baseada no tamanho)
    density = max(2, W // 300)
    circuit_color = (0, 255, 136, 50)
    for i in range(density * 3):
        y = int((i + 1) * H / (density * 3 + 1))
        line_end = int(W * 0.15)
        draw.line([(0, y), (line_end, y)], fill=circuit_color, width=2)
        draw.ellipse([line_end-3, y-3, line_end+3, y+3], fill=(0, 255, 136, 120))

    for i in range(density * 3):
        x = W - int((i + 1) * W * 0.12 / density)
        line_end = int(H * 0.3)
        draw.line([(x, 0), (x, line_end)], fill=circuit_color, width=2)
        draw.ellipse([x-3, line_end-3, x+3, line_end+3], fill=(0, 255, 136, 120))

def make_facebook_cover():
    """Facebook Page Cover: 820x312"""
    W, H = 820, 312
    img = Image.new('RGBA', (W, H), NAVY)
    draw = ImageDraw.Draw(img)
    draw_cyber_background(img, draw)

    # Ícone
    icon = make_monogram(180)
    img.paste(icon, (60, (H - 180) // 2), icon)

    # Textos
    text_x = 270
    f_cyber = get_font(58, bold=False)
    f_informatica = get_font(58, bold=True)
    f_tagline = get_font(16, bold=True)
    f_sub = get_font(20, bold=False)

    draw.text((text_x, 75), "Cyber ", font=f_cyber, fill=WHITE)
    bbox_cyber = draw.textbbox((text_x, 75), "Cyber ", font=f_cyber)
    cyber_w = bbox_cyber[2] - bbox_cyber[0]
    draw.text((text_x + cyber_w, 75), "Informática", font=f_informatica, fill=GREEN)

    draw.text((text_x, 145), "CENTRO DE REMANUFATURA INDUSTRIAL", font=f_tagline, fill=(102, 163, 255))

    # Linha decorativa
    line_y = 180
    for i in range(220):
        ratio = i / 220
        r = int(GREEN[0] * (1 - ratio) + BLUE[0] * ratio)
        g = int(GREEN[1] * (1 - ratio) + BLUE[1] * ratio)
        b = int(GREEN[2] * (1 - ratio) + BLUE[2] * ratio)
        draw.line([(text_x + i, line_y), (text_x + i, line_y + 3)], fill=(r, g, b))

    draw.text((text_x, 200), "Laminação OCA · Remanufatura de Displays", font=f_sub, fill=(138, 164, 196))

    return img

def make_linkedin_cover():
    """LinkedIn Company Cover: 1584x396"""
    W, H = 1584, 396
    img = Image.new('RGBA', (W, H), NAVY)
    draw = ImageDraw.Draw(img)
    draw_cyber_background(img, draw)

    # Ícone
    icon = make_monogram(220)
    img.paste(icon, (140, (H - 220) // 2), icon)

    # Textos
    text_x = 410
    f_cyber = get_font(90, bold=False)
    f_informatica = get_font(90, bold=True)
    f_tagline = get_font(26, bold=True)
    f_sub = get_font(34, bold=False)

    draw.text((text_x, 90), "Cyber ", font=f_cyber, fill=WHITE)
    bbox_cyber = draw.textbbox((text_x, 90), "Cyber ", font=f_cyber)
    cyber_w = bbox_cyber[2] - bbox_cyber[0]
    draw.text((text_x + cyber_w, 90), "Informática", font=f_informatica, fill=GREEN)

    draw.text((text_x, 200), "CENTRO DE REMANUFATURA INDUSTRIAL", font=f_tagline, fill=(102, 163, 255))

    # Linha decorativa
    line_y = 250
    for i in range(360):
        ratio = i / 360
        r = int(GREEN[0] * (1 - ratio) + BLUE[0] * ratio)
        g = int(GREEN[1] * (1 - ratio) + BLUE[1] * ratio)
        b = int(GREEN[2] * (1 - ratio) + BLUE[2] * ratio)
        draw.line([(text_x + i, line_y), (text_x + i, line_y + 5)], fill=(r, g, b))

    draw.text((text_x, 280), "Laminação OCA · Remanufatura de Displays · Exclusivo B2B", font=f_sub, fill=(138, 164, 196))

    return img

def make_youtube_cover():
    """YouTube Channel Art: 2560x1440 (com safe area central 1546x423)"""
    W, H = 2560, 1440
    img = Image.new('RGBA', (W, H), NAVY)
    draw = ImageDraw.Draw(img)
    draw_cyber_background(img, draw)

    # Posiciona conteúdo dentro da safe area (centro)
    # Safe area centralizada: ~ 1546x423
    # Vamos centralizar horizontalmente e posicionar verticalmente acima do meio (onde fica o avatar circle)

    icon_size = 320
    icon_x = (W - icon_size) // 2 - 250
    icon_y = (H - icon_size) // 2 - 100
    icon = make_monogram(icon_size)
    img.paste(icon, (icon_x, icon_y), icon)

    # Textos
    text_x = icon_x + icon_size + 80
    f_cyber = get_font(140, bold=False)
    f_informatica = get_font(140, bold=True)
    f_tagline = get_font(38, bold=True)
    f_sub = get_font(48, bold=False)

    # Posiciona vertical
    text_cy = H // 2 - 100
    draw.text((text_x, text_cy), "Cyber ", font=f_cyber, fill=WHITE)
    bbox_cyber = draw.textbbox((text_x, text_cy), "Cyber ", font=f_cyber)
    cyber_w = bbox_cyber[2] - bbox_cyber[0]
    draw.text((text_x + cyber_w, text_cy), "Informática", font=f_informatica, fill=GREEN)

    draw.text((text_x, text_cy + 165), "CENTRO DE REMANUFATURA INDUSTRIAL", font=f_tagline, fill=(102, 163, 255))

    # Linha decorativa
    line_y = text_cy + 230
    for i in range(500):
        ratio = i / 500
        r = int(GREEN[0] * (1 - ratio) + BLUE[0] * ratio)
        g = int(GREEN[1] * (1 - ratio) + BLUE[1] * ratio)
        b = int(GREEN[2] * (1 - ratio) + BLUE[2] * ratio)
        draw.line([(text_x + i, line_y), (text_x + i, line_y + 6)], fill=(r, g, b))

    draw.text((text_x, line_y + 40), "Laminação OCA · Remanufatura de Displays · Exclusivo B2B", font=f_sub, fill=(138, 164, 196))

    return img

# Execução
print("Gerando capas para redes sociais...")
os.makedirs(OUTPUT_DIR, exist_ok=True)

fb = make_facebook_cover()
fb.save(os.path.join(OUTPUT_DIR, "capa-facebook-820x312.png"), "PNG", quality=95)
print(f"  - capa-facebook-820x312.png ({fb.size})")

li = make_linkedin_cover()
li.save(os.path.join(OUTPUT_DIR, "capa-linkedin-1584x396.png"), "PNG", quality=95)
print(f"  - capa-linkedin-1584x396.png ({li.size})")

yt = make_youtube_cover()
yt.save(os.path.join(OUTPUT_DIR, "capa-youtube-2560x1440.png"), "PNG", quality=95)
print(f"  - capa-youtube-2560x1440.png ({yt.size})")

print("Concluído!")
