-- SCRIPT DE CRIAÇÃO PARA SQLITE CLOUD
-- Você pode colar este código diretamente no painel 'SQL Editor' do SQLite Cloud
-- Ou usar para criar um arquivo .db localmente no DB Browser for SQLite.

-- Tabela de Faturamento (Lavagens)
CREATE TABLE IF NOT EXISTS faturamento (
    id TEXT PRIMARY KEY,
    tipoLavagem TEXT NOT NULL,
    porte TEXT NOT NULL,
    valor REAL NOT NULL,
    pagamento TEXT NOT NULL,
    data TEXT NOT NULL
);

-- Tabela de Despesas (Gastos)
CREATE TABLE IF NOT EXISTS despesas (
    id TEXT PRIMARY KEY,
    valor REAL NOT NULL,
    observacao TEXT,
    data TEXT NOT NULL
);

-- Indexação para performance de busca por data
CREATE INDEX IF NOT EXISTS idx_faturamento_data ON faturamento(data);
CREATE INDEX IF NOT EXISTS idx_despesas_data ON despesas(data);