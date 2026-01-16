
# Lava-jato Pro: Configuração de Acesso Global

Para que diferentes dispositivos acessem os mesmos dados, siga este guia rápido:

## 1. Criar Banco de Dados (Supabase)
1. Acesse [supabase.com](https://supabase.com) e crie um projeto gratuito.
2. Vá em **SQL Editor** e cole o script abaixo para criar as tabelas:

```sql
-- Tabela de Faturamento
CREATE TABLE faturamento (
  id TEXT PRIMARY KEY,
  tipoLavagem TEXT NOT NULL,
  porte TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  pagamento TEXT NOT NULL,
  data TIMESTAMPTZ NOT NULL
);

-- Tabela de Despesas
CREATE TABLE despesas (
  id TEXT PRIMARY KEY,
  valor NUMERIC NOT NULL,
  observacao TEXT,
  data TIMESTAMPTZ NOT NULL
);

-- Habilitar acesso público (apenas para este exemplo simplificado)
ALTER TABLE faturamento ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow All" ON faturamento FOR ALL USING (true);
ALTER TABLE despesas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow All" ON despesas FOR ALL USING (true);
```

## 2. Configurar na Vercel
Nas configurações do seu projeto na Vercel, adicione as **Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL`: Sua URL do projeto.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Sua chave Anon pública.

## 3. Pronto!
Ao recarregar o sistema, o ícone no canto inferior mudará para **"Nuvem Ativa"**. Agora, qualquer celular que abrir o link verá os mesmos carros e valores em tempo real.
