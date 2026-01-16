
import React, { useMemo, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Gauge,
  Wallet
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell
} from 'recharts';
import { Faturamento, Despesa } from '../types';

interface DashboardProps {
  faturamentos: Faturamento[];
  despesas: Despesa[];
}

export const Dashboard: React.FC<DashboardProps> = ({ faturamentos, despesas }) => {
  const [filterDays, setFilterDays] = useState(30);

  const stats = useMemo(() => {
    const totalFat = faturamentos.reduce((acc, curr) => acc + curr.valor, 0);
    const totalDesp = despesas.reduce((acc, curr) => acc + curr.valor, 0);
    return {
      totalFaturamento: totalFat,
      totalDespesas: totalDesp,
      lucro: totalFat - totalDesp
    };
  }, [faturamentos, despesas]);

  const chartData = useMemo(() => {
    const dailyMap: Record<string, { date: string; faturamento: number; despesas: number }> = {};
    
    for (let i = filterDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dailyMap[dateStr] = { date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), faturamento: 0, despesas: 0 };
    }

    faturamentos.forEach(f => {
      const dateStr = f.data.split('T')[0];
      if (dailyMap[dateStr]) dailyMap[dateStr].faturamento += f.valor;
    });

    despesas.forEach(d => {
      const dateStr = d.data.split('T')[0];
      if (dailyMap[dateStr]) dailyMap[dateStr].despesas += d.valor;
    });

    return Object.values(dailyMap);
  }, [faturamentos, despesas, filterDays]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Performance</h2>
          <p className="text-white/60 text-sm font-medium">Controle financeiro de alta precisão.</p>
        </div>
        
        <div className="flex items-center gap-1 glass p-1 rounded-2xl shadow-xl">
          <button 
            onClick={() => setFilterDays(7)}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${filterDays === 7 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-slate-600 hover:bg-white/50'}`}
          >
            7 dias
          </button>
          <button 
            onClick={() => setFilterDays(30)}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${filterDays === 30 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-slate-600 hover:bg-white/50'}`}
          >
            30 dias
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-[2rem] border-white/40 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="text-slate-500 font-black text-xs uppercase tracking-widest">Receita Bruta</span>
            <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">
            R$ {stats.totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 text-slate-900 group-hover:scale-125 transition-transform duration-700">
            <TrendingUp size={120} />
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem] border-white/40 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="text-slate-500 font-black text-xs uppercase tracking-widest">Saídas de Caixa</span>
            <div className="p-3 bg-red-600/10 rounded-2xl text-red-600 group-hover:scale-110 transition-transform">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">
            R$ {stats.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 text-slate-900 group-hover:scale-125 transition-transform duration-700">
            <Wallet size={120} />
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem] border-blue-500/30 shadow-2xl relative overflow-hidden group bg-blue-600/5">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="text-blue-900 font-black text-xs uppercase tracking-widest">Lucro Real</span>
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className={`text-4xl font-black tracking-tighter relative z-10 ${stats.lucro >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            R$ {stats.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 text-blue-600 group-hover:scale-125 transition-transform duration-700">
            <Gauge size={120} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass p-8 rounded-[2.5rem] border-white/40 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-600 rounded-full" />
              Monitoramento Diário
            </h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `R$${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '16px' }}
                  formatter={(value: any) => [`R$ ${value}`, '']}
                />
                <Line type="monotone" dataKey="faturamento" stroke="#2563eb" strokeWidth={5} dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} name="Entradas" />
                <Line type="monotone" dataKey="despesas" stroke="#f43f5e" strokeWidth={5} dot={{ r: 6, fill: '#f43f5e', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} name="Saídas" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-dark p-12 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
        <div className="text-center md:text-left">
          <p className="text-blue-500 font-black text-xs uppercase tracking-[0.3em] mb-4">Desenvolvimento de Sistemas</p>
          <h4 className="text-4xl font-black text-white italic tracking-tighter leading-none mb-2">João Layón</h4>
          <p className="text-slate-500 max-w-sm text-sm">Esta plataforma foi desenvolvida para oferecer o mais alto nível de controle e automação para o seu negócio.</p>
        </div>
        <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center min-w-[240px]">
           <Gauge size={64} className="text-blue-500 mx-auto mb-4 animate-pulse" />
           <p className="text-white font-black text-xl italic uppercase tracking-tighter">Lava-jato Pro</p>
           <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mt-1">Status: Online</p>
        </div>
      </div>
    </div>
  );
};
