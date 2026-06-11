"""
Storyboard visual para vídeo industrial Meta Ads (Cyber Informática)
Baseado no roteiro do PDF páginas 9-10 (Criativo 01).
Formato: 1080x1920 (vertical 9:16 para Reels/Stories)

Cenas:
1. Gancho (0-5s): Display trincado sendo separado
2. Problema (5-15s): Telas paralelas com defeito
3. Solução (15-35s): Laminação OCA no laboratório
4. Resultado (35-50s): Display finalizado brilhante
5. CTA (50-60s): Formulário de credenciamento
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
RED = (197, 48, 48)
DARK_BG = (15, 30, 50)

OUTPUT_DIR = r"C:\Users\User\Documents\laminacao\assets\video"

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

def draw_text_with_i_fix(draw, x, y, text, font, fill):
    """Workaround para bug do Pillow com 'I' maiúsculo."""
    if not text or not text.startswith(('I', 'Í')):
        draw.text((x, y), text, font=font, fill=fill)
        return
    font_size = font.size if hasattr(font, 'size') else 40
    i_visual_width = max(8, int(font_size * 0.20))
    i_visual_height = int(font_size * 0.78)
    bbox_full = draw.textbbox((x, y), text, font=font)
    i_y = y + (bbox_full[3] - bbox_full[1] - i_visual_height) // 2
    draw.rectangle([x, i_y, x + i_visual_width, i_y + i_visual_height], fill=fill)
    rest_text = text[1:]
    if rest_text:
        rest_x = x + i_visual_width + int(font_size * 0.05)
        draw.text((rest_x, y), rest_text, font=font, fill=fill)

# Dimensões 9:16
W, H = 1080, 1920

# ========== CENA 1: GANCHO (0-5s) ==========
def make_scene_1():
    img = Image.new('RGBA', (W, H), (8, 12, 20))
    draw = ImageDraw.Draw(img)

    # Fundo gradiente escuro industrial
    for i in range(H):
        ratio = i / H
        r = int(8 + 10 * ratio)
        g = int(12 + 15 * ratio)
        b = int(20 + 25 * ratio)
        draw.line([(0, i), (W, i)], fill=(r, g, b))

    # Efeito de raio (linha diagonal que separa o vidro)
    draw.line([(0, 600), (W, 700)], fill=(100, 200, 255, 200), width=3)
    draw.line([(0, 605), (W, 705)], fill=(100, 200, 255, 100), width=2)
    draw.line([(0, 595), (W, 695)], fill=(100, 200, 255, 50), width=2)

    # Display trincado (representação geométrica)
    # Frame do display
    disp_x, disp_y = 200, 800
    disp_w, disp_h = 680, 400
    draw.rounded_rectangle(
        [disp_x, disp_y, disp_x + disp_w, disp_y + disp_h],
        radius=20, fill=(20, 30, 50), outline=(60, 80, 100), width=3
    )

    # Tela interna (escura)
    draw.rounded_rectangle(
        [disp_x + 20, disp_y + 20, disp_x + disp_w - 20, disp_y + disp_h - 20],
        radius=10, fill=(5, 10, 20)
    )

    # Rachaduras no vidro (linhas brancas finas)
    cracks = [
        [(300, 900), (500, 1050), (450, 1150), (550, 1200)],
        [(400, 850), (380, 950), (500, 1080), (520, 1180)],
        [(600, 870), (700, 1000), (750, 1100)],
        [(350, 1150), (450, 1180), (500, 1200)],
    ]
    for crack in cracks:
        for i in range(len(crack) - 1):
            draw.line([crack[i], crack[i + 1]], fill=(180, 200, 220, 200), width=2)

    # Reflexos no display
    draw.polygon(
        [(220, 820), (350, 820), (250, 1180), (220, 1180)],
        fill=(40, 60, 80, 100)
    )

    # Efeito de "fio de aço" cortando
    draw.line([(0, 950), (W, 980)], fill=(220, 220, 230), width=4)
    draw.line([(0, 950), (W, 980)], fill=(255, 255, 255, 200), width=2)

    # Texto principal (gancho)
    # Barra superior
    draw.rounded_rectangle([40, 200, W - 40, 280], radius=20, fill=(0, 102, 255, 50), outline=BLUE, width=2)
    f_badge = get_font(36, bold=True)
    draw.text((W // 2, 240), "CIBER INFORMÁTICA", font=f_badge, fill=BLUE, anchor="mm")

    # Headline
    f_titulo = get_font(72, bold=True)
    titulo_lines = ["Não jogue fora", "as telas originais", "trincadas"]
    y = 380
    for line in titulo_lines:
        color = GREEN if "trincadas" in line else WHITE
        draw.text((W // 2, y), line, font=f_titulo, fill=color, anchor="mm")
        y += 85

    # Subheadline
    f_sub = get_font(40, bold=False)
    draw.text((W // 2, y + 30), "dos seus clientes", font=f_sub, fill=LIGHT_GRAY, anchor="mm")

    # Timecode
    f_time = get_font(28, bold=True)
    draw.text((60, H - 80), "00:00 / 00:05", font=f_time, fill=GREEN)

    # Logo
    from functools import lru_cache
    icon_size = 90
    icon_x = W - 60 - icon_size
    icon_y = H - 60 - icon_size
    # Mini monograma
    draw.rounded_rectangle(
        [icon_x, icon_y, icon_x + icon_size, icon_y + icon_size],
        radius=20, fill=BLUE
    )
    margin = icon_size * 0.25
    t = icon_size * 0.14
    # C
    draw.rounded_rectangle([icon_x + margin, icon_y + margin, icon_x + icon_size - margin, icon_y + margin + t], radius=int(t*0.4), fill=WHITE)
    draw.rectangle([icon_x + margin, icon_y + margin, icon_x + margin + t, icon_y + icon_size - margin], fill=WHITE)
    draw.rounded_rectangle([icon_x + margin, icon_y + icon_size - margin - t, icon_x + icon_size - margin, icon_y + icon_size - margin], radius=int(t*0.4), fill=WHITE)
    # Bolinha
    dot_r = int(icon_size * 0.07)
    draw.ellipse([icon_x + int(icon_size * 0.73) - dot_r, icon_y + int(icon_size * 0.20) - dot_r,
                  icon_x + int(icon_size * 0.73) + dot_r, icon_y + int(icon_size * 0.20) + dot_r], fill=GREEN)

    return img

# ========== CENA 2: PROBLEMA (5-15s) ==========
def make_scene_2():
    img = Image.new('RGBA', (W, H), (8, 12, 20))
    draw = ImageDraw.Draw(img)

    # Fundo
    for i in range(H):
        ratio = i / H
        r = int(8 + 10 * ratio)
        g = int(12 + 15 * ratio)
        b = int(20 + 25 * ratio)
        draw.line([(0, i), (W, i)], fill=(r, g, b))

    # Pilha de telas com defeito (representação geométrica)
    pilhas = [
        # (x, y, w, h, rotacao, cor)
        (180, 1400, 700, 90, 8, (30, 40, 60)),
        (160, 1280, 740, 100, -5, (40, 50, 70)),
        (200, 1150, 680, 95, 3, (35, 45, 65)),
        (170, 1020, 720, 105, -8, (45, 55, 75)),
    ]
    for x, y, w, h, _, cor in pilhas:
        # Frame
        draw.rounded_rectangle([x, y, x + w, y + h], radius=8, fill=cor, outline=(70, 90, 120), width=2)
        # Tela interna
        draw.rounded_rectangle([x + 8, y + 8, x + w - 8, y + h - 8], radius=4, fill=(10, 15, 25))
        # X de defeito
        cx, cy = x + w // 2, y + h // 2
        draw.line([(cx - 20, cy - 20), (cx + 20, cy + 20)], fill=(150, 30, 30), width=3)
        draw.line([(cx + 20, cy - 20), (cx - 20, cy + 20)], fill=(150, 30, 30), width=3)

    # Placa de "REJEITADO"
    placa_x, placa_y = 240, 880
    draw.rounded_rectangle([placa_x, placa_y, placa_x + 600, placa_y + 80], radius=10, fill=RED, outline=WHITE, width=3)
    f_placa = get_font(40, bold=True)
    draw.text((placa_x + 300, placa_y + 40), "REJEITADO PELO CLIENTE", font=f_placa, fill=WHITE, anchor="mm")

    # Headline
    f_titulo = get_font(68, bold=True)
    draw.text((W // 2, 320), "Telas paralelas", font=f_titulo, fill=WHITE, anchor="mm")
    draw.text((W // 2, 400), "estão destruindo", font=f_titulo, fill=WHITE, anchor="mm")
    draw.text((W // 2, 480), "sua margem", font=f_titulo, fill=RED, anchor="mm")

    # Subtítulo
    f_sub = get_font(36, bold=False)
    draw.text((W // 2, 600), "Margem de 20% a 30%.", font=f_sub, fill=LIGHT_GRAY, anchor="mm")
    draw.text((W // 2, 650), "Retorno constante de garantia.", font=f_sub, fill=LIGHT_GRAY, anchor="mm")
    draw.text((W // 2, 700), "Cliente insatisfeito.", font=f_sub, fill=RED, anchor="mm")

    # Timecode
    f_time = get_font(28, bold=True)
    draw.text((60, H - 80), "00:05 / 00:15", font=f_time, fill=GREEN)

    return img

# ========== CENA 3: SOLUÇÃO (15-35s) ==========
def make_scene_3():
    img = Image.new('RGBA', (W, H), (8, 12, 20))
    draw = ImageDraw.Draw(img)

    # Fundo
    for i in range(H):
        ratio = i / H
        r = int(8 + 10 * ratio)
        g = int(12 + 15 * ratio)
        b = int(20 + 25 * ratio)
        draw.line([(0, i), (W, i)], fill=(r, g, b))

    # Máquina de laminação (representação geométrica)
    # Base
    draw.rounded_rectangle([150, 1100, 930, 1500], radius=20, fill=(40, 50, 70), outline=(80, 100, 130), width=3)

    # Painel de controle
    draw.rounded_rectangle([180, 1130, 500, 1280], radius=10, fill=(20, 30, 45))
    # Display LCD
    draw.rounded_rectangle([200, 1150, 480, 1230], radius=5, fill=(0, 80, 50))
    # Texto LCD
    f_lcd = get_font(28, bold=True)
    draw.text((340, 1190), "VACUUM: OK", font=f_lcd, fill=GREEN, anchor="mm")
    draw.text((340, 1230), "TEMP: 65°C", font=f_lcd, fill=GREEN, anchor="mm")
    draw.text((340, 1270), "PRESS: 0.5 MPa", font=f_lcd, fill=GREEN, anchor="mm")

    # Botões do painel
    for i, label in enumerate(["START", "STOP", "AUTO"]):
        bx = 200 + i * 100
        draw.rounded_rectangle([bx, 1300, bx + 80, 1360], radius=8, fill=(60, 70, 90))
        f_btn = get_font(20, bold=True)
        draw.text((bx + 40, 1330), label, font=f_btn, fill=WHITE, anchor="mm")

    # Câmara de vácuo (onde fica o display)
    draw.rounded_rectangle([520, 1130, 900, 1450], radius=15, fill=(15, 20, 30), outline=(100, 130, 160), width=3)

    # Display sendo laminado (no centro da câmara)
    disp_x, disp_y = 580, 1200
    disp_w, disp_h = 280, 220
    draw.rounded_rectangle([disp_x, disp_y, disp_x + disp_w, disp_y + disp_h], radius=10, fill=(30, 30, 50), outline=(120, 150, 180), width=2)
    # Reflexo brilhante
    draw.polygon(
        [(disp_x + 20, disp_y + 20), (disp_x + 100, disp_y + 20), (disp_x + 50, disp_y + 80), (disp_x + 20, disp_y + 80)],
        fill=(100, 200, 255, 80)
    )

    # Efeito de autoclave (círculos concêntricos)
    for r in [120, 160, 200, 240]:
        draw.ellipse(
            [710 - r, 1325 - r, 710 + r, 1325 + r],
            outline=(0, 255, 136, 50 - r // 5), width=2
        )

    # Seta indicando processo
    f_arrow = get_font(80, bold=True)
    draw.text((710, 1500), "▼", font=f_arrow, fill=GREEN, anchor="mm")

    # Headline
    f_titulo = get_font(70, bold=True)
    draw.text((W // 2, 280), "Laminação OCA", font=f_titulo, fill=GREEN, anchor="mm")
    draw.text((W // 2, 360), "terceirizada", font=f_titulo, fill=WHITE, anchor="mm")
    draw.text((W // 2, 440), "de precisão", font=f_titulo, fill=WHITE, anchor="mm")

    # Subtítulo
    f_sub = get_font(34, bold=False)
    draw.text((W // 2, 560), "Sob vácuo. Com autoclave.", font=f_sub, fill=LIGHT_GRAY, anchor="mm")
    draw.text((W // 2, 610), "Qualidade industrial.", font=f_sub, fill=GREEN, anchor="mm")

    # Cards de processo
    cards = [
        ("✓", "Sala limpa controlada"),
        ("✓", "Laminação OCA sob vácuo"),
        ("✓", "Autoclave industrial"),
    ]
    card_y = 720
    for icon, text in cards:
        cx, cy = W // 2, card_y
        # Card background
        draw.rounded_rectangle([cx - 380, cy, cx + 380, cy + 60], radius=30, fill=(0, 255, 136, 30), outline=GREEN, width=2)
        f_card = get_font(32, bold=True)
        draw.text((cx - 350, cy + 30), icon, font=f_card, fill=GREEN, anchor="lm")
        draw.text((cx - 290, cy + 30), text, font=f_card, fill=WHITE, anchor="lm")
        card_y += 80

    # Timecode
    f_time = get_font(28, bold=True)
    draw.text((60, H - 80), "00:15 / 00:35", font=f_time, fill=GREEN)

    return img

# ========== CENA 4: RESULTADO (35-50s) ==========
def make_scene_4():
    img = Image.new('RGBA', (W, H), (8, 12, 20))
    draw = ImageDraw.Draw(img)

    # Fundo
    for i in range(H):
        ratio = i / H
        r = int(8 + 10 * ratio)
        g = int(12 + 15 * ratio)
        b = int(20 + 25 * ratio)
        draw.line([(0, i), (W, i)], fill=(r, g, b))

    # Display finalizado (grande, no centro)
    disp_x, disp_y = 200, 800
    disp_w, disp_h = 680, 800
    draw.rounded_rectangle([disp_x, disp_y, disp_x + disp_w, disp_y + disp_h], radius=30, fill=(20, 30, 50), outline=(100, 150, 200), width=4)

    # Tela interna brilhante
    draw.rounded_rectangle([disp_x + 25, disp_y + 25, disp_x + disp_w - 25, disp_y + disp_h - 25], radius=15, fill=(10, 20, 40))

    # Reflexos brilhantes (efeito de tela perfeita)
    # Reflexo principal diagonal
    draw.polygon(
        [(disp_x + 50, disp_y + 50), (disp_x + 250, disp_y + 50), (disp_x + 150, disp_y + 400), (disp_x + 50, disp_y + 350)],
        fill=(100, 200, 255, 100)
    )
    # Reflexo secundário
    draw.polygon(
        [(disp_x + 500, disp_y + 100), (disp_x + 620, disp_y + 100), (disp_x + 600, disp_y + 700), (disp_x + 480, disp_y + 700)],
        fill=(150, 220, 255, 60)
    )

    # Brilho central (efeito "wow")
    for r in [200, 250, 300, 350]:
        draw.ellipse(
            [disp_x + disp_w // 2 - r, disp_y + disp_h // 2 - r,
             disp_x + disp_w // 2 + r, disp_y + disp_h // 2 + r],
            outline=(0, 255, 136, 30), width=1
        )

    # Notificação "100% ORIGINAL"
    badge_x, badge_y = 240, 880
    draw.rounded_rectangle([badge_x, badge_y, badge_x + 600, badge_y + 70], radius=35, fill=GREEN)
    f_badge = get_font(36, bold=True)
    draw.text((badge_x + 300, badge_y + 35), "✓ 100% ORIGINAL PRESERVADO", font=f_badge, fill=NAVY, anchor="mm")

    # Headline
    f_titulo = get_font(74, bold=True)
    draw.text((W // 2, 280), "Display original", font=f_titulo, fill=GREEN, anchor="mm")
    draw.text((W // 2, 360), "do seu cliente,", font=f_titulo, fill=WHITE, anchor="mm")
    draw.text((W // 2, 440), "como novo.", font=f_titulo, fill=WHITE, anchor="mm")

    # Subtítulo
    f_sub = get_font(36, bold=False)
    draw.text((W // 2, 560), "Sem tela paralela.", font=f_sub, fill=LIGHT_GRAY, anchor="mm")
    draw.text((W // 2, 610), "Sem garantia aberta.", font=f_sub, fill=LIGHT_GRAY, anchor="mm")
    draw.text((W // 2, 660), "Margem de 60% a 70%.", font=f_sub, fill=GREEN, anchor="mm")

    # Timecode
    f_time = get_font(28, bold=True)
    draw.text((60, H - 80), "00:35 / 00:50", font=f_time, fill=GREEN)

    return img

# ========== CENA 5: CTA (50-60s) ==========
def make_scene_5():
    img = Image.new('RGBA', (W, H), (8, 12, 20))
    draw = ImageDraw.Draw(img)

    # Fundo
    for i in range(H):
        ratio = i / H
        r = int(8 + 10 * ratio)
        g = int(12 + 15 * ratio)
        b = int(20 + 25 * ratio)
        draw.line([(0, i), (W, i)], fill=(r, g, b))

    # Linhas decorativas de circuito
    circuit_color = (0, 255, 136, 40)
    for i in range(8):
        y = 100 + i * 200
        draw.line([(0, y), (250, y)], fill=circuit_color, width=2)
        draw.ellipse([250-3, y-3, 250+3, y+3], fill=(0, 255, 136, 100))
    for i in range(8):
        x = W - 100 - i * 120
        draw.line([(x, 0), (x, 250)], fill=circuit_color, width=2)
        draw.ellipse([x-3, 250-3, x+3, 250+3], fill=(0, 255, 136, 100))

    # Ícone
    icon_size = 140
    icon_x = (W - icon_size) // 2
    icon_y = 220
    draw.rounded_rectangle(
        [icon_x, icon_y, icon_x + icon_size, icon_y + icon_size],
        radius=30, fill=BLUE
    )
    margin = icon_size * 0.25
    t = icon_size * 0.14
    draw.rounded_rectangle([icon_x + margin, icon_y + margin, icon_x + icon_size - margin, icon_y + margin + t], radius=int(t*0.4), fill=WHITE)
    draw.rectangle([icon_x + margin, icon_y + margin, icon_x + margin + t, icon_y + icon_size - margin], fill=WHITE)
    draw.rounded_rectangle([icon_x + margin, icon_y + icon_size - margin - t, icon_x + icon_size - margin, icon_y + icon_size - margin], radius=int(t*0.4), fill=WHITE)
    dot_r = int(icon_size * 0.07)
    draw.ellipse([icon_x + int(icon_size * 0.73) - dot_r, icon_y + int(icon_size * 0.20) - dot_r,
                  icon_x + int(icon_size * 0.73) + dot_r, icon_y + int(icon_size * 0.20) + dot_r], fill=GREEN)

    # Headline
    f_titulo = get_font(72, bold=True)
    draw.text((W // 2, 480), "Terceirize seu", font=f_titulo, fill=WHITE, anchor="mm")
    draw.text((W // 2, 560), "processo de", font=f_titulo, fill=WHITE, anchor="mm")
    draw.text((W // 2, 640), "laminação.", font=f_titulo, fill=GREEN, anchor="mm")

    # Subtítulo
    f_sub = get_font(40, bold=False)
    draw.text((W // 2, 760), "Registre seu CNPJ", font=f_sub, fill=LIGHT_GRAY, anchor="mm")
    draw.text((W // 2, 815), "e receba nossa tabela", font=f_sub, fill=LIGHT_GRAY, anchor="mm")
    draw.text((W // 2, 870), "atacadista para assistências.", font=f_sub, fill=LIGHT_GRAY, anchor="mm")

    # Card de etapas
    card_x, card_y = 80, 1000
    card_w, card_h = W - 160, 400
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=20, fill=(255, 255, 255, 10), outline=(0, 255, 136, 100), width=2)

    f_step_label = get_font(28, bold=True)
    f_step_text = get_font(32, bold=False)
    f_step_num = get_font(50, bold=True)

    steps = [
        ("1", "Preencha o formulário"),
        ("2", "Análise do CNPJ em 24h"),
        ("3", "Receba a tabela de atacado"),
    ]
    step_y = card_y + 50
    for num, text in steps:
        # Número
        draw.ellipse([card_x + 40, step_y, card_x + 120, step_y + 80], fill=GREEN)
        draw.text((card_x + 80, step_y + 40), num, font=f_step_num, fill=NAVY, anchor="mm")
        # Texto
        draw.text((card_x + 145, step_y + 40), text, font=f_step_text, fill=WHITE, anchor="lm")
        step_y += 110

    # Botão CTA
    btn_w, btn_h = 700, 100
    btn_x = (W - btn_w) // 2
    btn_y = 1480
    draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=50, fill=GREEN)
    f_btn = get_font(40, bold=True)
    draw.text((W // 2, btn_y + 50), "QUERO ME CREDENCIAR", font=f_btn, fill=NAVY, anchor="mm")

    # URL
    f_url = get_font(28, bold=True)
    draw.text((W // 2, 1640), "cyberinformatica.tech/landing-ads", font=f_url, fill=LIGHT_GRAY, anchor="mm")

    # Badge B2B
    f_badge = get_font(24, bold=True)
    draw.text((W // 2, 1730), "EXCLUSIVO B2B · FATURAMENTO VIA CNPJ", font=f_badge, fill=GREEN, anchor="mm")

    # Timecode
    f_time = get_font(28, bold=True)
    draw.text((60, H - 80), "00:50 / 01:00", font=f_time, fill=GREEN)

    return img

# Execução
print("Gerando storyboard do vídeo industrial...")
os.makedirs(OUTPUT_DIR, exist_ok=True)

scenes = [
    ("cena-1-gancho", make_scene_1),
    ("cena-2-problema", make_scene_2),
    ("cena-3-solucao", make_scene_3),
    ("cena-4-resultado", make_scene_4),
    ("cena-5-cta", make_scene_5),
]

for name, func in scenes:
    scene = func()
    scene.save(os.path.join(OUTPUT_DIR, f"{name}.png"), "PNG", quality=95)
    print(f"  - {name}.png ({scene.size})")

# Composição do storyboard
print("\nGerando composição do storyboard...")
comp_w = W
comp_h = H * 5 + 60 * 4
comp = Image.new('RGBA', (comp_w, comp_h), (245, 248, 255))
for i, (name, func) in enumerate(scenes):
    scene = func()
    y = i * (H + 60)
    comp.paste(scene, (0, y), scene)
# Reduz para visualização
comp_small = comp.resize((540, comp_h * 540 // W))
comp_small.save(os.path.join(OUTPUT_DIR, "storyboard-completo.png"), "PNG", quality=85)
print(f"  - storyboard-completo.png ({comp_small.size})")

print("\nConcluído!")
