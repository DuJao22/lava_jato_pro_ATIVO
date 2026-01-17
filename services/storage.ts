import { Database } from '@sqlitecloud/drivers';
import { Faturamento, Despesa } from '../types';

/**
 * IMPORTANTE: No Render/Vite, variáveis de ambiente para o front-end 
 * devem começar com VITE_. Ex: VITE_SQLITE_CLOUD_CONNECTION_STRING
 */
const CONNECTION_STRING = (import.meta as any).env?.VITE_SQLITE_CLOUD_CONNECTION_STRING || "";

const FATURAMENTO_KEY = 'lavajato_faturamento_v4';
const DESPESAS_KEY = 'lavajato_despesas_v4';

let db: any = null;

if (CONNECTION_STRING) {
  try {
    db = new Database(CONNECTION_STRING);
    console.log("Conectado ao SQLite Cloud");
  } catch (e) {
    console.error("Erro ao inicializar SQLite Cloud:", e);
  }
}

export const storage = {
  isCloud: () => !!CONNECTION_STRING && !!db,

  getFaturamento: async (): Promise<Faturamento[]> => {
    if (db) {
      try {
        const results = await db.sql`SELECT * FROM faturamento ORDER BY data DESC`;
        // SQLite Cloud retorna um array de objetos
        return results || [];
      } catch (e) {
        console.error("Erro ao buscar faturamento no Cloud:", e);
      }
    }
    const local = localStorage.getItem(FATURAMENTO_KEY);
    return local ? JSON.parse(local) : [];
  },

  saveFaturamento: async (items: Faturamento[], lastItem?: Faturamento, isDelete?: boolean): Promise<void> => {
    // Sempre salva no local como backup/cache
    localStorage.setItem(FATURAMENTO_KEY, JSON.stringify(items));
    
    if (db && lastItem) {
      try {
        if (isDelete) {
          await db.sql`DELETE FROM faturamento WHERE id = ${lastItem.id}`;
        } else {
          await db.sql`
            INSERT OR REPLACE INTO faturamento (id, tipoLavagem, porte, valor, pagamento, data)
            VALUES (${lastItem.id}, ${lastItem.tipoLavagem}, ${lastItem.porte}, ${lastItem.valor}, ${lastItem.pagamento}, ${lastItem.data})
          `;
        }
      } catch (e) {
        console.error("Erro ao persistir faturamento no Cloud:", e);
      }
    }
  },

  getDespesas: async (): Promise<Despesa[]> => {
    if (db) {
      try {
        const results = await db.sql`SELECT * FROM despesas ORDER BY data DESC`;
        return results || [];
      } catch (e) {
        console.error("Erro ao buscar despesas no Cloud:", e);
      }
    }
    const local = localStorage.getItem(DESPESAS_KEY);
    return local ? JSON.parse(local) : [];
  },

  saveDespesas: async (items: Despesa[], lastItem?: Despesa, isDelete?: boolean): Promise<void> => {
    localStorage.setItem(DESPESAS_KEY, JSON.stringify(items));
    
    if (db && lastItem) {
      try {
        if (isDelete) {
          await db.sql`DELETE FROM despesas WHERE id = ${lastItem.id}`;
        } else {
          await db.sql`
            INSERT OR REPLACE INTO despesas (id, valor, observacao, data)
            VALUES (${lastItem.id}, ${lastItem.valor}, ${lastItem.observacao}, ${lastItem.data})
          `;
        }
      } catch (e) {
        console.error("Erro ao persistir despesa no Cloud:", e);
      }
    }
  }
};