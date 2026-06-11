"""
Carrossel Institucional Cyber Informática — Instagram
5 cards quadrado 1080x1080 com copywriting industrial B2B

Cards:
1. Capa — Título forte + subheadline
2. Problema — Dor do lojista (telas paralelas de baixa qualidade)
3. Solução — Laminação OCA terceirizada
4. Comparativo — Tabela de custos (R$ 400 vs R$ 120)
5. CTA — Credenciamento via formulário
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Paleta
NAVY = (10, 25, 41)
NAVY_MID = (17, 34, 64)
BLUE = (0, 102, 255)
BLUE_DARK = (0, 82, 204)
GREEN = (0, 255, 136)
GREEN_DARK = (0, 204, 106)
WHITE = (255, 255, 255)
GRAY = (74, 85, 104)
LIGHT_GRAY = (138, 164, 196)
ICE = (245, 248, 255)
ICE_BORDER = (214, 224, 240)
RED = (197, 48, 48)
RED_LIGHT = (255, 107, 107)
DARK_BG = (15, 30, 50)

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

def draw_cyber_bg_dark(img, draw, accent=True):
    W, H = img.size
    # Gradiente
    for i in range(H):
        ratio = i / H
        r = int(NAVY[0] + (NAVY_MID[0] - NAVY[0]) * ratio * 0.5)
        g = int(NAVY[1] + (NAVY_MID[1] - NAVY[1]) * ratio * 0.5)
        b = int(NAVY[2] + (NAVY_MID[2] - NAVY[2]) * ratio * 0.5)
        draw.line([(0, i), (W, i)], fill=(r, g, b))

    if accent:
        # Linhas decorativas
        for i in range(6):
            y = 50 + i * 150
            draw.line([(0, y), (200, y)], fill=(0, 255, 136, 40), width=2)
            draw.ellipse([200-3, y-3, 200+3, y+3], fill=(0, 255, 136, 100))
        for i in range(6):
            x = W - 50 - i * 130
            draw.line([(x, 0), (x, 200)], fill=(0, 255, 136, 40), width=2)

def draw_cyber_bg_light(img, draw):
    W, H = img.size
    # Fundo claro
    for i in range(H):
        ratio = i / H
        r = int(ICE[0] + (255 - ICE[0]) * ratio * 0.2)
        g = int(ICE[1] + (255 - ICE[1]) * ratio * 0.2)
        b = int(ICE[2] + (255 - ICE[2]) * ratio * 0.2)
        draw.line([(0, i), (W, i)], fill=(r, g, b))

def draw_decorative_line(draw, x, y, w, h=4):
    for i in range(w):
        ratio = i / w
        r = int(GREEN[0] * (1 - ratio) + BLUE[0] * ratio)
        g = int(GREEN[1] * (1 - ratio) + BLUE[1] * ratio)
        b = int(GREEN[2] * (1 - ratio) + BLUE[2] * ratio)
        draw.line([(x + i, y), (x + i, y + h)], fill=(r, g, b))

# ============================================================
# CARD 1 — CAPA
# ============================================================
def make_card_1():
    W, H = 1080, 1080
    img = Image.new('RGBA', (W, H), NAVY)
    draw = ImageDraw.Draw(img)
    draw_cyber_bg_dark(img, draw, accent=True)

    # Logo no topo
    icon = make_monogram(120)
    img.paste(icon, ((W - 120) // 2, 100), icon)

    # Tagline
    f_label = get_font(22, bold=True)
    draw.text((W // 2, 260), "CYBER INFORMÁTICA", font=f_label, fill=(102, 163, 255), anchor="mm")

    # Título principal
    f_titulo = get_font(78, bold=True)
    titulo_lines = ["Aumente a margem", "da sua assistência"]
    y = 380
    for line in titulo_lines:
        draw.text((W // 2, y), line, font=f_titulo, fill=WHITE, anchor="mm")
        y += 90

    # Destaque verde
    f_destaque = get_font(60, bold=True)
    draw.text((W // 2, y + 30), "SEM INVESTIR", font=f_destaque, fill=GREEN, anchor="mm")
    draw.text((W // 2, y + 100), "EM MAQUINÁRIO", font=f_destaque, fill=GREEN, anchor="mm")

    # Linha decorativa
    line_y = y + 180
    draw_decorative_line(draw, (W - 300) // 2, line_y, 300, 5)

    # Subtítulo
    f_sub = get_font(26, bold=False)
    draw.text((W // 2, line_y + 50), "Terceirize a laminação OCA", font=f_sub, fill=WHITE, anchor="mm")
    draw.text((W // 2, line_y + 85), "com nosso laboratório industrial", font=f_sub, fill=WHITE, anchor="mm")

    # Badge B2B no rodapé
    badge_y = 920
    badge_w = 600
    badge_h = 60
    badge_x = (W - badge_w) // 2
    draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + badge_w, badge_y + badge_h],
        radius=30, fill=(0, 102, 255, 60), outline=GREEN, width=2
    )
    f_badge = get_font(22, bold=True)
    draw.text((W // 2, badge_y + 30), "EXCLUSIVO B2B · CNPJ", font=f_badge, fill=GREEN, anchor="mm")

    # Indicador de carrossel
    f_dots = get_font(28, bold=True)
    draw.text((W // 2, 1010), "● ● ● ● ●", font=f_dots, fill=(102, 163, 255), anchor="mm")

    return img

# ============================================================
# CARD 2 — PROBLEMA
# ============================================================
def make_card_2():
    W, H = 1080, 1080
    img = Image.new('RGBA', (W, H), WHITE)
    draw = ImageDraw.Draw(img)
    draw_cyber_bg_light(img, draw)

    # Header
    icon = make_monogram(70)
    img.paste(icon, (60, 60), icon)
    f_brand = get_font(26, bold=False)
    f_brand_bold = get_font(26, bold=True)
    draw.text((150, 95), "Cyber ", font=f_brand, fill=NAVY, anchor="lm")
    bbox = draw.textbbox((0, 0), "Cyber ", font=f_brand)
    cyber_w = bbox[2] - bbox[0]
    draw.text((150 + cyber_w, 95), "Informática", font=f_brand_bold, fill=BLUE, anchor="lm")

    # Indicador de progresso
    f_dots = get_font(22, bold=True)
    draw.text((W - 60, 95), "● ○ ○ ○ ○", font=f_dots, fill=BLUE, anchor="rm")

    # Badge de seção
    badge_x, badge_y = 60, 200
    f_section = get_font(20, bold=True)
    draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + 200, badge_y + 40],
        radius=20, fill=RED
    )
    draw.text((badge_x + 100, badge_y + 20), "O PROBLEMA", font=f_section, fill=WHITE, anchor="mm")

    # Título
    f_titulo = get_font(58, bold=True)
    draw.text((60, 290), "Telas paralelas", font=f_titulo, fill=NAVY)
    draw.text((60, 360), "estão destruindo", font=f_titulo, fill=NAVY)
    draw.text((60, 430), "sua margem", font=f_titulo, fill=RED)

    # Subtítulo
    f_sub = get_font(24, bold=False)
    draw.text((60, 510), "Comprar telas importadas de", font=f_sub, fill=GRAY)
    draw.text((60, 545), "qualidade inferior gera retornos", font=f_sub, fill=GRAY)
    draw.text((60, 580), "constantes de garantia.", font=f_sub, fill=GRAY)

    # Card de impacto
    card_x, card_y = 60, 660
    card_w, card_h = W - 120, 280
    draw.rounded_rectangle(
        [card_x, card_y, card_x + card_w, card_y + card_h],
        radius=20, fill=(255, 245, 245), outline=RED, width=2
    )

    # Conteúdo do card
    f_impacto_label = get_font(20, bold=True)
    draw.text((card_x + 40, card_y + 40), "IMPACTO FINANCEIRO", font=f_impacto_label, fill=RED)

    f_impacto_num = get_font(72, bold=True)
    draw.text((card_x + 40, card_y + 90), "R$ 400", font=f_impacto_num, fill=RED)
    f_impacto_desc = get_font(22, bold=False)
    draw.text((card_x + 250, card_y + 120), "Custo médio de tela", font=f_impacto_desc, fill=NAVY)
    draw.text((card_x + 250, card_y + 150), "paralela importada", font=f_impacto_desc, fill=NAVY)

    f_margem_label = get_font(18, bold=True)
    f_margem_value = get_font(28, bold=True)
    draw.text((card_x + 40, card_y + 200), "MARGEM DE LUCRO", font=f_margem_label, fill=GRAY)
    draw.text((card_x + 40, card_y + 225), "20% a 30%", font=f_margem_value, fill=RED)

    draw.text((W // 2, 1000), "Arraste para ver a solução →", font=get_font(22, bold=True), fill=BLUE, anchor="mm")

    return img

# ============================================================
# CARD 3 — SOLUÇÃO
# ============================================================
def make_card_3():
    W, H = 1080, 1080
    img = Image.new('RGBA', (W, H), WHITE)
    draw = ImageDraw.Draw(img)
    draw_cyber_bg_light(img, draw)

    # Header
    icon = make_monogram(70)
    img.paste(icon, (60, 60), icon)
    f_brand = get_font(26, bold=False)
    f_brand_bold = get_font(26, bold=True)
    draw.text((150, 95), "Cyber ", font=f_brand, fill=NAVY, anchor="lm")
    bbox = draw.textbbox((0, 0), "Cyber ", font=f_brand)
    cyber_w = bbox[2] - bbox[0]
    draw.text((150 + cyber_w, 95), "Informática", font=f_brand_bold, fill=BLUE, anchor="lm")

    f_dots = get_font(22, bold=True)
    draw.text((W - 60, 95), "○ ● ○ ○ ○", font=f_dots, fill=BLUE, anchor="rm")

    # Badge de seção
    badge_x, badge_y = 60, 200
    f_section = get_font(20, bold=True)
    draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + 200, badge_y + 40],
        radius=20, fill=GREEN
    )
    draw.text((badge_x + 100, badge_y + 20), "A SOLUÇÃO", font=f_section, fill=NAVY, anchor="mm")

    # Título
    f_titulo = get_font(58, bold=True)
    draw.text((60, 290), "Laminação OCA", font=f_titulo, fill=NAVY)
    draw.text((60, 360), "terceirizada com", font=f_titulo, fill=NAVY)
    draw.text((60, 430), "qualidade industrial", font=f_titulo, fill=GREEN)

    # Subtítulo
    f_sub = get_font(24, bold=False)
    draw.text((60, 510), "Processamento de lotes em", font=f_sub, fill=GRAY)
    draw.text((60, 545), "laboratório com atmosfera", font=f_sub, fill=GRAY)
    draw.text((60, 580), "controlada e autoclave.", font=f_sub, fill=GRAY)

    # Card de processo
    card_x, card_y = 60, 660
    card_w, card_h = W - 120, 280
    draw.rounded_rectangle(
        [card_x, card_y, card_x + card_w, card_y + card_h],
        radius=20, fill=(240, 255, 248), outline=GREEN, width=2
    )

    f_proc_label = get_font(20, bold=True)
    draw.text((card_x + 40, card_y + 40), "TECNOLOGIA APLICADA", font=f_proc_label, fill=GREEN_DARK)

    # Lista de tecnologia
    items = [
        ("✓", "Laminação OCA sob vácuo"),
        ("✓", "Atmosfera controlada classe 1000"),
        ("✓", "Autoclave industrial"),
        ("✓", "Embalagem antichoque"),
    ]

    f_item_icon = get_font(28, bold=True)
    f_item_text = get_font(24, bold=False)
    item_y = card_y + 90
    for icon_char, text in items:
        draw.text((card_x + 40, item_y), icon_char, font=f_item_icon, fill=GREEN_DARK)
        draw.text((card_x + 80, item_y + 3), text, font=f_item_text, fill=NAVY)
        item_y += 45

    draw.text((W // 2, 1000), "Arraste para ver a comparação →", font=get_font(22, bold=True), fill=BLUE, anchor="mm")

    return img

# ============================================================
# CARD 4 — COMPARATIVO
# ============================================================
def make_card_4():
    W, H = 1080, 1080
    img = Image.new('RGBA', (W, H), WHITE)
    draw = ImageDraw.Draw(img)
    draw_cyber_bg_light(img, draw)

    # Header
    icon = make_monogram(70)
    img.paste(icon, (60, 60), icon)
    f_brand = get_font(26, bold=False)
    f_brand_bold = get_font(26, bold=True)
    draw.text((150, 95), "Cyber ", font=f_brand, fill=NAVY, anchor="lm")
    bbox = draw.textbbox((0, 0), "Cyber ", font=f_brand)
    cyber_w = bbox[2] - bbox[0]
    draw.text((150 + cyber_w, 95), "Informática", font=f_brand_bold, fill=BLUE, anchor="lm")

    f_dots = get_font(22, bold=True)
    draw.text((W - 60, 95), "○ ○ ● ○ ○", font=f_dots, fill=BLUE, anchor="rm")

    # Título
    f_titulo = get_font(50, bold=True)
    draw.text((W // 2, 200), "COMPARATIVO FINANCEIRO", font=f_titulo, fill=NAVY, anchor="mm")
    f_sub = get_font(22, bold=False)
    draw.text((W // 2, 260), "Laminação terceirizada vs. Tela paralela", font=f_sub, fill=GRAY, anchor="mm")

    # Tabela comparativa
    table_x, table_y = 60, 340
    col1_w = 360
    col2_w = (W - 120 - col1_w) // 2
    row_h = 100

    # Header
    draw.rounded_rectangle(
        [table_x, table_y, table_x + col1_w + col2_w * 2, table_y + row_h],
        radius=12, fill=NAVY
    )
    f_th = get_font(22, bold=True)
    draw.text((table_x + 20, table_y + row_h // 2), "INDICADOR", font=f_th, fill=WHITE, anchor="lm")
    draw.text((table_x + col1_w + col2_w // 2, table_y + row_h // 2), "OPÇÃO A", font=f_th, fill=LIGHT_GRAY, anchor="mm")
    draw.text((table_x + col1_w + col2_w + col2_w // 2, table_y + row_h // 2), "OPÇÃO B", font=f_th, fill=GREEN, anchor="mm")

    # Sub-cabeçalhos
    sub_y = table_y + row_h
    draw.text((table_x + col1_w + col2_w // 2, sub_y + 25), "Tela Paralela", font=get_font(16, bold=False), fill=GRAY, anchor="mm")
    draw.text((table_x + col1_w + col2_w + col2_w // 2, sub_y + 25), "Laminação Cyber", font=get_font(16, bold=False), fill=GRAY, anchor="mm")

    # Linhas da tabela
    rows = [
        ("Custo de Reposição", "R$ 400,00", "R$ 120,00", RED, GREEN_DARK),
        ("Margem de Lucro", "20% a 30%", "60% a 70%", RED, GREEN_DARK),
        ("Risco de Garantia", "Frequente", "Praticamente Nulo", RED, GREEN_DARK),
        ("Display do Cliente", "Substituído", "Preservado", RED, GREEN_DARK),
    ]

    f_label = get_font(20, bold=True)
    f_value = get_font(32, bold=True)
    f_value_small = get_font(20, bold=False)

    row_y = table_y + row_h + 60
    for i, (label, val_a, val_b, color_a, color_b) in enumerate(rows):
        # Alterna cor de fundo
        if i % 2 == 0:
            draw.rectangle([table_x, row_y, table_x + col1_w + col2_w * 2, row_y + row_h], fill=(245, 248, 255))

        draw.text((table_x + 20, row_y + row_h // 2), label, font=f_label, fill=NAVY, anchor="lm")
        draw.text((table_x + col1_w + col2_w // 2, row_y + row_h // 2), val_a, font=f_value_small, fill=color_a, anchor="mm")
        draw.text((table_x + col1_w + col2_w + col2_w // 2, row_y + row_h // 2), val_b, font=f_value_small, fill=color_b, anchor="mm")

        row_y += row_h

    # Badge de destaque
    badge_y = 920
    badge_w = 800
    badge_x = (W - badge_w) // 2
    draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + badge_w, badge_y + 60],
        radius=30, fill=GREEN
    )
    f_badge = get_font(22, bold=True)
    draw.text((W // 2, badge_y + 30), "Economia de até 70% no custo de reposição", font=f_badge, fill=NAVY, anchor="mm")

    draw.text((W // 2, 1020), "Arraste para saber como credenciar →", font=get_font(22, bold=True), fill=BLUE, anchor="mm")

    return img

# ============================================================
# CARD 5 — CTA
# ============================================================
def make_card_5():
    W, H = 1080, 1080
    img = Image.new('RGBA', (W, H), NAVY)
    draw = ImageDraw.Draw(img)
    draw_cyber_bg_dark(img, draw, accent=True)

    # Header
    icon = make_monogram(70)
    img.paste(icon, (60, 60), icon)
    f_brand = get_font(26, bold=False)
    f_brand_bold = get_font(26, bold=True)
    draw.text((150, 95), "Cyber ", font=f_brand, fill=WHITE, anchor="lm")
    bbox = draw.textbbox((0, 0), "Cyber ", font=f_brand)
    cyber_w = bbox[2] - bbox[0]
    draw.text((150 + cyber_w, 95), "Informática", font=f_brand_bold, fill=GREEN, anchor="lm")

    f_dots = get_font(22, bold=True)
    draw.text((W - 60, 95), "○ ○ ○ ○ ●", font=f_dots, fill=GREEN, anchor="rm")

    # Badge B2B
    badge_x, badge_y = (W - 400) // 2, 220
    draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + 400, badge_y + 50],
        radius=25, fill=(0, 255, 136, 40), outline=GREEN, width=2
    )
    f_badge = get_font(22, bold=True)
    draw.text((W // 2, badge_y + 25), "PORTAL DE PARCERIA COMERCIAL", font=f_badge, fill=GREEN, anchor="mm")

    # Título principal
    f_titulo = get_font(78, bold=True)
    draw.text((W // 2, 340), "Credencie-se", font=f_titulo, fill=WHITE, anchor="mm")
    draw.text((W // 2, 430), "como parceiro B2B", font=f_titulo, fill=WHITE, anchor="mm")

    # Subtítulo
    f_sub = get_font(28, bold=False)
    draw.text((W // 2, 540), "Solicite o Catálogo Técnico", font=f_sub, fill=LIGHT_GRAY, anchor="mm")
    draw.text((W // 2, 580), "e a Tabela Atacadista", font=f_sub, fill=LIGHT_GRAY, anchor="mm")

    # Card de etapas
    card_x, card_y = 60, 660
    card_w, card_h = W - 120, 260
    draw.rounded_rectangle(
        [card_x, card_y, card_x + card_w, card_y + card_h],
        radius=20, fill=(255, 255, 255, 10), outline=(0, 255, 136, 100), width=2
    )

    f_step_label = get_font(18, bold=True)
    f_step_text = get_font(22, bold=False)
    f_step_num = get_font(36, bold=True)

    steps = [
        ("1", "Preencha o formulário com dados PJ"),
        ("2", "Análise do CNPJ em até 24h úteis"),
        ("3", "Receba a tabela de atacado"),
    ]
    step_y = card_y + 40
    for num, text in steps:
        # Número
        draw.ellipse([card_x + 30, step_y, card_x + 90, step_y + 60], fill=GREEN)
        draw.text((card_x + 60, step_y + 30), num, font=f_step_num, fill=NAVY, anchor="mm")
        # Texto
        draw.text((card_x + 110, step_y + 30), text, font=f_step_text, fill=WHITE, anchor="lm")
        step_y += 75

    # Botão CTA
    btn_w, btn_h = 600, 80
    btn_x = (W - btn_w) // 2
    btn_y = 960
    draw.rounded_rectangle(
        [btn_x, btn_y, btn_x + btn_w, btn_y + btn_h],
        radius=40, fill=GREEN
    )
    f_btn = get_font(28, bold=True)
    draw.text((W // 2, btn_y + 40), "QUERO ME CREDENCIAR", font=f_btn, fill=NAVY, anchor="mm")

    return img

# Execução
print("Gerando carrossel institucional Cyber Informática...")
os.makedirs(OUTPUT_DIR, exist_ok=True)

cards = [
    ("carrossel-card-1-capa", make_card_1),
    ("carrossel-card-2-problema", make_card_2),
    ("carrossel-card-3-solucao", make_card_3),
    ("carrossel-card-4-comparativo", make_card_4),
    ("carrossel-card-5-cta", make_card_5),
]

for name, func in cards:
    card = func()
    card.save(os.path.join(OUTPUT_DIR, f"{name}.png"), "PNG", quality=95)
    print(f"  - {name}.png ({card.size})")

# Composição completa (todos os cards)
print("\nGerando composição completa do carrossel...")
comp_w = 1080 * 5 + 80 * 4
comp_h = 1080 + 60
comp = Image.new('RGBA', (comp_w, comp_h), (245, 248, 255))
for i, (name, func) in enumerate(cards):
    card = func()
    x = i * (1080 + 80) + 0
    comp.paste(card, (x, 30), card)
comp.save(os.path.join(OUTPUT_DIR, "carrossel-completo.png"), "PNG", quality=90)
print(f"  - carrossel-completo.png ({comp.size})")

print("\nConcluído!")
