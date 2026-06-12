'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';

type RevealTag = 'div' | 'article' | 'section' | 'span' | 'li';

interface ScrollRevealProps {
  children: ReactNode;
  /** Atraso em camadas (0-4). Mapeia para `.reveal-delay-N` em globals.css. */
  delay?: 0 | 1 | 2 | 3 | 4;
  /** Classes extras a mesclar com `reveal` / `is-visible`. */
  className?: string;
  /** Tag HTML renderizada. Padrão: `div`. */
  as?: RevealTag;
  /** Estilos inline extras (ex.: transitionDelay por índice). */
  style?: CSSProperties;
  /**
   * Se true, considera visível desde a primeira renderização.
   * Use para o primeiro bloco da página (above the fold) para evitar
   * flash de conteúdo oculto em initial paint.
   */
  immediate?: boolean;
}

/**
 * Wrapper de scroll reveal baseado em IntersectionObserver.
 *
 * Resolve o bug onde `.reveal` aplicava `opacity-0` mas nenhum JS
 * adicionava `is-visible`, deixando ~17 elementos invisíveis.
 *
 * - Unobserve após primeiro reveal (zero custo após ativar).
 * - Fallback gracioso: se `IntersectionObserver` não existir (SSR/legado),
 *   revela imediatamente para não bloquear o conteúdo.
 * - Respeita `prefers-reduced-motion` herdado do CSS (sem JS extra).
 */
export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
  style,
  immediate = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) return;

    const el = ref.current;
    if (!el) return;

    // Fallback: sem IntersectionObserver (SSR/ambientes restritos) → revela já
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.1,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  const delayClass = delay > 0 ? ` reveal-delay-${delay}` : '';
  const visibilityClass = visible ? ' is-visible' : '';
  const combinedClassName = `reveal${visibilityClass}${delayClass}${className ? ` ${className}` : ''}`;

  // `ref` é tipado como HTMLElement genérico; o cast em `as any` é o padrão
  // aceito pela comunidade para refs polimórficos em React 18.
  return (
    <Tag ref={ref as never} className={combinedClassName} style={style}>
      {children}
    </Tag>
  );
}
