import ScrollReveal from './ScrollReveal';

// ============================================================
// Bloco de transparência/compliance ("Quem somos") — texto único
// compartilhado entre "/" e "/lojista". Antes duplicado com leve
// divergência entre as duas páginas; texto sensível a compliance
// de Ads deve ter uma única fonte.
// ============================================================
export default function AboutTransparency() {
  return (
    <section id="quem-somos" className="section bg-white border-t border-gray-100">
      <div className="container max-w-3xl">
        <ScrollReveal>
          <span className="section-eyebrow">Quem somos</span>
          <h2 className="text-display text-3xl sm:text-4xl font-bold tracking-tight text-navy-900 leading-tight mb-6">
            Um laboratório independente, transparente com você
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            <p>
              A <strong className="text-navy-900">Cyber Informática</strong> é um{' '}
              <strong className="text-navy-900">laboratório independente de recuperação de displays</strong>,
              especializado em laminação OCA — a troca apenas do vidro externo danificado, preservando o
              display OLED/AMOLED original de fábrica do seu aparelho.
            </p>
            <p>
              <strong className="text-navy-900">Não somos assistência técnica autorizada</strong> pela Apple,
              Samsung ou qualquer outro fabricante, e não representamos essas marcas. Somos um prestador de
              serviço independente de reparo físico de hardware, com endereço físico, processo documentado e{' '}
              <strong className="text-navy-900">90 dias de garantia</strong> sobre o serviço que realizamos.
            </p>
            <p className="text-sm text-gray-500 pt-2 border-t border-gray-100">
              Apple e iPhone são marcas registradas da Apple Inc.; Samsung e Galaxy são marcas registradas da
              Samsung Electronics Co., Ltd. Os nomes das marcas são citados apenas para identificar os modelos
              de aparelho que atendemos.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
