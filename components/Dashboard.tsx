
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

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 800);
    return () => clearTimeout(timer);
  }, [faturamentos, despesas]);

  const filteredData = useMemo(() => {
    // Normalização da data de hoje para comparação local
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    let start: Date;
    let end: Date = new Date();
    end.setHours(23, 59, 59, 999);

    if (period === 'today') {
      start = new Date();
      start.setHours(0, 0, 0, 0);
    } else if (period === '7days') {
      start = new Date();
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
    } else if (period === 'month') {
      // Início do mês atual (Local)
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    } else if (period === 'custom' && customStart && customEnd) {
      start = new Date(customStart + 'T00:00:00');
      end = new Date(customEnd + 'T23:59:59');
    } else {
      start = new Date(0); // All
    }

    const fat = faturamentos.filter(f => {
      const d = new Date(f.data);
      // Se for período 'today', comparamos apenas as strings da data YYYY-MM-DD
      if (period === 'today') {
        return d.toISOString().split('T')[0] === todayStr;
      }
      return d >= start && d <= end;
    });
    
    const desp = despesas.filter(d => {
      const dt = new Date(d.data);
      if (period === 'today') {
        return dt.toISOString().split('T')[0] === todayStr;
      }
      return dt >= start && dt <= end;
    });

    return { fat, desp, start, end };
  }, [faturamentos, despesas, period, customStart, customEnd]);

  const stats = useMemo(() => {
    const totalFat = filteredData.fat.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
    const totalDesp = filteredData.desp.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
    return {
      totalFaturamento: totalFat,
      totalDespesas: totalDesp,
      lucro: totalFat - totalDesp
    };
  }, [filteredData]);

  const chartData = useMemo(() => {
    const dailyMap: Record<string, { date: string; faturamento: number; despesas: number }> = {};
    
    // Gerar range de dias para o gráfico não ficar vazio
    const start = new Date(filteredData.start);
    const end = new Date(filteredData.end);
    
    // Se for "Tudo", limitamos aos últimos 30 dias para o gráfico ser legível
    if (period === 'all') {
      start.setDate(end.getDate() - 30);
    }

    const tempDate = new Date(start);
    while (tempDate <= end) {
      const dateStr = tempDate.toISOString().split('T')[0];
      dailyMap[dateStr] = { 
        date: tempDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), 
        faturamento: 0, 
        despesas: 0 
      };
      tempDate.setDate(tempDate.getDate() + 1);
    }

    filteredData.fat.forEach(f => {
      const dateStr = f.data.split('T')[0];
      if (dailyMap[dateStr]) dailyMap[dateStr].faturamento += (Number(f.valor) || 0);
    });

    filteredData.desp.forEach(d => {
      const dateStr = d.data.split('T')[0];
      if (dailyMap[dateStr]) dailyMap[dateStr].despesas += (Number(d.valor) || 0);
    });

    return Object.values(dailyMap);
  }, [filteredData, period]);

  return (
    <div className={`space-y-6 transition-all duration-500 ${isAnimating ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Performance</h2>
            <p className="text-white/60 text-sm font-medium">Análise financeira atualizada.</p>
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
            Fluxo de Caixa
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full">
             <Calendar size={12} className="text-blue-600" />
             Dados sincronizados
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
                formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, '']}
              />
              <Line type="monotone" dataKey="faturamento" stroke="#2563eb" strokeWidth={5} dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} name="Entradas" animationDuration={1000} />
              <Line type="monotone" dataKey="despesas" stroke="#f43f5e" strokeWidth={5} dot={{ r: 6, fill: '#f43f5e', strokeWidth: 3, stroke: '#fff' }} name="Saídas" animationDuration={1000} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
