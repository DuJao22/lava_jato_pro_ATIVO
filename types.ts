
export enum CarSize {
  SMALL = 'Pequeno',
  MEDIUM = 'Médio',
  LARGE = 'Grande'
}

export enum PaymentMethod {
  DINHEIRO = 'Dinheiro',
  CARTAO = 'Cartão',
  PIX = 'Pix'
}

export interface Faturamento {
  id: string;
  tipoLavagem: string;
  porte: CarSize;
  valor: number;
  pagamento: PaymentMethod;
  data: string; // ISO string contendo data e hora
}

export interface Despesa {
  id: string;
  valor: number;
  observacao: string;
  data: string;
}

export interface FinancialSummary {
  totalFaturamento: number;
  totalDespesas: number;
  lucro: number;
}
