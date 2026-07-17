// ============================================================
// Linha de disclaimer legal (rodapé) — compartilhada entre "/" e
// "/lojista". Texto sensível a compliance de Ads (não-autorização
// + marcas de terceiros); única fonte evita divergência entre páginas.
// ============================================================
export default function LegalDisclaimer({ className }: { className?: string }) {
  return (
    <p className={className}>
      © 2026 Cyber Informática — laboratório independente de recuperação de displays (laminação OCA / troca de
      vidro). Todos os direitos reservados.{' '}
      <strong className="text-gray-400">Não somos assistência autorizada Apple, Samsung ou de qualquer fabricante.</strong>{' '}
      Apple® e iPhone® são marcas da Apple Inc.; Samsung® e Galaxy® são marcas da Samsung Electronics. Marcas
      citadas apenas para identificação de modelos. Serviço com 90 dias de garantia.
    </p>
  );
}
