"""
Geração de cartão de visita Cyber Informática — Versão 3 (com correção de fonte)
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Paleta
NAVY = (10, 25, 41)
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

def draw_text_with_i_fix(draw, x, y, text, font, fill):
    """
    Workaround para o bug do Pillow com 'I' maiúsculo em Segoe UI Bold.
    Detecta a primeira letra 'I' (ou 'Í') e desenha como retângulo.
    """
    if not text or not text.startswith(('I', 'Í')):
        draw.text((x, y), text, font=font, fill=fill)
        return

    # Descobre tamanho do glifo 'I' na fonte
    test_text = "I"
    bbox = draw.textbbox((0, 0), test_text, font=font)
    i_width = bbox[2] - bbox[0]
    i_height = bbox[3] - bbox[1]

    # Ajuste de posição (baseline do Pillow)
    # Vou usar o método getbbox
    try:
        # getbbox mais preciso
        bbox_i = font.getbbox("I")
        i_width = bbox_i[2] - bbox_i[0]
        i_height = bbox_i[3] - bbox_i[1]
    except:
        pass

    # Desenha retângulo no lugar do I
    # A posição do 'I' deve estar alinhada com a baseline do resto
    # Uso textbbox do texto completo para alinhar
    bbox_full = draw.textbbox((x, y), text, font=font)
    text_y = bbox_full[1]

    # Largura proporcional: o I ocupa ~5-7% do tamanho da fonte
    # Para fonte 40, I tem aprox 8-10px de largura visual
    # A altura vai do topo até ~baseline
    font_size = font.size if hasattr(font, 'size') else 40
    i_visual_width = max(8, int(font_size * 0.20))  # 20% do tamanho, mínimo 8px
    i_visual_height = int(font_size * 0.78)  # ~78% da altura (até baseline)

    # Ajusta a posição X do I para a primeira letra
    i_x = x
    i_y = y + (bbox_full[3] - bbox_full[1] - i_visual_height) // 2  # centraliza vertical

    draw.rectangle([i_x, i_y, i_x + i_visual_width, i_y + i_visual_height], fill=fill)

    # Renderiza o resto do texto a partir do I
    # Calcula onde o I termina + um pequeno espaço
    rest_text = text[1:]
    if rest_text:
        # O I tem largura natural dele + espaço
        rest_x = i_x + i_visual_width + int(font_size * 0.05)
        draw.text((rest_x, y), rest_text, font=font, fill=fill)

# Tamanho do cartão: 90x54mm @ 300 DPI = 1063x638 px
W, H = 1063, 638

# ============= FRENTE =============
print("Gerando frente do cartão...")
frente = Image.new('RGBA', (W, H), WHITE)
draw = ImageDraw.Draw(frente)

# Ícone grande no canto superior esquerdo
icon = make_monogram(140)
frente.paste(icon, (60, 60), icon)

# Texto ao lado do ícone
text_x = 220
f_cyber = get_font(50, bold=False)
f_informatica = get_font(50, bold=True)
f_tagline = get_font(14, bold=True)

# Cyber
draw_text_with_i_fix(draw, text_x, 75, "Cyber ", f_cyber, NAVY)
bbox = draw.textbbox((text_x, 75), "Cyber ", font=f_cyber)
cyber_w = bbox[2] - bbox[0]
# Informática
draw.text((text_x + cyber_w, 75), "Informática", font=f_informatica, fill=BLUE)

draw.text((text_x, 138), "CENTRO DE REMANUFATURA INDUSTRIAL", font=f_tagline, fill=GRAY)

# Linha decorativa abaixo
line_y = 168
for i in range(280):
    ratio = i / 280
    r = int(GREEN[0] * (1 - ratio) + BLUE[0] * ratio)
    g = int(GREEN[1] * (1 - ratio) + BLUE[1] * ratio)
    b = int(GREEN[2] * (1 - ratio) + BLUE[2] * ratio)
    draw.line([(text_x + i, line_y), (text_x + i, line_y + 3)], fill=(r, g, b))

# Nome do titular
f_nome = get_font(40, bold=True)
f_cargo = get_font(22, bold=False)

# Iago Lopes - usando o fix
draw_text_with_i_fix(draw, 60, 320, "Iago Lopes", f_nome, NAVY)
draw.text((60, 365), "Desenvolvedor · Cyber Informática", font=f_cargo, fill=GRAY)

# Especialidade
f_esp = get_font(18, bold=True)
draw.text((60, 410), "Laminação OCA · Remanufatura de Displays", font=f_esp, fill=BLUE)

# Rodapé institucional
f_footer = get_font(14, bold=True)
draw.text((60, 540), "EXCLUSIVO B2B · FATURAMENTO VIA CNPJ", font=f_footer, fill=BLUE)
draw.text((60, 565), "Atendimento para assistências técnicas e lojistas", font=get_font(13, bold=False), fill=GRAY)

# Salva
frente.save(os.path.join(OUTPUT_DIR, "cartao-visita-frente.png"), "PNG", quality=95)
print(f"  - cartao-visita-frente.png ({frente.size})")

# Composição
comp_w = W * 2 + 60
comp_h = H + 60
comp = Image.new('RGBA', (comp_w, comp_h), (245, 248, 255))
verso = Image.open(os.path.join(OUTPUT_DIR, "cartao-visita-verso.png"))
comp.paste(frente, (30, 30), frente)
comp.paste(verso, (W + 60, 30), verso)
comp.save(os.path.join(OUTPUT_DIR, "cartao-visita-frente-e-verso.png"), "PNG", quality=95)
print(f"  - cartao-visita-frente-e-verso.png ({comp.size})")

# Gera PDF
frente.convert('RGB').save(os.path.join(OUTPUT_DIR, "cartao-visita-frente.pdf"), "PDF", resolution=300)
verso.convert('RGB').save(os.path.join(OUTPUT_DIR, "cartao-visita-verso.pdf"), "PDF", resolution=300)
print("PDFs atualizados")

print("\nConcluído!")
