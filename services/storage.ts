
import { Faturamento, Despesa, CarSize, PaymentMethod } from '../types';

const FATURAMENTO_KEY = 'lavajato_faturamento_v2';
const DESPESAS_KEY = 'lavajato_despesas_v2';

const MOCK_FATURAMENTO: Faturamento[] = [
  { 
    id: '1', 
    tipoLavagem: 'Lavagem Completa', 
    porte: CarSize.MEDIUM, 
    valor: 70, 
    pagamento: PaymentMethod.PIX, 
    data: new Date().toISOString() 
  },
  { 
    id: '2', 
    tipoLavagem: 'Ducha Rápida', 
    porte: CarSize.SMALL, 
    valor: 35, 
    pagamento: PaymentMethod.DINHEIRO, 
    data: new Date().toISOString() 
  },
];

const MOCK_DESPESAS: Despesa[] = [
  { id: '1', valor: 50.00, observacao: 'Compra de produtos (shampoo e cera)', data: new Date().toISOString() },
];

export const storage = {
  getFaturamento: (): Faturamento[] => {
    const data = localStorage.getItem(FATURAMENTO_KEY);
    return data ? JSON.parse(data) : MOCK_FATURAMENTO;
  },
  saveFaturamento: (items: Faturamento[]) => {
    localStorage.setItem(FATURAMENTO_KEY, JSON.stringify(items));
  },
  getDespesas: (): Despesa[] => {
    const data = localStorage.getItem(DESPESAS_KEY);
    return data ? JSON.parse(data) : MOCK_DESPESAS;
  },
  saveDespesas: (items: Despesa[]) => {
    localStorage.setItem(DESPESAS_KEY, JSON.stringify(items));
  }
};
