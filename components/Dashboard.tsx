
import React, { useMemo, useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  RefreshCcw,
  LayoutDashboard
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Faturamento, Despesa } from '../types';

interface DashboardProps {
  faturamentos: Faturamento[];
  despesas: Despesa[];
}

type Period = 'today' | '7days' | 'month' | 'all';

export const Dashboard: React.FC<DashboardProps> = ({ faturamentos, despesas }) => {
  const [period, setPeriod] = useState<Period>('month');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [faturamentos, despesas, period]);

  // Data atual local segura (ISO sem fuso)
  const getTodayStr = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };

  const filteredData = useMemo(() => {
    const today = getTodayStr();
    let startLimit = '1900-01-01';
    let endLimit = '2100-12-31';

    if (period === 'today') {
      startLimit = today;
      endLimit = today;
    } else if (period === '7days') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      startLimit = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    } else if (period === 'month') {
      const d = new Date();
      startLimit = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-01';
    }

    const fat = faturamentos.filter(f => {
      const itemDate = f.data.substring(0, 10);
      return itemDate >= startLimit && itemDate <= endLimit;
    });
    
    const desp = despesas.filter(d => {
      const itemDate = d.data.substring(0, 10);
      return itemDate >= startLimit && itemDate <= endLimit;
    });

    return { fat, desp, startLimit };
  }, [faturamentos, despesas, period]);

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
    const dailyMap: Record<string, { date: string; faturamento: number; despesas: number; rawDate: string }> = {};
    const today = new Date();
    
    // Gerar últimos 10 dias para o gráfico mobile ser legível
    for (let i = 9; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      dailyMap[dStr] = { 
        date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }), 
        faturamento: 0, 
        despesas: 0,
        rawDate: dStr
      };
    }

    faturamentos.forEach(f => {
      const dStr = f.data.substring(0, 10);
      if (dailyMap[dStr]) dailyMap[dStr].faturamento += (Number(f.valor) || 0);
    });

    despesas.forEach(d => {
      const dStr = d.data.substring(0, 10);
      if (dailyMap[dStr]) dailyMap[dStr].despesas += (Number(d.valor) || 0);
    });

    return Object.values(dailyMap).sort((a,b) => a.rawDate.localeCompare(b.rawDate));
  }, [faturamentos, despesas]);

  return (
    <div className={`space-y-6 transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
      {/* Period Selector (Segmented Control style) */}
      <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-full overflow-x-auto no-scrollbar shadow-2xl">
        {[
          { id: 'today', label: 'Hoje' },
          { id: '7days', label: '7 Dias' },
          { id: 'month', label: 'Mês' },
          { id: 'all', label: 'Tudo' }
        ].map((p) => (
          <button 
            key={p.id}
            onClick={() => setPeriod(p.id as Period)}
            className={`flex-1 min-w-[80px] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${period === p.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400'}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* Entradas Card */}
        <div className="glass p-6 rounded-[2rem] border-white/20 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-500 font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-1">
              <TrendingUp size={10} className="text-emerald-500" /> Entradas
            </span>
            <div className="text-3xl font-black text-slate-900 tracking-tighter">
              R$ {stats.totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
             <TrendingUp size={28} strokeWidth={3} />
          </div>
        </div>

        {/* Saídas Card */}
        <div className="glass p-6 rounded-[2rem] border-white/20 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-500 font-black text-[9px] uppercase tracking-[0.2em] flex items-center gap-1">
              <TrendingDown size={10} className="text-red-500" /> Saídas
            </span>
            <div className="text-3xl font-black text-slate-900 tracking-tighter">
              R$ {stats.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600">
             <TrendingDown size={28} strokeWidth={3} />
          </div>
        </div>

        {/* Lucro Card (Main Focus) */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border-2 border-blue-500/30 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-600/30 transition-all" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.5em] mb-4">Lucro Líquido</span>
            <div className={`text-5xl font-black tracking-tighter mb-4 ${stats.lucro >= 0 ? 'text-white' : 'text-red-400'}`}>
              R$ {stats.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="bg-blue-600/20 text-blue-400 px-6 py-2 rounded-full border border-blue-500/20 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               <DollarSign size={12} strokeWidth={4} />
               Performance Ativa
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass p-6 md:p-8 rounded-[2.5rem] border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
             <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-widest">Últimos 10 Dias</h3>
           </div>
           <RefreshCcw size={14} className={`text-slate-400 ${isAnimating ? 'animate-spin' : ''}`} />
        </div>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 'bold' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: '#94a3b8' }}
                tickFormatter={(v) => `R$${v}`}
                hide={window.innerWidth < 640}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                labelStyle={{ fontWeight: 'black', marginBottom: '8px', color: '#1e293b' }}
              />
              <Area 
                type="monotone" 
                dataKey="faturamento" 
                stroke="#2563eb" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorFat)" 
                name="Entradas"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
