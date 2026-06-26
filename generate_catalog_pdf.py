"""
Gera o PDF do catalogo Cyber Informatica — TABELA DE PRECOS individualizada.
1-2 paginas focadas em: Modelo | Valor Lojista (ate 35%) | Valor Cheio.

ATUALIZADO 2026-06-26 (versao enxuta focada em lojista).
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
    KeepTogether,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
import os

# ============================================================================
# Paleta Cyber
# ============================================================================
CYBER_BLUE = colors.HexColor('#0066ff')
CYBER_BLUE_HOVER = colors.HexColor('#0052cc')
CIRCUIT_GREEN = colors.HexColor('#00cc6a')
CIRCUIT_GREEN_BRIGHT = colors.HexColor('#00ff88')
NAVY_950 = colors.HexColor('#050a14')
NAVY_900 = colors.HexColor('#0a1929')
GRAY_700 = colors.HexColor('#374151')
GRAY_500 = colors.HexColor('#6b7280')
GRAY_200 = colors.HexColor('#e5e7eb')

OUTPUT = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    'apps', 'telas', 'public', 'catalogo-cyber.pdf'
)

# ============================================================================
# Tabela de precos — espelha lib/pricing-models.ts
# ============================================================================

GROUPS = [
    ('Apple', [
        ('iPhone 16 Pro Max',    1200, 3500),
        ('iPhone 16 Pro',        1100, 3200),
        ('iPhone 16 Plus',       1000, 2800),
        ('iPhone 16',             900, 2500),
        ('iPhone 15 Pro Max',    1050, 3000),
        ('iPhone 15 Pro',        1000, 2800),
        ('iPhone 15 Plus',        900, 2500),
        ('iPhone 15',             750, 2200),
        ('iPhone 14 Pro Max',    1000, 2900),
        ('iPhone 14 Pro',         950, 2700),
        ('iPhone 14 Plus',        800, 2300),
        ('iPhone 14',             700, 2000),
        ('iPhone 13 Pro Max',     900, 2500),
        ('iPhone 13 Pro',         800, 2300),
        ('iPhone 13',             600, 1700),
        ('iPhone 12 Pro Max',     700, 2000),
        ('iPhone 12 Pro',         650, 1800),
        ('iPhone 12',             500, 1500),
        ('iPhone 11 Pro Max',     600, 1700),
        ('iPhone 11 Pro',         500, 1500),
        ('iPhone 11',             450, 1300),
        ('iPhone XS Max',         400, 1100),
        ('iPhone XS',             350, 1000),
        ('iPhone XR',             300, 900),
        ('iPhone SE (3a ger)',    300, 800),
    ]),
    ('Samsung Galaxy S', [
        ('Galaxy S25 Ultra',     1350, 3800),
        ('Galaxy S25+',          1100, 3200),
        ('Galaxy S25',           1000, 2800),
        ('Galaxy S24 Ultra',     1000, 2800),
        ('Galaxy S24+',           750, 2200),
        ('Galaxy S24',            650, 1800),
        ('Galaxy S24 FE',         600, 1700),
        ('Galaxy S23 Ultra',      900, 2500),
        ('Galaxy S23+',           700, 2000),
        ('Galaxy S23',            600, 1700),
        ('Galaxy S23 FE',         500, 1500),
        ('Galaxy S22 Ultra',      700, 2000),
        ('Galaxy S22+',           550, 1600),
        ('Galaxy S22',            500, 1500),
    ]),
    ('Samsung Galaxy A', [
        ('Galaxy A55',  400, 1200),
        ('Galaxy A54',  400, 1100),
        ('Galaxy A35',  300, 850),
        ('Galaxy A34',  300, 800),
        ('Galaxy A25',  250, 700),
        ('Galaxy A24',  250, 650),
        ('Galaxy A15',  250, 650),
        ('Galaxy A14',  200, 600),
        ('Galaxy A05',  175, 500),
    ]),
    ('Xiaomi', [
        ('Redmi Note 14 Pro',   400, 1100),
        ('Redmi Note 14',       250, 700),
        ('Redmi Note 13 Pro',   300, 900),
        ('Redmi Note 13',       250, 700),
        ('Redmi 14C',           200, 600),
        ('Redmi 13C',           200, 550),
        ('Poco X6 Pro',         450, 1300),
        ('Poco X6',             400, 1100),
        ('Poco X5 Pro',         300, 900),
    ]),
    ('Motorola', [
        ('Moto G84',     300, 900),
        ('Moto G54',     200, 600),
        ('Moto G34',     200, 550),
        ('Moto G24',     175, 500),
        ('Moto G14',     175, 480),
        ('Moto G04',     150, 450),
        ('Edge 50 Pro',  450, 1300),
        ('Edge 50',      400, 1100),
        ('Edge 40',      350, 1000),
    ]),
    ('Google Pixel', [
        ('Pixel 9 Pro XL',  950, 2700),
        ('Pixel 9 Pro',     850, 2400),
        ('Pixel 9',         650, 1800),
        ('Pixel 8 Pro',     800, 2300),
        ('Pixel 8',         500, 1500),
        ('Pixel 8a',        400, 1100),
    ]),
]

TOTAL_MODELS = sum(len(models) for _, models in GROUPS)


def brl(v: int) -> str:
    """Formata BRL sem centavos."""
    return 'R$ {:,.0f}'.format(v).replace(',', '.')


# ============================================================================
# Estilos
# ============================================================================

def build_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='CatalogTitle', parent=styles['Heading1'],
        fontName='Helvetica-Bold', fontSize=18, textColor=NAVY_950,
        alignment=TA_LEFT, spaceAfter=2 * mm, leading=22,
    ))
    styles.add(ParagraphStyle(
        name='CatalogSubtitle', parent=styles['Normal'],
        fontName='Helvetica', fontSize=9.5, textColor=CYBER_BLUE,
        alignment=TA_LEFT, spaceAfter=4 * mm, leading=12,
    ))
    styles.add(ParagraphStyle(
        name='BrandHeader', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.white,
        alignment=TA_LEFT, leading=10,
    ))
    styles.add(ParagraphStyle(
        name='ModelName', parent=styles['Normal'],
        fontName='Helvetica', fontSize=7.5, textColor=GRAY_700,
        alignment=TA_LEFT, leading=9,
    ))
    styles.add(ParagraphStyle(
        name='PriceLojista', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=8, textColor=CYBER_BLUE,
        alignment=TA_RIGHT, leading=10,
    ))
    styles.add(ParagraphStyle(
        name='PriceFull', parent=styles['Normal'],
        fontName='Helvetica', fontSize=8, textColor=GRAY_500,
        alignment=TA_RIGHT, leading=10,
    ))
    styles.add(ParagraphStyle(
        name='Footer', parent=styles['Normal'],
        fontName='Helvetica', fontSize=8, textColor=GRAY_700,
        alignment=TA_CENTER, leading=11,
    ))
    styles.add(ParagraphStyle(
        name='Intro', parent=styles['Normal'],
        fontName='Helvetica', fontSize=9, textColor=GRAY_700,
        alignment=TA_JUSTIFY, spaceAfter=3 * mm, leading=12,
    ))
    return styles


def header_footer(canvas, doc):
    """Header minimalista (apenas linha colorida) + footer."""
    canvas.saveState()
    canvas.setFont('Helvetica', 7.5)
    canvas.setFillColor(GRAY_500)
    canvas.drawCentredString(
        A4[0] / 2, 10 * mm,
        f'Cyber Informatica  ·  Tabela de Precos Atacado  ·  {TOTAL_MODELS} modelos  ·  Pagina {doc.page} de 2'
    )
    canvas.restoreState()


# ============================================================================
# Tabela compacta por marca
# ============================================================================

def build_brand_table(brand: str, models: list, styles) -> list:
    """Constroi o bloco (cabecalho da marca + tabela). SEM KeepTogether
    para permitir que Apple (25 modelos) flua entre paginas."""
    # Cabecalho da marca
    header_data = [[Paragraph(brand, styles['BrandHeader'])]]
    header_t = Table(header_data, colWidths=[170 * mm])
    header_t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), NAVY_950),
        ('LEFTPADDING', (0, 0), (-1, -1), 4 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 1.2 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.2 * mm),
    ]))

    # Linhas dos modelos (3 colunas)
    rows = []
    for i, (model, loj, full) in enumerate(models):
        rows.append([
            Paragraph(model, styles['ModelName']),
            Paragraph(brl(loj), styles['PriceLojista']),
            Paragraph(brl(full), styles['PriceFull']),
        ])

    body_t = Table(rows, colWidths=[80 * mm, 45 * mm, 45 * mm])
    body_style = [
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 0.7 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0.7 * mm),
        ('LINEBELOW', (0, 0), (-1, -1), 0.15, GRAY_200),
    ]
    for i in range(len(rows)):
        if i % 2 == 0:
            body_style.append(('BACKGROUND', (0, i), (-1, i), colors.white))
        else:
            body_style.append(('BACKGROUND', (0, i), (-1, i), colors.HexColor('#f5f8ff')))
    body_t.setStyle(TableStyle(body_style))

    return [header_t, body_t]


def build_table_header(styles) -> Table:
    """Cabecalho da tabela (Modelo | Valor (35%) | Valor Cheio)."""
    data = [[
        Paragraph('<b>MODELO</b>', styles['ModelName']),
        Paragraph('<b>VALOR (ate 35%)</b>', styles['PriceLojista']),
        Paragraph('<b>VALOR CHEIO</b>', styles['PriceFull']),
    ]]
    t = Table(data, colWidths=[80 * mm, 45 * mm, 45 * mm])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CYBER_BLUE),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.white),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 2 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2 * mm),
        ('LINEBELOW', (0, 0), (-1, -1), 0.5, colors.white),
    ]))
    return t


# ============================================================================
# Conteudo
# ============================================================================

def build_story(styles):
    story = []

    # ============================================================
    # HEADER
    # ============================================================
    story.append(Paragraph(
        '<font color="#0066ff">CATALOGO 2026</font>',
        styles['CatalogSubtitle']
    ))
    story.append(Paragraph('Tabela de Precos · Atacado', styles['CatalogTitle']))

    story.append(Paragraph(
        '<b>Valor Cheio</b> = valor medio de troca completa da tela em assistencia '
        'tecnica (peca + mao de obra). '
        '<b>Valor (ate 35%)</b> = quanto o lojista credenciado paga a Cyber. '
        'Para clientes finais (pessoa fisica), o preco e 70% do valor cheio — '
        'consulte via WhatsApp. Parceiros Premium podem chegar a 25%.',
        styles['Intro']
    ))

    story.append(build_table_header(styles))

    # ============================================================
    # Todas as marcas em fluxo natural (sem PageBreak forcado)
    # ============================================================
    for brand, models in GROUPS:
        for block in build_brand_table(brand.upper(), models, styles):
            story.append(block)
        story.append(Spacer(1, 0.5 * mm))

    story.append(Spacer(1, 3 * mm))

    # CTA final
    cta_data = [[Paragraph(
        '<font color="#0066ff"><b>QUER CREDENCIAMENTO?</b></font><br/>'
        'Acesse <b>telas.cyberinformatica.tech</b> ou fale no WhatsApp '
        '<b>(11) 95436-9269</b>. Analise de CNPJ em ate 24h uteis. '
        'Modelos fora da lista recebem cotacao personalizada.<br/>'
        '<font size="7" color="#6b7280"><i>Valores em reais (R$) por unidade '
        'processada. Tabela valida para 2026 — atualizada periodicamente. '
        'Sujeito a analise cadastral. Condicao Premium por curadoria.</i></font>',
        styles['Footer']
    )]]
    cta = Table(cta_data, colWidths=[170 * mm])
    cta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f5f8ff')),
        ('LEFTPADDING', (0, 0), (-1, -1), 6 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 4 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4 * mm),
        ('LINEBEFORE', (0, 0), (0, -1), 2, CYBER_BLUE),
    ]))
    story.append(cta)

    return story


def main():
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=12 * mm,
        bottomMargin=15 * mm,
        title='Catalogo de Precos Atacado - Cyber Informatica',
        author='Cyber Informatica',
    )
    styles = build_styles()
    story = build_story(styles)
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    size = os.path.getsize(OUTPUT)
    pages = doc.page
    print(f'OK  -> {OUTPUT} ({size:,} bytes, {pages} pagina(s), {TOTAL_MODELS} modelos)')


if __name__ == '__main__':
    main()