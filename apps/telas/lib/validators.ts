import type { Faixa } from './supabase';

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
  return parseInt(cnpjLimpo[14]) === digito2;
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
 */
export function maskCNPJ(value: string): string {
  let v = value.replace(/\D/g, '').slice(0, 14);
  if (v.length > 12) v = v.replace(/^(\d{2})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4');
  else if (v.length > 8) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4})$/, '$1.$2.$3/$4');
  else if (v.length > 5) v = v.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3');
  else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,3})$/, '$1.$2');
  return v;
}

/**
 * Aplica máscara de telefone: (00) 00000-0000
 */
export function maskTelefone(value: string): string {
  let v = value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) v = v.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
  else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
  return v;
}
