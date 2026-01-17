
import React, { useMemo, useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Gauge,
  Wallet,
  Calendar,
  Filter,
  X,
  RefreshCcw
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line
} from 'recharts';
import { Faturamento, Despesa } from '../types';

interface DashboardProps {
  faturamentos: Faturamento[];
  despesas: Despesa[];
}

type Period = 'today' | '7days' | 'month' | 'custom' | 'all';

export const Dashboard: React.FC<DashboardProps> = ({ faturamentos, despesas }) => {
  const [period, setPeriod] = useState<Period>('month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Efeito para piscar o dashboard quando os dados mudarem
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [faturamentos, despesas]);

  const filteredData = useMemo(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    
    let start = new Date();
    let end = new Date(now);

    if (period === 'today') {
      start.setHours(0, 0, 0, 0);
    } else if (period === '7days') {
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
    } else if (period === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'custom' && customStart && customEnd) {
      start = new Date(customStart + 'T00:00:00');
      end = new Date(customEnd + 'T23:59:59');
    } else if (period === 'all') {
      start = new Date(0);
    }

    const fat = faturamentos.filter(f => {
      const d = new Date(f.data);
      return d >= start && d <= end;
    });
    
    const desp = despesas.filter(d => {
      const dt = new Date(d.data);
      return dt >= start && dt <= end;
    });

    return { fat, desp, start, end };
  }, [faturamentos, despesas, period, customStart, customEnd]);

  const stats = useMemo(() => {
    const totalFat = filteredData.fat.reduce((acc, curr) => acc + curr.valor, 0);
    const totalDesp = filteredData.desp.reduce((acc, curr) => acc + curr.valor, 0);
    return {
      totalFaturamento: totalFat,
      totalDespesas: totalDesp,
      lucro: totalFat - totalDesp
    };
  }, [filteredData]);

  const chartData = useMemo(() => {
    const dailyMap: Record<string, { date: string; faturamento: number; despesas: number }> = {};
    
    const start = new Date(filteredData.start);
    const end = new Date(filteredData.end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const daysToIterate = Math.min(diffDays, 60);

    for (let i = 0; i <= daysToIterate; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      dailyMap[dateStr] = { 
        date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), 
        faturamento: 0, 
        despesas: 0 
      };
    }

    filteredData.fat.forEach(f => {
      const dateStr = f.data.split('T')[0];
      if (dailyMap[dateStr]) dailyMap[dateStr].faturamento += f.valor;
    });

    filteredData.desp.forEach(d => {
      const dateStr = d.data.split('T')[0];
      if (dailyMap[dateStr]) dailyMap[dateStr].despesas += d.valor;
    });

    return Object.values(dailyMap);
  }, [filteredData]);

  return (
    <div className={`space-y-6 transition-all duration-700 ${isAnimating ? 'opacity-80 scale-[0.99]' : 'opacity-100 scale-100'}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Performance</h2>
            <p className="text-white/60 text-sm font-medium">Análise financeira em tempo real.</p>
          </div>
          {isAnimating && <RefreshCcw className="w-5 h-5 text-blue-500 animate-spin" />}
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3">
          {period === 'custom' && (
            <div className="flex items-center gap-2 glass p-2 rounded-2xl animate-in fade-in slide-in-from-right-4">
              <input 
                type="date" 
                className="bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase text-slate-800"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
              />
              <span className="text-slate-400 font-bold text-xs">ATÉ</span>
              <input 
                type="date" 
                className="bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase text-slate-800"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
              />
            </div>
          )}

          <div className="flex items-center gap-1 glass p-1.5 rounded-2xl shadow-xl overflow-x-auto no-scrollbar">
            {[
              { id: 'today', label: 'Hoje' },
              { id: '7days', label: '7 Dias' },
              { id: 'month', label: 'Mês' },
              { id: 'custom', label: 'Custom' },
              { id: 'all', label: 'Tudo' }
            ].map((p) => (
              <button 
                key={p.id}
                onClick={() => setPeriod(p.id as Period)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${period === p.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' : 'text-slate-600 hover:bg-white/50'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cards de estatísticas mantidos com a lógica de props reativas */}
        <div className="glass p-8 rounded-[2rem] border-white/40 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="text-slate-500 font-black text-xs uppercase tracking-widest">Entradas</span>
            <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-600 group-hover:rotate-12 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">
            R$ {stats.totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem] border-white/40 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="text-slate-500 font-black text-xs uppercase tracking-widest">Saídas</span>
            <div className="p-3 bg-red-600/10 rounded-2xl text-red-600 group-hover:rotate-12 transition-transform">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">
            R$ {stats.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="glass p-8 rounded-[2rem] border-blue-500/30 shadow-2xl relative overflow-hidden group bg-blue-600/5">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <span className="text-blue-900 font-black text-xs uppercase tracking-widest">Lucro Líquido</span>
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className={`text-4xl font-black tracking-tighter relative z-10 ${stats.lucro >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            R$ {stats.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="glass p-8 rounded-[2.5rem] border-white/40 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full" />
            Fluxo de Caixa Dinâmico
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full">
             <Calendar size={12} className="text-blue-600" />
             Atualizado Agora
          </div>
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
              <Line type="monotone" dataKey="faturamento" stroke="#2563eb" strokeWidth={5} dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} name="Entradas" />
              <Line type="monotone" dataKey="despesas" stroke="#f43f5e" strokeWidth={5} dot={{ r: 6, fill: '#f43f5e', strokeWidth: 3, stroke: '#fff' }} name="Saídas" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
