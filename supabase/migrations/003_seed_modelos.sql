-- ============================================
-- Migration 003: Seed Inicial
-- Cyber Informática - B2B Laminação OCA
-- ============================================
-- Como executar:
-- 1. Abra Supabase Dashboard
-- 2. Vá em SQL Editor → New Query
-- 3. Cole TODO este arquivo
-- 4. Clique RUN (Ctrl+Enter)
-- ============================================

-- Tabela de faixas de preço
insert into public.configuracao_precos (id, ativo, faixas) values (
  1,
  true,
  '[
    {"min": 0, "max": 500, "preco": 80, "label": "Econômico"},
    {"min": 500, "max": 1000, "preco": 120, "label": "Intermediário"},
    {"min": 1000, "max": 2000, "preco": 180, "label": "Premium"},
    {"min": 2000, "max": 3500, "preco": 250, "label": "Top"},
    {"min": 3500, "max": 999999, "preco": 320, "label": "Flagship"}
  ]'::jsonb
) on conflict (id) do nothing;

-- Catálogo de modelos (50+ dispositivos)
insert into public.modelos_preco (marca, modelo, valor_display_novo) values
  -- Apple
  ('apple', 'iPhone 15 Pro Max', 5400.00),
  ('apple', 'iPhone 15 Pro', 4400.00),
  ('apple', 'iPhone 15 Plus', 3800.00),
  ('apple', 'iPhone 15', 3200.00),
  ('apple', 'iPhone 14 Pro Max', 4200.00),
  ('apple', 'iPhone 14 Pro', 3500.00),
  ('apple', 'iPhone 14 Plus', 2900.00),
  ('apple', 'iPhone 14', 2400.00),
  ('apple', 'iPhone 13 Pro Max', 3200.00),
  ('apple', 'iPhone 13 Pro', 2700.00),
  ('apple', 'iPhone 13', 1900.00),
  ('apple', 'iPhone 13 mini', 1700.00),
  ('apple', 'iPhone 12 Pro Max', 2500.00),
  ('apple', 'iPhone 12 Pro', 2100.00),
  ('apple', 'iPhone 12', 1500.00),
  ('apple', 'iPhone 12 mini', 1300.00),
  ('apple', 'iPhone 11 Pro Max', 1800.00),
  ('apple', 'iPhone 11 Pro', 1500.00),
  ('apple', 'iPhone 11', 1100.00),
  ('apple', 'iPhone SE (3ª geração)', 900.00),
  ('apple', 'iPhone SE (2ª geração)', 600.00),
  ('apple', 'iPhone XR', 700.00),
  ('apple', 'iPhone XS Max', 900.00),
  -- Samsung
  ('samsung', 'Galaxy S24 Ultra', 4800.00),
  ('samsung', 'Galaxy S24+', 3500.00),
  ('samsung', 'Galaxy S24', 2700.00),
  ('samsung', 'Galaxy S23 Ultra', 3800.00),
  ('samsung', 'Galaxy S23+', 2800.00),
  ('samsung', 'Galaxy S23', 2100.00),
  ('samsung', 'Galaxy S22 Ultra', 3000.00),
  ('samsung', 'Galaxy S22+', 2200.00),
  ('samsung', 'Galaxy S22', 1700.00),
  ('samsung', 'Galaxy S21 Ultra', 2500.00),
  ('samsung', 'Galaxy S21+', 1800.00),
  ('samsung', 'Galaxy S21', 1400.00),
  ('samsung', 'Galaxy A55', 900.00),
  ('samsung', 'Galaxy A35', 700.00),
  ('samsung', 'Galaxy A15', 500.00),
  ('samsung', 'Galaxy Z Fold 5', 4200.00),
  ('samsung', 'Galaxy Z Flip 5', 2800.00),
  -- Xiaomi
  ('xiaomi', 'Xiaomi 14 Pro', 2800.00),
  ('xiaomi', 'Xiaomi 14', 2100.00),
  ('xiaomi', 'Xiaomi 13T Pro', 1700.00),
  ('xiaomi', 'Redmi Note 13 Pro', 800.00),
  ('xiaomi', 'Redmi Note 12', 500.00),
  ('xiaomi', 'Poco X6 Pro', 900.00),
  ('xiaomi', 'Poco F6 Pro', 1600.00),
  -- Motorola
  ('motorola', 'Edge 50 Pro', 1600.00),
  ('motorola', 'Edge 40 Neo', 1100.00),
  ('motorola', 'Moto G84', 700.00),
  ('motorola', 'Moto G54', 500.00),
  ('motorola', 'Moto G24', 400.00),
  ('motorola', 'Razr 40 Ultra', 3200.00),
  ('motorola', 'Razr 40', 2200.00)
on conflict (marca, modelo) do nothing;
