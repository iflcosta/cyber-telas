'use client';

// ============================================
// Header — nav sticky com anchor links + drawer mobile
// Substitui o Topbar inline do page.tsx.
// ============================================

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import TrackedWhatsAppLink from './TrackedWhatsAppLink';

type NavItem = {
  href: string;
  label: string;
  /** id da seção correspondente (sem #) — usada pelo IntersectionObserver */
  sectionId: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: '#credentials', label: 'Credenciais', sectionId: 'credentials' },
  { href: '#advantages', label: 'Vantagens', sectionId: 'advantages' },
  { href: '#logistics', label: 'Logística', sectionId: 'logistics' },
  { href: '#pricing', label: 'Preços', sectionId: 'pricing' },
  { href: '#cotacao', label: 'Cotação', sectionId: 'cotacao' },
  { href: '#form-section', label: 'Credenciamento', sectionId: 'form-section' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Fecha o drawer ao redimensionar pra desktop.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Bloqueia scroll do body quando drawer mobile tá aberto.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Destaca o link da seção atualmente visível (desktop apenas).
  // Mobile não tem nav visível, então não precisa.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const sections = NAV_ITEMS
      .map((item) => document.getElementById(item.sectionId))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Pega a seção mais visível no viewport
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-30% 0px -50% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    // O scroll-behavior: smooth no globals.css já cuida da animação.
    if (typeof document !== 'undefined') {
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // Pequeno delay pra deixar o drawer fechar antes do scroll
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[rgba(5,10,20,0.85)] backdrop-blur-xl border-b border-cyber-blue/15">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-blue to-circuit-green opacity-50" />

      {/* ============================================================
          Sub-bar acima do header — contexto de persona (B2B + B2C)
          Facilita a navegação deixando claro pra quem é cada caminho.
          Mobile: mostra só os 2 atalhos. Desktop: horário também.
          ============================================================ */}
      <div className="bg-cyber-blue/[0.06] border-b border-cyber-blue/15">
        <div className="container">
          <div className="flex items-center justify-between h-9 text-[11px] sm:text-xs">
            <div className="flex items-center gap-3 sm:gap-5 text-gray-400">
              <span className="hidden sm:inline-flex items-center gap-1.5">
                <span className="w-1 h-1 bg-circuit-green rounded-full shadow-[0_0_6px_rgba(0,255,136,0.5)]" />
                Atendimento ativo
              </span>
              <a
                href="#form-section"
                onClick={(e) => { e.preventDefault(); handleNavClick('#form-section'); }}
                className="inline-flex items-center gap-1.5 text-gray-200 hover:text-circuit-green transition-colors font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyber-blue-light">
                  <path d="M3 7h18M3 12h18M3 17h18"/>
                </svg>
                <span>Lojistas e Assistências</span>
              </a>
              <span className="hidden sm:inline text-white/15">·</span>
              <TrackedWhatsAppLink
                phone="5511954369269"
                message="Olá! Vim do site e sou pessoa física. Quero cotar laminação OCA para o meu aparelho."
                source="header_pf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-gray-300 hover:text-circuit-green transition-colors"
                ariaLabel="WhatsApp pessoa física"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-circuit-green">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <span>Pessoa Física</span>
              </TrackedWhatsAppLink>
            </div>
            <div className="hidden md:flex items-center gap-4 text-gray-500">
              <span>Seg-Sex · 08h às 18h</span>
              <span className="text-white/15">·</span>
              <a href="mailto:contato@cyberinformatica.tech" className="hover:text-circuit-green transition-colors">
                contato@cyberinformatica.tech
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="flex items-center justify-between py-3 lg:py-4 gap-4 lg:gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0 min-w-0"
            aria-label="Cyber Informática — página inicial"
          >
            <img
              src="/logo-horizontal-header.png"
              alt="Cyber Informática"
              className="h-12 sm:h-16 lg:h-20 w-auto"
            />
          </Link>

          {/* Nav desktop (lg+) */}
          <nav aria-label="Navegação principal" className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.sectionId;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                        isActive
                          ? 'text-circuit-green bg-circuit-green/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Telefone (sempre visível) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="tel:+5511954369269"
              className="inline-flex items-center gap-2 px-3 lg:px-4 py-2 bg-cyber-blue/8 border border-cyber-blue/25 text-white text-sm font-semibold rounded-full hover:bg-cyber-blue/15 hover:border-circuit-green transition-all whitespace-nowrap"
              aria-label="Ligar para Cyber Informática"
            >
              <span className="w-2 h-2 bg-circuit-green rounded-full shadow-[0_0_8px_rgba(0,255,136,0.5)] animate-pulse-ring" />
              <Phone className="w-4 h-4 text-circuit-green" />
              <span className="hidden sm:inline">(11) 95436-9269</span>
            </a>

            {/* Hamburger (mobile apenas) */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden w-10 h-10 inline-flex items-center justify-center bg-white/5 border border-white/10 rounded-md text-white hover:bg-white/10 hover:border-circuit-green transition-all"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
              aria-controls="mobile-drawer"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer mobile */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 top-[108px] sm:top-[124px] bg-black/60 backdrop-blur-sm z-40 animate-fade-up"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Painel */}
          <div
            id="mobile-drawer"
            className="lg:hidden fixed inset-x-0 top-[108px] sm:top-[124px] z-40 bg-navy-950 border-b border-cyber-blue/30 animate-fade-up"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
          >
            <nav className="container py-4">
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.sectionId;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.href);
                        }}
                        className={`block px-4 py-3 text-base font-medium rounded-lg transition-all ${
                          isActive
                            ? 'text-circuit-green bg-circuit-green/10 border-l-2 border-circuit-green'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 pt-4 border-t border-white/8">
                <TrackedWhatsAppLink
                  phone="5511954369269"
                  message="Olá! Vim do site e quero saber mais sobre credenciamento."
                  source="header_credenciamento"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center text-sm"
                  ariaLabel="Falar no WhatsApp sobre credenciamento"
                >
                  Falar no WhatsApp
                </TrackedWhatsAppLink>
              </div>

              {/* Cross-link pro site principal */}
              <div className="mt-3 pt-3 border-t border-white/8">
                <a
                  href="https://www.cyberinformatica.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block w-full px-4 py-3 text-sm text-gray-400 hover:text-circuit-green transition-colors text-center"
                >
                  ← Loja física · PC, notebook e celular
                </a>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}