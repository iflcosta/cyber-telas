'use client';

// ============================================
// Header — nav sticky com 6 itens + sub-bar de contexto B2B/B2C
// Inspirado no header do cyberinformatica.tech (cyber-tech)
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

const MAIN_SITE_URL = 'https://www.cyberinformatica.tech';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Bloqueia scroll do body quando drawer mobile tá aberto
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

  // Scrollspy — destaca seção ativa no nav
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const sections = NAV_ITEMS
      .filter((item) => item.href.startsWith('#'))
      .map((item) => document.getElementById(item.sectionId))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    if (typeof document !== 'undefined') {
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-950/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      {/* Linha gradient embaixo do header (efeito industrial) */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyber-blue to-circuit-green opacity-60" />

      {/* ============================================================
          Header principal — logo + nav + ações (estilo cyber-informatica.tech)
          ============================================================ */}
      <div className="container">
        <div className="flex items-center justify-between py-4 lg:py-5 gap-4 lg:gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0 min-w-0"
            aria-label="Cyber Informática — página inicial"
          >
            <img
              src="/logo-horizontal-header.png"
              alt="Cyber Informática"
              className="h-12 sm:h-14 lg:h-16 w-auto"
            />
          </Link>

          {/* Nav desktop (md+) — aparece em tablets/laptops comuns (>=768px) */}
          <nav aria-label="Navegação principal" className="nav-show-md items-center gap-0.5" style={{ minWidth: 0 }}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.sectionId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-circuit-green'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0.5 left-3 right-3 h-0.5 bg-circuit-green rounded-full transition-transform origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              );
            })}
            {/* Cross-link pro site principal */}
            <a
              href={MAIN_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 pl-4 border-l border-white/[0.08] px-3 py-2 text-sm font-medium text-circuit-green/80 hover:text-circuit-green transition-colors inline-flex items-center gap-1.5"
              aria-label="Loja física Cyber Informática — site principal"
            >
              <span className="w-1.5 h-1.5 bg-circuit-green rounded-full animate-pulse" />
              Loja física
              <span aria-hidden className="text-[10px]">↗</span>
            </a>
          </nav>

          {/* WhatsApp + hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <TrackedWhatsAppLink
              phone="5511954369269"
              message="Olá! Vim pelo site da laminação OCA e gostaria de um orçamento."
              source="header"
              className="inline-flex items-center gap-2 px-3 lg:px-4 py-2.5 min-h-[44px] bg-cyber-blue/10 border border-cyber-blue/30 text-white text-sm font-semibold rounded-full hover:bg-cyber-blue/20 hover:border-circuit-green transition-all whitespace-nowrap"
              ariaLabel="Chamar no WhatsApp da Cyber Informática"
            >
              <span className="w-2 h-2 bg-circuit-green rounded-full shadow-[0_0_8px_rgba(0,255,136,0.5)] animate-pulse-ring" />
              <Phone className="w-4 h-4 text-circuit-green" />
              <span className="hidden sm:inline">(11) 95436-9269</span>
            </TrackedWhatsAppLink>

            {/* Hamburger (só mobile, <md) */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="hamburger-show-mobile w-11 h-11 items-center justify-center bg-white/5 border border-white/10 rounded-md text-white hover:bg-white/10 hover:border-circuit-green transition-all"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
              aria-controls="mobile-drawer"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          Drawer mobile (até md-1, abaixo do header principal)
          ============================================================ */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="drawer-show-mobile fixed inset-0 top-[72px] sm:top-[80px] bg-black/60 backdrop-blur-sm z-40 animate-fade-up"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Painel */}
          <div
            id="mobile-drawer"
            className="drawer-show-mobile fixed inset-x-0 top-[72px] sm:top-[80px] z-40 bg-navy-950 border-b border-cyber-blue/30 animate-fade-up max-h-[calc(100vh-72px)] overflow-y-auto"
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
                <li>
                  <a
                    href={MAIN_SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-circuit-green hover:bg-circuit-green/10 rounded-lg inline-flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-circuit-green rounded-full animate-pulse" />
                    Loja física · PC, notebook e celular
                    <span aria-hidden className="text-xs">↗</span>
                  </a>
                </li>
              </ul>

              <div className="mt-4 pt-4 border-t border-white/[0.08]">
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
            </nav>
          </div>
        </>
      )}
    </header>
  );
}