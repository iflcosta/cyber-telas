import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Política de Privacidade da Cyber Informática — tratamento de dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD).',
  alternates: {
    canonical: '/politica-privacidade',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const UPDATED_AT = '2026-06-26';

export default function PoliticaPrivacidadePage() {
  return (
    <main className="bg-[#f5f8ff] min-h-screen">
      <Header />

      <article className="container max-w-4xl py-12 sm:py-16 lg:py-20">
        <div className="mb-10">
          <span className="inline-block font-mono text-xs text-cyber-blue uppercase tracking-widest mb-3">
            &#47;&#47; Documento Legal
          </span>
          <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 tracking-tight mb-4">
            Política de Privacidade
          </h1>
          <p className="text-sm text-gray-500">
            Última atualização: <strong>{UPDATED_AT}</strong> · Versão 1.0
          </p>
        </div>

        <div className="prose-legal space-y-8 text-gray-700 leading-relaxed">
          <Section title="1. Identificação do Controlador">
            <p>
              A <strong>Cyber Informática</strong>, razão social{' '}
              <strong>Unidade de Engenharia de Componentes Eletrônicos S/A</strong>,
              opera este site institucional com o objetivo de apresentar seus
              serviços de laminação OCA industrial de displays para pessoas
              jurídicas do ramo de eletroeletrônicos.
            </p>
            <p>
              Para qualquer questão relativa a este documento ou ao tratamento
              dos seus dados pessoais, entre em contato pelo canal indicado na
              seção 10.
            </p>
          </Section>

          <Section title="2. Dados que coletamos">
            <p>Coletamos apenas os dados estritamente necessários para:</p>
            <ul className="list-disc pl-6 space-y-1.5 mt-3">
              <li>
                <strong>Cotação (pessoa física)</strong>: nome, telefone/WhatsApp
                e o modelo do aparelho, informados voluntariamente para
                orçamento e execução do serviço de laminação.
              </li>
              <li>
                <strong>Credenciamento B2B</strong>: nome, e-mail, telefone,
                CNPJ, razão social, endereço comercial, segmento de atuação.
              </li>
              <li>
                <strong>Navegação</strong>: endereço IP, user-agent, páginas
                visitadas, tempo de sessão (apenas após consentimento em
                cookies de analytics).
              </li>
              <li>
                <strong>Comunicação</strong>: registros de contatos feitos
                via formulário, WhatsApp, e-mail ou telefone para fins de
                cotação e execução do serviço.
              </li>
            </ul>
          </Section>

          <Section title="3. Finalidades e bases legais">
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 pr-4 font-semibold text-navy-900">
                      Finalidade
                    </th>
                    <th className="text-left py-2 pr-4 font-semibold text-navy-900">
                      Base legal (LGPD)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-2 pr-4">Análise de credenciamento e contato comercial</td>
                    <td className="py-2 pr-4">Execução de contrato / Diligência prévia</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Cumprimento de obrigações fiscais e contratuais</td>
                    <td className="py-2 pr-4">Cumprimento de obrigação legal</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Analytics e melhorias no site</td>
                    <td className="py-2 pr-4">Consentimento (cookies)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Marketing e remarketing</td>
                    <td className="py-2 pr-4">Consentimento (cookies)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Segurança da informação e prevenção a fraudes</td>
                    <td className="py-2 pr-4">Legítimo interesse</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="4. Cookies utilizados">
            <p>
              Utilizamos cookies para diferentes finalidades. O consentimento
              para cookies não essenciais é solicitado por meio do banner
              exibido na primeira visita.
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mt-3">
              <li>
                <strong>Essenciais</strong> (sempre ativos): sessão,
                segurança, preferências de exibição.
              </li>
              <li>
                <strong>Analytics</strong> (Google Analytics 4, com consentimento):
                métricas anônimas de uso.
              </li>
              <li>
                <strong>Marketing</strong> (Meta Pixel, com consentimento):
                mensuração de campanhas e remarketing.
              </li>
            </ul>
            <p className="mt-3">
              Você pode revisar ou alterar suas preferências a qualquer
              momento clicando em{' '}
              <Link
                href="/politica-privacidade#preferencias"
                className="text-cyber-blue hover:text-circuit-green underline underline-offset-2"
              >
                Preferências de cookies
              </Link>{' '}
              abaixo ou limpando os cookies do navegador.
            </p>
          </Section>

          <Section title="5. Compartilhamento de dados">
            <p>
              Não comercializamos dados pessoais. Eventuais compartilhamentos
              ocorrem exclusivamente com:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mt-3">
              <li>
                Provedores de infraestrutura (Vercel para hospedagem,
                Supabase para banco de dados) sob contrato de
                confidencialidade.
              </li>
              <li>
                Plataformas de analytics/marketing (Google, Meta), apenas
                mediante consentimento explícito do titular.
              </li>
              <li>
                Autoridades fiscais, regulatórias ou judiciais, quando
                houver obrigação legal.
              </li>
            </ul>
          </Section>

          <Section title="6. Direitos do titular">
            <p>
              Conforme o art. 18 da LGPD, o titular dos dados pessoais tem o
              direito de:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mt-3">
              <li>Confirmar a existência de tratamento;</li>
              <li>Solicitar acesso, correção ou eliminação dos dados;</li>
              <li>Solicitar anonimização, bloqueio ou portabilidade;</li>
              <li>Revogar consentimento a qualquer momento;</li>
              <li>Apresentar reclamação à ANPD.</li>
            </ul>
            <p className="mt-3">
              Para exercer esses direitos, entre em contato pelo canal
              indicado na seção 10.
            </p>
          </Section>

          <Section title="7. Retenção de dados">
            <p>
              Mantemos os dados pessoais pelo período necessário ao
              cumprimento das finalidades declaradas e das obrigações
              legais/contratuais aplicáveis. Dados cadastrais de parceiros
              são mantidos enquanto durar a relação comercial e por mais 5
              (cinco) anos após o término, para fins fiscais e de
              auditoria. Dados de navegação (analytics) são mantidos por até
              14 meses.
            </p>
          </Section>

          <Section title="8. Segurança da informação">
            <p>
              Adotamos medidas técnicas e organizacionais razoáveis para
              proteger os dados pessoais contra acessos não autorizados,
              situações acidentais ou ilícitas, destruição, perda ou
              divulgação indevida. As comunicações com o site são protegidas
              por HTTPS/TLS.
            </p>
          </Section>

          <Section title="9. Encarregado de dados (DPO)">
            <p>
              O encarregado pelo tratamento de dados pessoais da Cyber
              Informática é o responsável pelo canal de contato indicado
              abaixo, à disposição do titular e da ANPD para quaisquer
              questões relativas a esta Política e à LGPD.
            </p>
          </Section>

          <Section title="10. Contato" id="preferencias">
            <p>
              Para dúvidas, solicitações ou exercício de direitos relativos
              a dados pessoais:
            </p>
            <ul className="list-none mt-3 space-y-1">
              <li>
                <strong>E-mail</strong>:{' '}
                <a
                  href="mailto:contato@cyberinformatica.tech"
                  className="text-cyber-blue hover:text-circuit-green underline underline-offset-2"
                >
                  contato@cyberinformatica.tech
                </a>
              </li>
              <li>
                <strong>Telefone</strong>: (11) 95436-9269
              </li>
              <li>
                <strong>Endereço</strong>: mediante credenciamento (informado
                após aprovação de cadastro)
              </li>
            </ul>
          </Section>

          <Section title="11. Alterações desta política">
            <p>
              Esta Política pode ser revisada periodicamente. Alterações
              relevantes serão comunicadas por meio deste site. A versão
              vigente é identificada pela data de atualização indicada no
              topo do documento.
            </p>
          </Section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <Link href="/" className="text-cyber-blue hover:text-circuit-green font-medium">
            ← Voltar para a página inicial
          </Link>
        </div>
      </article>
    </main>
  );
}

function Header() {
  return (
    <header className="bg-navy-950 text-white border-b border-cyber-blue/15">
      <div className="container py-5 flex items-center justify-between">
        <Link href="/" aria-label="Página inicial">
          <img
            src="/logo-horizontal-header.png"
            alt="Cyber Informática"
            className="h-12 sm:h-14 w-auto"
          />
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-gray-300 hover:text-circuit-green transition-colors"
        >
          Voltar
        </Link>
      </div>
    </header>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-display text-xl sm:text-2xl font-semibold text-navy-900 mb-3 tracking-tight">
        {title}
      </h2>
      <div className="text-base">{children}</div>
    </section>
  );
}