import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description:
    'Termos de Uso da Cyber Informática — condições de contratação dos serviços de laminação OCA / troca de vidro de displays para pessoa física e para lojistas (CNPJ).',
  alternates: {
    canonical: '/termos-de-uso',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const UPDATED_AT = '2026-07-17';

export default function TermosDeUsoPage() {
  return (
    <main className="bg-[#f5f8ff] min-h-screen">
      <Header />

      <article className="container max-w-4xl py-12 sm:py-16 lg:py-20">
        <div className="mb-10">
          <span className="inline-block font-mono text-xs text-cyber-blue uppercase tracking-widest mb-3">
            &#47;&#47; Documento Legal
          </span>
          <h1 className="text-display text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 tracking-tight mb-4">
            Termos de Uso
          </h1>
          <p className="text-sm text-gray-500">
            Última atualização: <strong>{UPDATED_AT}</strong> · Versão 1.1
          </p>
        </div>

        <div className="prose-legal space-y-8 text-gray-700 leading-relaxed">
          <Section title="1. Aceitação">
            <p>
              Ao acessar e utilizar este site da <strong>Cyber Informática</strong>
              {' '}(razão social{' '}
              <strong>Unidade de Engenharia de Componentes Eletrônicos S/A</strong>),
              o usuário declara ter lido, compreendido e aceito estes Termos
              de Uso e a{' '}
              <Link
                href="/politica-privacidade"
                className="text-cyber-blue hover:text-circuit-green underline underline-offset-2"
              >
                Política de Privacidade
              </Link>
              . Caso não concorde com qualquer disposição, o usuário deverá
              se abster de utilizar o site.
            </p>
          </Section>

          <Section title="2. Sobre o serviço">
            <p>
              A Cyber Informática oferece serviço de{' '}
              <strong>laminação OCA / troca de vidro de displays</strong>{' '}
              (recuperação do vidro externo de telas de smartphones, tablets e
              dispositivos correlatos, preservando o display original de fábrica).
              O serviço é destinado tanto ao{' '}
              <strong>consumidor final (pessoa física)</strong>, dono do
              aparelho, quanto a <strong>pessoas jurídicas (CNPJ)</strong> do
              ramo — em particular assistências técnicas e lojistas de tecnologia.
            </p>
            <p>
              A Cyber Informática é um{' '}
              <strong>laboratório independente de recuperação de displays</strong>
              {' '}e <strong>não é assistência técnica autorizada</strong> pela
              Apple, Samsung ou qualquer outro fabricante, não representando essas
              marcas nem administrando suas garantias oficiais de fábrica.
            </p>
            <p>
              Este site é informativo: a cotação e a contratação ocorrem por
              canais diretos de atendimento (WhatsApp), não havendo venda,
              cobrança ou processamento de pagamento online por meio do site.
            </p>
          </Section>

          <Section title="3. Formas de contratação">
            <p>
              <strong>Pessoa física (consumidor final):</strong> a contratação
              é direta, sem necessidade de credenciamento — o cliente solicita a
              cotação e combina o serviço pelos canais de atendimento (WhatsApp).
            </p>
            <p className="mt-3">
              <strong>Lojistas e assistências técnicas (CNPJ):</strong> para
              acesso às condições de parceria, o interessado deve solicitar
              credenciamento por meio do formulário de contato. O credenciamento
              está sujeito a:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mt-3">
              <li>Análise cadastral do CNPJ (até 24h úteis);</li>
              <li>
                Verificação de regularidade fiscal e idoneidade da atividade;
              </li>
              <li>Aceitação destes Termos e da Política de Privacidade;</li>
              <li>
                Eventual assinatura de contrato comercial específico para
                grandes volumes.
              </li>
            </ul>
            <p className="mt-3">
              A Cyber Informática reserva-se o direito de recusar o
              credenciamento sem necessidade de justificativa, especialmente
              em casos de CNPJ irregular, atividade divergente do ramo ou
              histórico de inadimplência.
            </p>
          </Section>

          <Section title="4. Obrigações do contratante">
            <p>
              Aplicam-se a todo contratante (pessoa física ou jurídica):
              fornecer informações verdadeiras sobre o aparelho e o serviço
              desejado, e, quando houver envio do dispositivo, embalá-lo de forma
              adequada e antichoque. As obrigações abaixo aplicam-se
              especialmente aos <strong>parceiros credenciados (CNPJ)</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mt-3">
              <li>
                Fornecer informações verdadeiras, completas e atualizadas no
                credenciamento.
              </li>
              <li>
                Embalar adequadamente os displays enviados, em embalagem
                antichoque compatível com transporte de componentes
                sensíveis.
              </li>
              <li>
                Enviar somente displays pertencentes a clientes finais
                próprios ou da carteira do parceiro — sendo vedada a
                intermediação de displays de terceiros não identificados.
              </li>
              <li>
                Cumprir as condições comerciais acordadas, especialmente
                prazos e formas de pagamento.
              </li>
              <li>
                Comunicar imediatamente qualquer alteração cadastral
                (razão social, endereço, responsáveis).
              </li>
            </ul>
          </Section>

          <Section title="5. Obrigações da Cyber Informática">
            <ul className="list-disc pl-6 space-y-1.5">
              <li>
                Processar os displays recebidos em ambiente controlado
                (sala limpa classe 1000) e com tecnologia OCA sob vácuo.
              </li>
              <li>
                Realizar controle de qualidade em cada etapa, com teste de
                touch, brilho e uniformidade.
              </li>
              <li>
                Devolver os displays processados em embalagem antichoque
                industrial, via transportadora ou motoboy autorizado.
              </li>
              <li>
                Conceder <strong>garantia de 90 (noventa) dias</strong>{' '}
                sobre o serviço de laminação executado.
              </li>
              <li>
                Tratar os dados pessoais fornecidos conforme a LGPD e a
                Política de Privacidade.
              </li>
            </ul>
          </Section>

          <Section title="6. Prazos e logística">
            <p>
              Os prazos informados no site (24h para análise de CNPJ, 24h
              para processamento de lotes) são contados em dias úteis e
              têm caráter referencial. Prazos definitivos são confirmados
              após o credenciamento e podem variar em função do volume do
              lote e da demanda da fila de produção.
            </p>
          </Section>

          <Section title="7. Garantia">
            <p>
              A Cyber Informática oferece <strong>garantia de 90 dias</strong>{' '}
              sobre o serviço de laminação OCA executado. A garantia cobre
              exclusivamente defeitos diretamente relacionados ao processo
              de laminação (descolamento, bolhas, perda de uniformidade).
            </p>
            <p>
              Não estão cobertos pela garantia: danos físicos posteriores à
              entrega, instalação inadequada pelo parceiro, exposição a
              calor excessivo, impacto ou contato com líquidos.
            </p>
          </Section>

          <Section title="8. Limitação de responsabilidade">
            <p>
              A Cyber Informática não se responsabiliza por perdas ou danos
              decorrentes de:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 mt-3">
              <li>
                Mau uso, instalação incorreta ou manuseio inadequado dos
                displays após a entrega.
              </li>
              <li>
                Danos ocorridos durante o transporte sob responsabilidade
                da transportadora (ressalvada a cobertura do seguro
                contratado).
              </li>
              <li>
                Indisponibilidade temporária do site por motivos de força
                maior, manutenção ou casos fortuitos.
              </li>
              <li>
                Ações de terceiros, incluindo ataques cibernéticos contra
                a infraestrutura do site.
              </li>
            </ul>
          </Section>

          <Section title="9. Propriedade intelectual">
            <p>
              O conteúdo próprio deste site — textos, logotipo da Cyber
              Informática, imagens, gráficos, código-fonte e layout — é de
              titularidade da Cyber Informática ou licenciado a ela, sendo
              protegido pela legislação brasileira de direitos autorais e
              propriedade industrial. É vedada a reprodução, distribuição ou
              modificação sem autorização prévia e por escrito.
            </p>
            <p>
              Nomes e marcas de terceiros eventualmente citados (por exemplo,
              Apple, iPhone, Samsung, Galaxy) são marcas registradas de seus
              respectivos titulares e são mencionados <strong>apenas para
              identificar os modelos de aparelho atendidos</strong>, não
              implicando qualquer vínculo, autorização, patrocínio ou
              afiliação com a Cyber Informática.
            </p>
          </Section>

          <Section title="10. Privacidade e proteção de dados">
            <p>
              O tratamento de dados pessoais decorrente do uso deste site e
              da prestação dos serviços é regido pela nossa{' '}
              <Link
                href="/politica-privacidade"
                className="text-cyber-blue hover:text-circuit-green underline underline-offset-2"
              >
                Política de Privacidade
              </Link>{' '}
              e pela Lei nº 13.709/2018 (LGPD).
            </p>
          </Section>

          <Section title="11. Alterações destes termos">
            <p>
              A Cyber Informática pode revisar estes Termos a qualquer
              tempo, mediante aviso neste site. Alterações relevantes
              serão comunicadas aos parceiros credenciados pelos canais
              de contato cadastrados.
            </p>
          </Section>

          <Section title="12. Foro">
            <p>
              Fica eleito o foro da Comarca de{' '}
              <strong>São Paulo/SP</strong> para dirimir quaisquer
              controvérsias oriundas destes Termos, com renúncia expressa
              a qualquer outro, por mais privilegiado que seja.
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
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-20">
      <h2 className="text-display text-xl sm:text-2xl font-semibold text-navy-900 mb-3 tracking-tight">
        {title}
      </h2>
      <div className="text-base">{children}</div>
    </section>
  );
}