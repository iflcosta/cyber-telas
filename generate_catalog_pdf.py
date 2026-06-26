"""
Gera o PDF do catalogo Cyber Informatica — laminacao OCA industrial.
Estrutura de precos: 5 faixas x 3 niveis (Cliente Final 70%, Lojista 35%,
Lojista Premium 25%).

Uso: python generate_catalog_pdf.py
Saida: apps/telas/public/catalogo-cyber.pdf

ATUALIZADO 2026-06-26 (reboot dual-persona)
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import os

# ============================================================================
# Paleta Cyber
# ============================================================================
CYBER_BLUE = colors.HexColor('#0066ff')
CYBER_BLUE_HOVER = colors.HexColor('#0052cc')
CIRCUIT_GREEN = colors.HexColor('#00ff88')
CIRCUIT_GREEN_DARK = colors.HexColor('#00cc6a')
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
# Dados de precos — espelham lib/pricing-tiers.ts
# ============================================================================

# Faixas com modelos e precos de referencia (troca completa em assistencia)
PRICING_TIERS = [
    {
        'label': 'A — Entrada',
        'tagline': 'Smartphones de entrada e modelos antigos',
        'ref_min': 0,
        'ref_max': 700,
        'examples': [
            ('Galaxy A15 / A25',         650),
            ('Moto G54 / G04',           600),
            ('Redmi Note 13 / 14',       650),
            ('iPhone 11 / XR',           700),
        ],
    },
    {
        'label': 'B — Intermediario',
        'tagline': 'Linhas medias premium',
        'ref_min': 700,
        'ref_max': 1500,
        'examples': [
            ('Galaxy A35 / A55',         1200),
            ('Moto G84 / Edge 40',       1000),
            ('Redmi Note 13 Pro / 14 Pro', 1100),
            ('iPhone 12 / 13',           1500),
        ],
    },
    {
        'label': 'C — Premium',
        'tagline': 'Linhas premium e flagships de geracao anterior',
        'ref_min': 1500,
        'ref_max': 2500,
        'examples': [
            ('Galaxy S23 / S24 / S24 FE', 1800),
            ('Galaxy S24+',              2200),
            ('iPhone 14 / 14 Pro',       2500),
            ('iPhone 15',                2000),
        ],
    },
    {
        'label': 'D — Top',
        'tagline': 'Flagships atuais',
        'ref_min': 2500,
        'ref_max': 3500,
        'examples': [
            ('Galaxy S24 Ultra',         2800),
            ('iPhone 15 Pro',            2800),
            ('iPhone 14 Pro Max',        3000),
            ('Pixel 8 Pro / 9 Pro',      2700),
        ],
    },
    {
        'label': 'E — Flagship',
        'tagline': 'Topo de linha e lancamentos',
        'ref_min': 3500,
        'ref_max': None,  # sem teto
        'examples': [
            ('iPhone 16 Pro Max / 15 Pro Max', 3500),
            ('iPhone 16 Pro',            3300),
            ('Galaxy S25 Ultra',         3700),
            ('Galaxy Z Fold / Flip (top)', 4000),
        ],
    },
]

# Multiplicadores
MULT_FINAL = 0.70
MULT_LOJISTA = 0.35
MULT_PREMIUM = 0.25


def calc(ref: float, mult: float) -> int:
    """Calcula preco arredondado."""
    return int(round(ref * mult))


def brl(v: int | float) -> str:
    """Formata BRL sem centavos."""
    return 'R$ {:,.0f}'.format(v).replace(',', '.')


def brl_range(min_v: float, max_v: float | None) -> str:
    if max_v is None:
        return f'{brl(min_v)}+'
    if min_v == 0:
        return f'ate {brl(max_v)}'
    return f'{brl(min_v)} a {brl(max_v)}'


# ============================================================================
# Estilos
# ============================================================================

def build_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='CyberTitle', parent=styles['Heading1'],
        fontName='Helvetica-Bold', fontSize=22, textColor=NAVY_950,
        alignment=TA_LEFT, spaceAfter=4 * mm, leading=26,
    ))
    styles.add(ParagraphStyle(
        name='CyberSubtitle', parent=styles['Normal'],
        fontName='Helvetica', fontSize=11, textColor=CYBER_BLUE,
        alignment=TA_LEFT, spaceAfter=6 * mm, leading=14,
    ))
    styles.add(ParagraphStyle(
        name='CyberH2', parent=styles['Heading2'],
        fontName='Helvetica-Bold', fontSize=14, textColor=NAVY_950,
        alignment=TA_LEFT, spaceBefore=4 * mm, spaceAfter=3 * mm, leading=17,
    ))
    styles.add(ParagraphStyle(
        name='CyberBody', parent=styles['Normal'],
        fontName='Helvetica', fontSize=9.5, textColor=GRAY_700,
        alignment=TA_JUSTIFY, spaceAfter=3 * mm, leading=13,
    ))
    styles.add(ParagraphStyle(
        name='CyberSmall', parent=styles['Normal'],
        fontName='Helvetica', fontSize=8.5, textColor=GRAY_700,
        alignment=TA_LEFT, leading=11,
    ))
    styles.add(ParagraphStyle(
        name='CyberTiny', parent=styles['Normal'],
        fontName='Helvetica-Oblique', fontSize=7.5, textColor=GRAY_500,
        alignment=TA_LEFT, leading=10,
    ))
    return styles


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica', 7.5)
    canvas.setFillColor(GRAY_500)
    canvas.drawString(
        20 * mm, 12 * mm,
        'Cyber Informatica  ·  Centro de laminacao OCA industrial  ·  telas.cyberinformatica.tech'
    )
    canvas.drawRightString(A4[0] - 20 * mm, 12 * mm, f'Pagina {doc.page}')
    canvas.setStrokeColor(CYBER_BLUE)
    canvas.setLineWidth(0.6)
    canvas.line(20 * mm, A4[1] - 18 * mm, A4[0] - 20 * mm, A4[1] - 18 * mm)
    canvas.restoreState()


# ============================================================================
# Conteudo
# ============================================================================

def build_story(styles):
    story = []

    # ============================================================
    # CAPA
    # ============================================================
    story.append(Spacer(1, 22 * mm))
    story.append(Paragraph(
        '<font color="#0066ff">CATALOGO TECNICO 2026 · ATUALIZADO EM JUN/2026</font>',
        styles['CyberSubtitle']
    ))
    story.append(Paragraph('Catalogo &amp; Tabela Atacadista', styles['CyberTitle']))
    story.append(Paragraph(
        'Laminacao OCA industrial de displays. Tres niveis de preco para tres perfis de cliente.',
        styles['CyberBody']
    ))
    story.append(Spacer(1, 6 * mm))

    # Box CTA capa
    cta_data = [[Paragraph(
        '<b>Atendimento exclusivo via CNPJ.</b><br/>'
        'Solicite seu credenciamento em '
        '<font color="#0066ff">telas.cyberinformatica.tech</font> '
        'ou via WhatsApp (11) 95436-9269.',
        styles['CyberBody']
    )]]
    cta = Table(cta_data, colWidths=[170 * mm])
    cta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f5f8ff')),
        ('LEFTPADDING', (0, 0), (-1, -1), 8 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5 * mm),
        ('LINEBEFORE', (0, 0), (0, -1), 2, CYBER_BLUE),
    ]))
    story.append(cta)
    story.append(Spacer(1, 10 * mm))

    # Indice
    story.append(Paragraph('Indice', styles['CyberH2']))
    indice = [
        ['01', 'Sobre a Cyber Informatica',                              '3'],
        ['02', 'Credenciais tecnicas',                                  '3'],
        ['03', 'Tabela de precos — 3 niveis x 5 faixas',               '4'],
        ['04', 'Tabela detalhada por modelo',                           '5'],
        ['05', 'Logistica de processamento',                            '6'],
        ['06', 'Condicoes comerciais',                                  '7'],
        ['07', 'Como se credenciar',                                    '8'],
        ['08', 'FAQ — Perguntas frequentes',                            '8'],
    ]
    ind_t = Table(indice, colWidths=[14 * mm, 130 * mm, 26 * mm])
    ind_t.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9.5),
        ('TEXTCOLOR', (0, 0), (-1, -1), GRAY_700),
        ('TEXTCOLOR', (0, 0), (0, -1), CYBER_BLUE),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('ALIGN', (-1, 0), (-1, -1), 'RIGHT'),
        ('LINEBELOW', (0, 0), (-1, -1), 0.3, GRAY_200),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
    ]))
    story.append(ind_t)

    story.append(PageBreak())

    # ============================================================
    # 01 + 02
    # ============================================================
    story.append(Paragraph('01  ·  Sobre nos', styles['CyberH2']))
    story.append(Paragraph(
        'A Cyber Informatica opera um centro de laminacao OCA industrial em '
        'Sao Paulo, com sala limpa controlada ISO 14644-1, autoclave de vacuo '
        'e capacidade de processamento em escala. Atendemos assistencias '
        'tecnicas e lojistas de tecnologia que precisam terceirizar a '
        'recuperacao de displays originais com margem agressiva e prazo confiavel.',
        styles['CyberBody']
    ))

    story.append(Paragraph('02  ·  Credenciais tecnicas', styles['CyberH2']))
    cred = [
        ['Item', 'Especificacao'],
        ['Ambiente', 'Sala limpa classe 1000 (ISO 14644-1)'],
        ['Filtragem', 'HEPA + controle temperatura/umidade'],
        ['Processo', 'Optically Clear Adhesive (OCA) sob vacuo'],
        ['Equipamento', 'Autoclave industrial + precisao milimetrica'],
        ['Capacidade', '500+ telas processadas por mes'],
        ['Rastreabilidade', 'Controle de qualidade por display'],
        ['Garantia do servico', '90 dias'],
    ]
    cred_t = Table(cred, colWidths=[55 * mm, 115 * mm])
    cred_t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_950),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9.5),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('TEXTCOLOR', (0, 1), (-1, -1), GRAY_700),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f8ff')]),
        ('LEFTPADDING', (0, 0), (-1, -1), 4 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('GRID', (0, 0), (-1, -1), 0.3, GRAY_200),
    ]))
    story.append(cred_t)

    story.append(PageBreak())

    # ============================================================
    # 03 — Tabela 3 niveis x 5 faixas
    # ============================================================
    story.append(Paragraph('03  ·  Tabela de precos — 3 niveis x 5 faixas', styles['CyberH2']))
    story.append(Paragraph(
        'Os precos sao calculados como um percentual do valor de referencia '
        '(preco medio de troca completa da tela em assistencia tecnica, incluindo '
        'peca + mao de obra). Tres niveis:',
        styles['CyberBody']
    ))

    # Legenda dos 3 niveis
    niveis = [
        ['Cliente Final',     '70% da troca completa', 'Pessoa fisica. Cotacao direta via WhatsApp.'],
        ['Lojista',           '35% da troca completa', 'Assistencias e lojistas credenciados (CNPJ). Compra em lote.'],
        ['Lojista Premium',   '25% da troca completa', 'Parceiros estrategicos (curadoria da Cyber).'],
    ]
    niv_t = Table(
        [['Nivel', 'Percentual', 'Quem se enquadra']] +
        [[Paragraph(f'<b>{n[0]}</b>', styles['CyberSmall']),
          Paragraph(f'<font color="#0066ff"><b>{n[1]}</b></font>', styles['CyberSmall']),
          Paragraph(n[2], styles['CyberSmall'])]
         for n in niveis],
        colWidths=[35 * mm, 38 * mm, 97 * mm],
    )
    niv_t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_950),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f8ff')]),
        ('LEFTPADDING', (0, 0), (-1, -1), 4 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 3 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3 * mm),
        ('GRID', (0, 0), (-1, -1), 0.3, GRAY_200),
        # destaque premium
        ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor('#e8fff3')),
    ]))
    story.append(niv_t)
    story.append(Spacer(1, 4 * mm))

    # Tabela por faixa
    story.append(Paragraph('Faixas por valor de referencia', styles['CyberH2']))
    story.append(Paragraph(
        'A referencia e o preco medio de mercado para troca completa da tela '
        '(peca + mao de obra) em assistencia tecnica. Use esta tabela para '
        'identificar em qual faixa o aparelho do seu cliente se encaixa.',
        styles['CyberBody']
    ))

    rows = [['Faixa', 'Referencia', 'Cliente Final (70%)', 'Lojista (35%)', 'Premium (25%)']]
    for t in PRICING_TIERS:
        rows.append([
            Paragraph(f'<b>{t["label"]}</b><br/>'
                      f'<font size="7" color="#6b7280">{t["tagline"]}</font>',
                      styles['CyberSmall']),
            Paragraph(brl_range(t['ref_min'], t['ref_max']), styles['CyberSmall']),
            Paragraph(brl_range(
                calc(t['ref_min'], MULT_FINAL),
                calc(t['ref_max'], MULT_FINAL) if t['ref_max'] else None,
            ), styles['CyberSmall']),
            Paragraph(f'<font color="#0052cc"><b>{brl_range(calc(t["ref_min"], MULT_LOJISTA), calc(t["ref_max"], MULT_LOJISTA) if t["ref_max"] else None)}</b></font>',
                      styles['CyberSmall']),
            Paragraph(f'<font color="#00cc6a"><b>{brl_range(calc(t["ref_min"], MULT_PREMIUM), calc(t["ref_max"], MULT_PREMIUM) if t["ref_max"] else None)}</b></font>',
                      styles['CyberSmall']),
        ])

    fx_t = Table(rows, colWidths=[42 * mm, 30 * mm, 32 * mm, 32 * mm, 32 * mm])
    fx_t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_950),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8.5),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f8ff')]),
        ('LEFTPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('GRID', (0, 0), (-1, -1), 0.3, GRAY_200),
        # destaque linha premium (coluna inteira)
        ('BACKGROUND', (-1, 0), (-1, -1), colors.HexColor('#e8fff3')),
    ]))
    story.append(fx_t)
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(
        '<i>Os valores acima sao faixas. O preco exato por modelo esta na '
        'Tabela Detalhada (pagina seguinte). Valores em reais (R$) por unidade '
        'processada. Tabela valida para 2026.</i>',
        styles['CyberTiny']
    ))

    story.append(PageBreak())

    # ============================================================
    # 04 — Tabela detalhada por modelo
    # ============================================================
    story.append(Paragraph('04  ·  Tabela detalhada por modelo', styles['CyberH2']))
    story.append(Paragraph(
        'Preco calculado sobre o valor de referencia (coluna 2) para cada modelo '
        'popular. Use como referencia para cotacao rapida — o preco final pode '
        'variar conforme o valor exato do aparelho do cliente.',
        styles['CyberBody']
    ))

    detail_rows = [['Faixa', 'Modelo', 'Ref.', 'Cliente (70%)', 'Lojista (35%)', 'Premium (25%)']]
    for t in PRICING_TIERS:
        for model, ref in t['examples']:
            detail_rows.append([
                Paragraph(t['label'], styles['CyberSmall']),
                Paragraph(model, styles['CyberSmall']),
                Paragraph(brl(ref), styles['CyberSmall']),
                Paragraph(brl(calc(ref, MULT_FINAL)), styles['CyberSmall']),
                Paragraph(f'<font color="#0052cc"><b>{brl(calc(ref, MULT_LOJISTA))}</b></font>',
                          styles['CyberSmall']),
                Paragraph(f'<font color="#00cc6a"><b>{brl(calc(ref, MULT_PREMIUM))}</b></font>',
                          styles['CyberSmall']),
            ])

    det_t = Table(detail_rows, colWidths=[24 * mm, 50 * mm, 22 * mm, 24 * mm, 24 * mm, 24 * mm])
    det_t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_950),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('ALIGN', (2, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 2 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 1.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5 * mm),
        ('GRID', (0, 0), (-1, -1), 0.3, GRAY_200),
        # alterna cor de fundo por faixa
        ('ROWBACKGROUNDS', (0, 1), (-1, -1),
         [colors.white, colors.HexColor('#f5f8ff')]),
    ]))
    story.append(det_t)
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph(
        '<i>Tabela nao exaustiva. Modelos fora da lista recebem cotacao personalizada '
        'via WhatsApp. Lojista Premium e condicao concedida por curadoria da Cyber '
        'Informatica (revisao periodica).</i>',
        styles['CyberTiny']
    ))

    story.append(PageBreak())

    # ============================================================
    # 05 — Logistica
    # ============================================================
    story.append(Paragraph('05  ·  Logistica de processamento', styles['CyberH2']))
    story.append(Paragraph(
        'O fluxo de processamento do lote segue 5 etapas com rastreabilidade '
        'individual por display. O prazo medio entre recebimento e devolucao '
        'e de 5 a 10 dias uteis, dependendo do volume e da faixa.',
        styles['CyberBody']
    ))

    etapas = [
        ('01', 'Envio do lote',
         'Embalagem antichoque e envio via transportadora parceira, '
         'Correios corporativo ou motoboy autorizado para a Grande SP.'),
        ('02', 'Recebimento',
         'Inspecao tecnica inicial em ambiente controlado. Cada display '
         'e catalogado e recebe identificacao unica.'),
        ('03', 'Processamento OCA',
         'Laminacao sob vacuo com autoclave industrial. Precisao '
         'milimetrica e adesivo Optically Clear Adhesive (OCA).'),
        ('04', 'Controle de qualidade',
         'Verificacao rigorosa com teste de touch, brilho e uniformidade. '
         'Display aprovado segue para embalagem final.'),
        ('05', 'Devolucao',
         'Embalagem antichoque industrial pronta para montagem. '
         'Devolvido via transportadora ou motoboy.'),
    ]
    for n, titulo, desc in etapas:
        story.append(Paragraph(
            f'<font color="#0066ff"><b>PASSO {n}</b></font>  ·  '
            f'<b>{titulo}</b>',
            styles['CyberBody']
        ))
        story.append(Paragraph(desc, styles['CyberBody']))
        story.append(Spacer(1, 0.8 * mm))

    story.append(PageBreak())

    # ============================================================
    # 06 — Condicoes comerciais
    # ============================================================
    story.append(Paragraph('06  ·  Condicoes comerciais', styles['CyberH2']))
    story.append(Paragraph(
        'As condicoes abaixo se aplicam a parceiros credenciados. Credenciamento '
        'e gratuito e sujeito a analise cadastral em ate 24h uteis.',
        styles['CyberBody']
    ))

    cond = [
        ['Condicao', 'Detalhe'],
        ['Pedido minimo', '10 displays por lote'],
        ['Prazo de processamento', '5 a 10 dias uteis (Grande SP)'],
        ['Pagamento', 'PJ em 14 / 30 / 60 dias (conforme volume)'],
        ['Frete de envio (retorno)', 'Gratis para a Grande SP; demais regioes '
                                    'cobrado por transportadora'],
        ['Garantia do servico', '90 dias contra delaminacao'],
        ['Suporte ao parceiro', 'WhatsApp dedicado + portal do parceiro'],
        ['Marketing co-branded', 'Material de vitrine disponivel para parceiros'],
        ['Tabela de precos', 'Atualizada trimestralmente via portal do parceiro'],
    ]
    cond_t = Table(cond, colWidths=[50 * mm, 120 * mm])
    cond_t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_950),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9.5),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('TEXTCOLOR', (0, 1), (-1, -1), GRAY_700),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f8ff')]),
        ('LEFTPADDING', (0, 0), (-1, -1), 4 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5 * mm),
        ('GRID', (0, 0), (-1, -1), 0.3, GRAY_200),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 1), (0, -1), NAVY_950),
    ]))
    story.append(cond_t)

    story.append(PageBreak())

    # ============================================================
    # 07 — Credenciamento + 08 — FAQ
    # ============================================================
    story.append(Paragraph('07  ·  Como se credenciar', styles['CyberH2']))
    story.append(Paragraph(
        'O credenciamento e feito em 4 etapas simples e totalmente online. '
        'Apos o envio do formulario, nossa equipe comercial valida o CNPJ em '
        'ate 24h uteis e libera o acesso ao portal do parceiro.',
        styles['CyberBody']
    ))

    cred_passos = [
        ('01', 'Preenchimento do formulario',
         'Acesse telas.cyberinformatica.tech, role ate a secao "Credenciamento" '
         'e preencha razao social, CNPJ, e-mail corporativo e volume medio '
         'semanal de telas.'),
        ('02', 'Analise cadastral',
         'Validamos seu CNPJ em ate 24h uteis. Em caso de divergencia, '
         'entraremos em contato via WhatsApp ou e-mail.'),
        ('03', 'Recebimento do catalogo',
         'Apos aprovado, voce recebe o catalogo tecnico completo, tabela '
         'atacadista atualizada e acesso ao portal do parceiro.'),
        ('04', 'Primeiro lote',
         'Voce envia o primeiro lote de displays via transportadora ou '
         'motoboy. Acompanhamos o processamento em tempo real pelo portal.'),
    ]
    for n, titulo, desc in cred_passos:
        story.append(Paragraph(
            f'<font color="#0066ff"><b>ETAPA {n}</b></font>  ·  '
            f'<b>{titulo}</b>',
            styles['CyberBody']
        ))
        story.append(Paragraph(desc, styles['CyberBody']))
        story.append(Spacer(1, 1.5 * mm))

    story.append(Spacer(1, 5 * mm))

    story.append(Paragraph('08  ·  FAQ — Perguntas frequentes', styles['CyberH2']))

    faq = [
        ('Como funciona o preco?',
         'Calculamos como um percentual do valor de troca completa da tela '
         '(peca + mao de obra) em assistencia tecnica. Cliente final paga 70%, '
         'lojista credenciado 35%, parceiro premium 25%.'),
        ('O que esta incluso no preco?',
         'O servico completo de laminacao OCA do display do cliente '
         '(recuperacao da tela original). NAO inclui peca nova avulsa — o '
         'display danificado e devolvido laminado, com vidro novo e display '
         'original preservado.'),
        ('Qual o pedido minimo?',
         '10 displays por lote. Para volumes menores, entre em contato — '
         'avaliamos caso a caso.'),
        ('Qual o SLA de devolucao?',
         '5 a 10 dias uteis para a Grande SP. Regioes mais distantes podem '
         'somar 1-2 dias de transporte.'),
        ('Como funciona o pagamento PJ?',
         '14, 30 ou 60 dias, conforme volume mensal. Condicao especial para '
         'Lojistas Premium.'),
        ('Posso cancelar o credenciamento?',
         'Sim, a qualquer momento. Basta solicitar via WhatsApp ou e-mail.'),
    ]
    for q, a in faq:
        story.append(Paragraph(f'<b>{q}</b>', styles['CyberBody']))
        story.append(Paragraph(a, styles['CyberBody']))
        story.append(Spacer(1, 1 * mm))

    story.append(Spacer(1, 6 * mm))

    final_cta = Table([[Paragraph(
        '<font color="#0066ff"><b>QUER COMECAR?</b></font><br/><br/>'
        'Acesse <b>telas.cyberinformatica.tech</b> e preencha o formulario '
        'de credenciamento, ou fale direto com nossa equipe pelo WhatsApp '
        '(11) 95436-9269.<br/><br/>'
        '<i>Catalogo emitido em junho/2026. Sujeito a atualizacao trimestral. '
        'Credenciamento gratuito e sujeito a analise cadastral. Condicao de '
        'Lojista Premium concedida por curadoria.</i>',
        ParagraphStyle('FinalCTA', parent=styles['CyberBody'],
                       alignment=TA_LEFT, fontSize=9.5)
    )]], colWidths=[170 * mm])
    final_cta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f5f8ff')),
        ('LEFTPADDING', (0, 0), (-1, -1), 8 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 6 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6 * mm),
        ('LINEBEFORE', (0, 0), (0, -1), 2, CYBER_BLUE),
    ]))
    story.append(final_cta)

    return story


def main():
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=22 * mm,
        bottomMargin=18 * mm,
        title='Catalogo Cyber Informatica - Laminacao OCA Industrial',
        author='Cyber Informatica',
    )
    styles = build_styles()
    story = build_story(styles)
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    size = os.path.getsize(OUTPUT)
    print(f'OK  -> {OUTPUT} ({size:,} bytes)')


if __name__ == '__main__':
    main()