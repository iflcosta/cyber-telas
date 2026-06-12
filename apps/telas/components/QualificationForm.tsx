'use client';

import { useState } from 'react';
import { validarCNPJ, validarEmail, validarTelefone, maskCNPJ, maskTelefone } from '@/lib/validators';
import { createBrowserSupabaseClient } from '@/lib/supabase-client';
import { calcularPreco, FAIXAS_PADRAO } from '@/lib/pricing';
import { Phone } from 'lucide-react';

export default function QualificationForm() {
  const supabase = createBrowserSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cotacaoFinal, setCotacaoFinal] = useState<{ preco: number; faixa: string } | null>(null);

  const [form, setForm] = useState({
    razao_social: '',
    cnpj: '',
    email: '',
    telefone: '',
    volume_semanal: '',
    marca: '' as 'apple' | 'samsung' | 'xiaomi' | 'motorola' | 'outros' | '',
    modelo_display: '',
    valor_display_novo: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!validarCNPJ(form.cnpj)) {
      setError('CNPJ inválido');
      return;
    }
    if (!validarEmail(form.email)) {
      setError('E-mail corporativo inválido (use domínio da empresa)');
      return;
    }
    if (!validarTelefone(form.telefone)) {
      setError('Telefone inválido');
      return;
    }
    if (!form.volume_semanal || !form.marca || !form.modelo_display || !form.valor_display_novo) {
      setError('Preencha todos os campos do calculador de preço');
      return;
    }

    const valor = parseFloat(form.valor_display_novo);
    const { preco, faixa } = calcularPreco(valor, FAIXAS_PADRAO);

    setLoading(true);
    try {
      if (!supabase) {
        setError('Sistema temporariamente indisponível. Tente novamente em alguns minutos.');
        setLoading(false);
        return;
      }

      const { error: dbError } = await supabase.from('leads').insert({
        razao_social: form.razao_social,
        cnpj: form.cnpj.replace(/\D/g, ''),
        email: form.email,
        telefone: form.telefone,
        volume_semanal: form.volume_semanal,
        marca: form.marca,
        modelo_display: form.modelo_display,
        valor_display_novo: valor,
        preco_servico: preco,
        faixa_aplicada: faixa.label,
      });

      if (dbError) {
        if (dbError.code === '23505') {
          setError('CNPJ já cadastrado em nossa base');
        } else {
          setError('Erro ao enviar. Tente novamente.');
        }
        setLoading(false);
        return;
      }

      setCotacaoFinal({ preco, faixa: faixa.label });
      setSuccess(true);
    } catch (err) {
      setError('Erro de conexão. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  };

  if (success && cotacaoFinal) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-circuit-green to-circuit-green-dark rounded-full flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(0,255,136,0.4)]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-10 h-10 text-navy-950">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-display text-2xl font-bold mb-3">Cadastro Enviado!</h3>
        <p className="text-gray-300 mb-2">
          A equipe da <strong>Cyber Informática</strong> entrará em contato em até 24h úteis.
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Preço cotado: <strong className="text-circuit-green">R$ {cotacaoFinal.preco.toFixed(2)}</strong> ({cotacaoFinal.faixa})
        </p>
        <a
          href={`https://wa.me/5511954369269?text=${encodeURIComponent('Olá! Acabei de preencher o formulário de credenciamento no site e gostaria de dar continuidade ao processo.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full justify-center"
        >
          <Phone className="w-5 h-5" />
          Continuar no WhatsApp Business
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Razão Social <span className="required">*</span></label>
        <input
          type="text"
          required
          placeholder="Nome empresarial completo"
          className="form-input"
          value={form.razao_social}
          onChange={(e) => handleChange('razao_social', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="form-label">CNPJ <span className="required">*</span></label>
          <input
            type="text"
            required
            placeholder="00.000.000/0001-00"
            className="form-input"
            value={form.cnpj}
            onChange={(e) => handleChange('cnpj', maskCNPJ(e.target.value))}
            maxLength={18}
          />
        </div>

        <div>
          <label className="form-label">Telefone Corporativo <span className="required">*</span></label>
          <input
            type="tel"
            required
            placeholder="(00) 00000-0000"
            className="form-input"
            value={form.telefone}
            onChange={(e) => handleChange('telefone', maskTelefone(e.target.value))}
            maxLength={15}
          />
        </div>
      </div>

      <div>
        <label className="form-label">E-mail Corporativo <span className="required">*</span></label>
        <input
          type="email"
          required
          placeholder="seuemail@empresa.com.br"
          className="form-input"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </div>

      <div>
        <label className="form-label">Volume Médio de Telas Semanais <span className="required">*</span></label>
        <select
          required
          className="form-select"
          value={form.volume_semanal}
          onChange={(e) => handleChange('volume_semanal', e.target.value)}
        >
          <option value="">Selecione uma faixa</option>
          <option value="1-10">1 a 10 telas por semana</option>
          <option value="11-50">11 a 50 telas por semana</option>
          <option value="51-100">51 a 100 telas por semana</option>
          <option value="101-500">101 a 500 telas por semana</option>
          <option value="500+">Acima de 500 telas por semana</option>
        </select>
      </div>

      <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
        <div className="text-xs text-gray-400 mb-3">
          <strong className="text-circuit-green">Cotação rápida:</strong> selecione marca + modelo
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select
            required
            className="form-select"
            value={form.marca}
            onChange={(e) => handleChange('marca', e.target.value)}
          >
            <option value="">Marca</option>
            <option value="apple">Apple</option>
            <option value="samsung">Samsung</option>
            <option value="xiaomi">Xiaomi</option>
            <option value="motorola">Motorola</option>
            <option value="outros">Outros</option>
          </select>
          <input
            type="text"
            required
            placeholder="Modelo (ex: iPhone 15 Pro Max)"
            className="form-input sm:col-span-2"
            value={form.modelo_display}
            onChange={(e) => handleChange('modelo_display', e.target.value)}
          />
        </div>
        <input
          type="number"
          required
          step="0.01"
          placeholder="Valor do display novo (R$)"
          className="form-input mt-2"
          value={form.valor_display_novo}
          onChange={(e) => handleChange('valor_display_novo', e.target.value)}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-submit"
      >
        {loading ? (
          <>
            <span>Enviando...</span>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </>
        ) : (
          <>
            <span>Solicitar Credenciamento</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
