
# 🚀 Manual de Deploy: Lava-jato Pro (Render.com)

Este guia explica como colocar seu sistema online gratuitamente no **Render**.

## 1. Preparação dos Dados (Supabase)
Antes de subir o código, seu banco de dados precisa estar pronto.
1. Crie uma conta em [supabase.com](https://supabase.com).
2. No **SQL Editor**, execute:

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

-- Políticas de Acesso (RLS)
ALTER TABLE faturamento ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow All" ON faturamento FOR ALL USING (true);
ALTER TABLE despesas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow All" ON despesas FOR ALL USING (true);
```

## 2. Deploy no Render
1. Crie uma conta em [render.com](https://render.com).
2. Clique em **New +** e selecione **Static Site**.
3. Conecte seu repositório do GitHub.
4. Configure os campos de Build:
   - **Name**: `lava-jato-pro`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` (Isso é muito importante!)

## 3. Variáveis de Ambiente
No painel do Render, vá na aba **Environment** e adicione:
1. `NEXT_PUBLIC_SUPABASE_URL` = (Sua URL do Supabase)
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Sua Anon Key do Supabase)

## 4. Por que usar o Render?
- **Auto-deploy**: Sempre que você salvar o código no GitHub, o Render atualiza o site sozinho.
- **SSL Grátis**: Seu site terá `https://` automaticamente.
- **Performance**: CDN global para carregamento rápido em qualquer lugar.

---
*Sistema desenvolvido por João Layón*
