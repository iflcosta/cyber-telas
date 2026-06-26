"""
Gera o PDF do catálogo Cyber Informática — laminação OCA industrial.
Uso: python generate_catalog_pdf.py

Saída: apps/telas/public/catalogo-cyber.pdf
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, Image, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import os

# ============================================================================
# Estilo Cyber (mesma paleta do site)
# ============================================================================
CYBER_BLUE = colors.HexColor('#0066ff')
CYBER_BLUE_HOVER = colors.HexColor('#0052cc')
CIRCUIT_GREEN = colors.HexColor('#00ff88')
NAVY_950 = colors.HexColor('#050a14')
NAVY_900 = colors.HexColor('#0a1929')
GRAY_700 = colors.HexColor('#374151')
GRAY_500 = colors.HexColor('#6b7280')
GRAY_200 = colors.HexColor('#e5e7eb')

OUTPUT = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    'apps', 'telas', 'public', 'catalogo-cyber.pdf'
)


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name='CyberTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=NAVY_950,
        alignment=TA_LEFT,
        spaceAfter=4 * mm,
        leading=28,
    ))
    styles.add(ParagraphStyle(
        name='CyberSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        textColor=CYBER_BLUE,
        alignment=TA_LEFT,
        spaceAfter=6 * mm,
        leading=15,
    ))
    styles.add(ParagraphStyle(
        name='CyberH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=15,
        textColor=NAVY_950,
        alignment=TA_LEFT,
        spaceBefore=4 * mm,
        spaceAfter=3 * mm,
        leading=18,
    ))
    styles.add(ParagraphStyle(
        name='CyberBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=GRAY_700,
        alignment=TA_JUSTIFY,
        spaceAfter=3 * mm,
        leading=14,
    ))
    styles.add(ParagraphStyle(
        name='CyberFooter',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        textColor=GRAY_500,
        alignment=TA_CENTER,
        leading=10,
    ))
    return styles


def header_footer(canvas, doc):
    """Header discreto em cada pagina + footer com CTA."""
    canvas.saveState()
    # Footer
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(GRAY_500)
    canvas.drawString(
        20 * mm, 12 * mm,
        'Cyber Informatica  ·  Centro de laminacao OCA industrial  ·  telas.cyberinformatica.tech'
    )
    canvas.drawRightString(
        A4[0] - 20 * mm, 12 * mm,
        f'Pagina {doc.page}'
    )
    # Top accent line
    canvas.setStrokeColor(CYBER_BLUE)
    canvas.setLineWidth(0.6)
    canvas.line(20 * mm, A4[1] - 18 * mm, A4[0] - 20 * mm, A4[1] - 18 * mm)
    canvas.restoreState()


def build_story(styles):
    story = []

    # ============================================================
    # CAPA
    # ============================================================
    story.append(Spacer(1, 30 * mm))
    story.append(Paragraph(
        '<font color="#0066ff">CATALOGO TECNICO 2026</font>',
        styles['CyberSubtitle']
    ))
    story.append(Paragraph('Catalogo &amp; Tabela Atacadista', styles['CyberTitle']))
    story.append(Paragraph(
        'Laminacao OCA industrial de displays para assistencias tecnicas e '
        'lojistas de tecnologia credenciados.',
        styles['CyberBody']
    ))
    story.append(Spacer(1, 8 * mm))

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
    story.append(Spacer(1, 12 * mm))

    # Indice
    story.append(Paragraph('Indice', styles['CyberH2']))
    indice_data = [
        ['01', 'Sobre a Cyber Informatica', '3'],
        ['02', 'Credenciais tecnicas', '3'],
        ['03', 'Tabela de faixas de preco', '4'],
        ['04', 'Logistica de processamento', '5'],
        ['05', 'Condicoes comerciais', '6'],
        ['06', 'Como se credenciar', '7'],
    ]
    indice_table = Table(indice_data, colWidths=[15 * mm, 130 * mm, 25 * mm])
    indice_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (-1, -1), GRAY_700),
        ('TEXTCOLOR', (0, 0), (0, -1), CYBER_BLUE),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('ALIGN', (-1, 0), (-1, -1), 'RIGHT'),
        ('LINEBELOW', (0, 0), (-1, -1), 0.3, GRAY_200),
        ('TOPPADDING', (0, 0), (-1, -1), 3 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3 * mm),
    ]))
    story.append(indice_table)

    story.append(PageBreak())

    # ============================================================
    # 01 + 02
    # ============================================================
    story.append(Paragraph('01  ·  Sobre nos', styles['CyberH2']))
    story.append(Paragraph(
        'A Cyber Informatica opera um centro de laminacao OCA industrial em '
        'Sao Paulo, com sala limpa controlada ISO 14644-1, autoclave de vacuo '
        'e capacidade de processamento em escala. Atendemos assistencias '
        'tecnicas e lojistas de tecnologia que precisam terceirizar a recuperacao '
        'de displays originais com margem agressiva e prazo confiavel.',
        styles['CyberBody']
    ))

    story.append(Paragraph('02  ·  Credenciais tecnicas', styles['CyberH2']))
    cred_data = [
        ['Item', 'Especificacao'],
        ['Ambiente', 'Sala limpa classe 1000 (ISO 14644-1)'],
        ['Filtragem', 'HEPA + controle temperatura/umidade'],
        ['Processo', 'Optically Clear Adhesive (OCA) sob vacuo'],
        ['Equipamento', 'Autoclave industrial + precisao milimetrica'],
        ['Capacidade', '500+ telas processadas por mes'],
        ['Rastreabilidade', 'Controle de qualidade por display'],
        ['Garantia do servico', '90 dias'],
    ]
    cred_table = Table(cred_data, colWidths=[55 * mm, 115 * mm])
    cred_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_950),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
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
    story.append(cred_table)

    story.append(PageBreak())

    # ============================================================
    # 03 — Tabela de faixas
    # ============================================================
    story.append(Paragraph('03  ·  Tabela de faixas de preco', styles['CyberH2']))
    story.append(Paragraph(
        'O preco do servico e definido pelo valor de mercado do display novo. '
        'Quanto maior a faixa, maior sua economia versus a tela paralela importada. '
        'Tabela em Reais (R$) por unidade processada.',
        styles['CyberBody']
    ))

    faixas = [
        ['Faixa', 'Valor do display', 'Preco do servico', 'Economia vs. tela paralela'],
        ['Economico',     'ate R$ 500',     'R$ 80',  '~80%'],
        ['Intermediario', 'R$ 500 a 1.000', 'R$ 120', '~70%'],
        ['Premium',       'R$ 1.000 a 2.000', 'R$ 180', '~65%'],
        ['Top',           'R$ 2.000 a 3.500', 'R$ 250', '~60%'],
        ['Flagship',      'acima de R$ 3.500', 'R$ 320', '~55%'],
    ]
    fx_table = Table(faixas, colWidths=[40 * mm, 50 * mm, 40 * mm, 40 * mm])
    fx_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_950),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TEXTCOLOR', (0, 1), (-1, -1), GRAY_700),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f8ff')]),
        ('LEFTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3 * mm),
        ('TOPPADDING', (0, 0), (-1, -1), 3 * mm),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3 * mm),
        ('GRID', (0, 0), (-1, -1), 0.3, GRAY_200),
        # destaca coluna de preço
        ('TEXTCOLOR', (2, 1), (2, -1), NAVY_950),
        ('FONTNAME', (2, 1), (2, -1), 'Helvetica-Bold'),
        # coluna economia em circuit-green
        ('TEXTCOLOR', (3, 1), (3, -1), CYBER_BLUE_HOVER),
        ('FONTNAME', (3, 1), (3, -1), 'Helvetica-Bold'),
    ]))
    story.append(fx_table)

    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph(
        '<i>Tabela valida para o ano de 2026. Atualizacoes sao comunicadas aos '
        'parceiros credenciados via WhatsApp e portal do parceiro.</i>',
        styles['CyberBody']
    ))

    story.append(PageBreak())

    # ============================================================
    # 04 — Logística
    # ============================================================
    story.append(Paragraph('04  ·  Logistica de processamento', styles['CyberH2']))
    story.append(Paragraph(
        'O fluxo de processamento do lote segue 5 etapas com rastreabilidade '
        'individual por display. O prazo medio entre recebimento e devolucao '
        'e de 5 a 10 dias uteis, dependendo do volume e da faixa.',
        styles['CyberBody']
    ))

    etapas = [
        ['01', 'Envio do lote',
         'Embalagem antichoque e envio via transportadora parceira, '
         'Correios corporativo ou motoboy autorizado para a Grande SP.'],
        ['02', 'Recebimento',
         'Inspecao tecnica inicial em ambiente controlado. Cada display '
         'e catalogado e recebe identificacao unica.'],
        ['03', 'Processamento OCA',
         'Laminacao sob vacuo com autoclave industrial. Precisao '
         'milimetrica e adesivo Optically Clear Adhesive (OCA).'],
        ['04', 'Controle de qualidade',
         'Verificacao rigorosa com teste de touch, brilho e uniformidade. '
         'Display aprovado segue para embalagem final.'],
        ['05', 'Devolucao',
         'Embalagem antichoque industrial pronta para montagem. '
         'Devolvido via transportadora ou motoboy.'],
    ]
    for n, titulo, desc in etapas:
        story.append(Paragraph(
            f'<font color="#0066ff"><b>PASSO {n}</b></font>  ·  '
            f'<b>{titulo}</b>',
            styles['CyberBody']
        ))
        story.append(Paragraph(desc, styles['CyberBody']))
        story.append(Spacer(1, 1 * mm))

    story.append(PageBreak())

    # ============================================================
    # 05 — Condições comerciais
    # ============================================================
    story.append(Paragraph('05  ·  Condicoes comerciais', styles['CyberH2']))
    story.append(Paragraph(
        'As condicoes abaixo se aplicam a parceiros credenciados. Credenciamento '
        'e gratuito e sujeito a analise cadastral em ate 24h uteis.',
        styles['CyberBody']
    ))

    cond_data = [
        ['Condicao', 'Detalhe'],
        ['Pedido minimo', '10 displays por lote'],
        ['Prazo de processamento', '5 a 10 dias uteis (Grande SP)'],
        ['Pagamento', 'PJ em 14 / 30 / 60 dias (conforme volume)'],
        ['Frete de envio (retorno)', 'Gratis para a Grande SP; demais regioes '
                                    'cobrado por transportadora'],
        ['Garantia do servico', '90 dias contra delaminacao'],
        ['Suporte ao parceiro', 'WhatsApp dedicado + portal do parceiro'],
        ['Marketing co-branded', 'Material de vitrine disponivel para parceiros'],
    ]
    cond_table = Table(cond_data, colWidths=[50 * mm, 120 * mm])
    cond_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY_950),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
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
        # primeira coluna em destaque
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 1), (0, -1), NAVY_950),
    ]))
    story.append(cond_table)

    story.append(PageBreak())

    # ============================================================
    # 06 — Como se credenciar
    # ============================================================
    story.append(Paragraph('06  ·  Como se credenciar', styles['CyberH2']))
    story.append(Paragraph(
        'O credenciamento e feito em 4 etapas simples e totalmente online. '
        'Apos o envio do formulario, nossa equipe comercial valida o CNPJ em '
        'ate 24h uteis e libera o acesso ao portal do parceiro.',
        styles['CyberBody']
    ))

    cred_passos = [
        ['01', 'Preenchimento do formulario',
         'Acesse telas.cyberinformatica.tech, role ate a secao "Credenciamento" '
         'e preencha razao social, CNPJ, e-mail corporativo e volume medio '
         'semanal de telas.'],
        ['02', 'Analise cadastral',
         'Validamos seu CNPJ em ate 24h uteis. Em caso de divergencia, '
         'entraremos em contato via WhatsApp ou e-mail.'],
        ['03', 'Recebimento do catalogo',
         'Apos aprovado, voce recebe o catalogo tecnico completo, tabela '
         'atacadista atualizada e acesso ao portal do parceiro.'],
        ['04', 'Primeiro lote',
         'Voce envia o primeiro lote de displays via transportadora ou '
         'motoboy. Acompanhamos o processamento em tempo real pelo portal.'],
    ]
    for n, titulo, desc in cred_passos:
        story.append(Paragraph(
            f'<font color="#0066ff"><b>ETAPA {n}</b></font>  ·  '
            f'<b>{titulo}</b>',
            styles['CyberBody']
        ))
        story.append(Paragraph(desc, styles['CyberBody']))
        story.append(Spacer(1, 1.5 * mm))

    story.append(Spacer(1, 6 * mm))

    # CTA final
    final_cta = Table([[Paragraph(
        '<font color="#0066ff"><b>QUER COMECAR?</b></font><br/><br/>'
        'Acesse <b>telas.cyberinformatica.tech</b> e preencha o formulario '
        'de credenciamento, ou fale direto com nossa equipe pelo WhatsApp '
        '(11) 95436-9269.<br/><br/>'
        '<i>Catálogo emitido em junho/2026. Sujeito a atualizacao. Credenciamento '
        'gratuito e sujeito a analise cadastral.</i>',
        ParagraphStyle(
            'FinalCTA', parent=styles['CyberBody'],
            alignment=TA_LEFT, fontSize=10,
        )
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