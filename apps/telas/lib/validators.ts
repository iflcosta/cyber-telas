import type { Faixa } from './supabase-client';

// ============================================
// Validações de dados brasileiros
// ============================================

/**
 * Valida CNPJ brasileiro com dígitos verificadores
 * Aceita CNPJ com ou sem máscara
 */
export function validarCNPJ(cnpj: string): boolean {
  const cnpjLimpo = cnpj.replace(/\D/g, '');

  if (cnpjLimpo.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpjLimpo)) return false;

  let soma = 0;
  let peso = 5;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpjLimpo[i]) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  const digito1 = 11 - (soma % 11) >= 10 ? 0 : 11 - (soma % 11);
  if (parseInt(cnpjLimpo[12]) !== digito1) return false;

  soma = 0;
  peso = 6;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpjLimpo[i]) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  const digito2 = 11 - (soma % 11) >= 10 ? 0 : 11 - (soma % 11);
  // cnpjLimpo tem 14 chars (índices 0-13); [13] é o 14º char = segundo DV.
  // Antes era [14] (off-by-one) → sempre undefined → sempre false → 100% rejeitado.
  return parseInt(cnpjLimpo[13]) === digito2;
}

/**
 * Valida e-mail (regex + bloqueio de e-mails gratuitos)
 */
export function validarEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) return false;

  const emailsGratuitos = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'live.com', 'yahoo.com.br', 'bol.com.br', 'uol.com.br',
  ];
  const dominio = email.split('@')[1]?.toLowerCase();
  return !emailsGratuitos.includes(dominio);
}

/**
 * Valida telefone brasileiro (10 ou 11 dígitos com DDD)
 */
export function validarTelefone(telefone: string): boolean {
  const limpo = telefone.replace(/\D/g, '');
  return limpo.length >= 10 && limpo.length <= 11;
}

/**
 * Aplica máscara de CNPJ: 00.000.000/0001-00
 *
 * Aceita qualquer tamanho intermediário (0-14 dígitos) e formata incrementalmente.
 * Versão antiga tinha 3 bugs: regex com tamanho exato + `>` em vez de `>=` faziam
 * máscaras pularem em 6/9/13/14 chars. Resolvido com regex `{0,N}` flexíveis.
 */
export function maskCNPJ(value: string): string {
  const v = value.replace(/\D/g, '').slice(0, 14);
  if (v.length === 0) return '';
  // Usa regex com grupos de tamanho flexível (0-N) pra aceitar qualquer prefixo válido.
  return v.replace(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})$/, (_m, a, b, c, d, e) => {
    let out = a;
    if (b) out += `.${b}`;
    if (c) out += `.${c}`;
    if (d) out += `/${d}`;
    if (e) out += `-${e}`;
    return out;
  });
}

/**
 * Aplica máscara de telefone: (00) 00000-0000
 *
 * Aceita 0-11 dígitos e formata incrementalmente.
 * Versão antiga tinha 2 bugs: regex de tamanho exato + `$3` vazio deixava
 * um traço pendurado no meio da string.
 */
export function maskTelefone(value: string): string {
  const v = value.replace(/\D/g, '').slice(0, 11);
  if (v.length === 0) return '';
  return v.replace(/^(\d{0,2})(\d{0,5})(\d{0,4})$/, (_m, ddd, p1, p2) => {
    let out = '';
    // Só abre parêntese quando DDD tem 2 dígitos. Com 1 dígito, mostra cru
    // (assim `maskTelefone('1')` retorna `'1'`, não `'(1'`).
    if (ddd.length === 2) out += `(${ddd}) `;
    else out += ddd;
    if (p1) out += p1;
    if (p2) out += `-${p2}`;
    return out;
  });
}
