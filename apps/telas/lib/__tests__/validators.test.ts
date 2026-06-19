import { validarCNPJ, validarEmail, validarTelefone, maskCNPJ, maskTelefone } from '../validators';

describe('validarCNPJ', () => {
  describe('CNPJs válidos (devem passar)', () => {
    // CNPJs gerados e validados com o próprio algoritmo de validators.ts
    // (gera base + DV1 + DV2 com o mesmo loop de pesos).
    // Validados em lib/__tests__/gerar-cnpjs-corretos.mjs antes de commit.
    const validos = [
      { input: '11.222.333/0001-81', desc: 'CNPJ canônico (exemplo conhecido)' },
      { input: '11222333000181', desc: 'mesmo CNPJ sem máscara' },
      { input: '05.814.109/0001-86', desc: 'CNPJ gerado pelo algoritmo do app' },
      { input: '50.624.413/0001-15', desc: 'CNPJ gerado pelo algoritmo do app' },
      { input: '12.071.305/0001-73', desc: 'CNPJ gerado pelo algoritmo do app' },
      { input: '98.596.282/0001-36', desc: 'CNPJ gerado pelo algoritmo do app' },
    ];

    test.each(validos)('$desc → deve validar $input', ({ input }) => {
      expect(validarCNPJ(input)).toBe(true);
    });
  });

  describe('CNPJs inválidos (devem falhar)', () => {
    const invalidos = [
      { input: '11.111.111/1111-11', desc: 'todos dígitos iguais (regex catch)' },
      { input: '00000000000000', desc: 'string de zeros' },
      { input: '11111111111111', desc: 'string de uns' },
      { input: '', desc: 'string vazia' },
      { input: '123', desc: 'muito curto' },
      { input: '11.222.333/0001-82', desc: 'DV2 errado (off-by-one reverso)' },
      { input: '11.222.333/0001-80', desc: 'DV1 errado' },
      { input: '11.222.333/0001-8', desc: 'falta 1 dígito (13 chars)' },
      { input: '11.222.333/0001-811', desc: 'dígito a mais (15 chars)' },
      { input: 'ab.cde.fgh/ijkl-mn', desc: 'letras no lugar de dígitos' },
    ];

    test.each(invalidos)('$desc → deve rejeitar $input', ({ input }) => {
      expect(validarCNPJ(input)).toBe(false);
    });
  });

  describe('Regressão: bug off-by-one do DV2', () => {
    // Em jun/2026, validarCNPJ tinha cnpjLimpo[14] no lugar de [13].
    // Como a string tem 14 chars, [14] é undefined → !== digito2 sempre true → retorna false.
    // Este teste fica aqui para garantir que isso nunca mais volte.
    test('CNPJ canônico 11.222.333/0001-81 passa (não cai no off-by-one)', () => {
      expect(validarCNPJ('11.222.333/0001-81')).toBe(true);
    });

    test('retorna true para CNPJ gerado pelo próprio algoritmo (sanity check)', () => {
      // Se este teste falhar com `received: false`, o off-by-one voltou.
      const fixture = '05.814.109/0001-86';
      const result = validarCNPJ(fixture);
      expect(result).toBe(true);
    });
  });
});

describe('validarEmail', () => {
  test('aceita e-mail corporativo normal', () => {
    expect(validarEmail('contato@cyberinformatica.tech')).toBe(true);
    expect(validarEmail('iago@empresa.com.br')).toBe(true);
  });

  test('rejeita e-mails gratuitos (gmail, hotmail, outlook, yahoo, etc.)', () => {
    expect(validarEmail('user@gmail.com')).toBe(false);
    expect(validarEmail('user@hotmail.com')).toBe(false);
    expect(validarEmail('user@outlook.com')).toBe(false);
    expect(validarEmail('user@yahoo.com.br')).toBe(false);
    expect(validarEmail('user@bol.com.br')).toBe(false);
    expect(validarEmail('user@uol.com.br')).toBe(false);
  });

  test('rejeita e-mail sem @', () => {
    expect(validarEmail('notanemail')).toBe(false);
  });

  test('rejeita e-mail sem domínio', () => {
    expect(validarEmail('user@')).toBe(false);
  });

  test('rejeita e-mail sem TLD', () => {
    expect(validarEmail('user@domain')).toBe(false);
  });
});

describe('validarTelefone', () => {
  test('aceita telefone com 10 dígitos (fixo)', () => {
    expect(validarTelefone('(11) 1234-5678')).toBe(true);
  });

  test('aceita telefone com 11 dígitos (celular)', () => {
    expect(validarTelefone('(11) 91234-5678')).toBe(true);
  });

  test('rejeita telefone com 9 dígitos (curto demais)', () => {
    expect(validarTelefone('12345-6789')).toBe(false);
  });

  test('rejeita telefone com 12+ dígitos (longo demais)', () => {
    expect(validarTelefone('(11) 991234-5678')).toBe(false);
  });
});

describe('maskCNPJ', () => {
  test('aplica máscara progressivamente conforme o usuário digita', () => {
    expect(maskCNPJ('4')).toBe('4');
    expect(maskCNPJ('42')).toBe('42');
    expect(maskCNPJ('421')).toBe('42.1');
    expect(maskCNPJ('4218')).toBe('42.18');
    expect(maskCNPJ('42189')).toBe('42.189');
    expect(maskCNPJ('421893')).toBe('42.189.3');
    expect(maskCNPJ('4218939')).toBe('42.189.39');
    expect(maskCNPJ('42189397')).toBe('42.189.397');
    expect(maskCNPJ('421893970')).toBe('42.189.397/0');
    expect(maskCNPJ('4218939700')).toBe('42.189.397/00');
    expect(maskCNPJ('42189397000')).toBe('42.189.397/000');
    expect(maskCNPJ('421893970001')).toBe('42.189.397/0001');
    expect(maskCNPJ('4218939700014')).toBe('42.189.397/0001-4');
    expect(maskCNPJ('42189397000148')).toBe('42.189.397/0001-48');
  });

  test('trunca em 14 dígitos (ignora o resto)', () => {
    expect(maskCNPJ('4218939700014899999')).toBe('42.189.397/0001-48');
  });

  test('remove caracteres não-numéricos antes de formatar', () => {
    expect(maskCNPJ('42.189.397/0001-48')).toBe('42.189.397/0001-48');
  });
});

describe('maskTelefone', () => {
  test('aplica máscara progressivamente', () => {
    expect(maskTelefone('1')).toBe('1');
    expect(maskTelefone('11')).toBe('(11) ');
    expect(maskTelefone('119')).toBe('(11) 9');
    expect(maskTelefone('1199')).toBe('(11) 99');
    expect(maskTelefone('1191234')).toBe('(11) 91234');
    expect(maskTelefone('11912345678')).toBe('(11) 91234-5678');
  });

  test('trunca em 11 dígitos', () => {
    expect(maskTelefone('119123456789999')).toBe('(11) 91234-5678');
  });
});
