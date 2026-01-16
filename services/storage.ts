
import { createClient } from '@supabase/supabase-js';
import { Faturamento, Despesa } from '../types';

// Credenciais (Devem ser configuradas no painel da Vercel/Supabase)
const SUPABASE_URL = (window as any).process?.env?.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (window as any).process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isCloudEnabled = SUPABASE_URL && SUPABASE_ANON_KEY;
const supabase = isCloudEnabled ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const FATURAMENTO_KEY = 'lavajato_faturamento_v3';
const DESPESAS_KEY = 'lavajato_despesas_v3';

export const storage = {
  isCloud: () => !!isCloudEnabled,

  getFaturamento: async (): Promise<Faturamento[]> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('faturamento')
        .select('*')
        .order('data', { ascending: false });
      if (!error) return data || [];
      console.error('Erro Supabase:', error);
    }
    const local = localStorage.getItem(FATURAMENTO_KEY);
    return local ? JSON.parse(local) : [];
  },

  saveFaturamento: async (items: Faturamento[], lastItem?: Faturamento, isDelete?: boolean): Promise<void> => {
    localStorage.setItem(FATURAMENTO_KEY, JSON.stringify(items));
    if (supabase && lastItem) {
      if (isDelete) {
        await supabase.from('faturamento').delete().eq('id', lastItem.id);
      } else {
        await supabase.from('faturamento').upsert(lastItem);
      }
    }
  },

  getDespesas: async (): Promise<Despesa[]> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('despesas')
        .select('*')
        .order('data', { ascending: false });
      if (!error) return data || [];
      console.error('Erro Supabase:', error);
    }
    const local = localStorage.getItem(DESPESAS_KEY);
    return local ? JSON.parse(local) : [];
  },

  saveDespesas: async (items: Despesa[], lastItem?: Despesa, isDelete?: boolean): Promise<void> => {
    localStorage.setItem(DESPESAS_KEY, JSON.stringify(items));
    if (supabase && lastItem) {
      if (isDelete) {
        await supabase.from('despesas').delete().eq('id', lastItem.id);
      } else {
        await supabase.from('despesas').upsert(lastItem);
      }
    }
  }
};
