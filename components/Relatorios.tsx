
import React, { useMemo } from 'react';
import { Download, FileText, Printer, Clock, Gauge } from 'lucide-react';
import { Faturamento, Despesa } from '../types';

interface RelatoriosProps {
  faturamentos: Faturamento[];
  despesas: Despesa[];
}

export const Relatorios: React.FC<RelatoriosProps> = ({ faturamentos, despesas }) => {
  const summary = useMemo(() => {
    const totalFat = faturamentos.reduce((acc, curr) => acc + curr.valor, 0);
    const totalDesp = despesas.reduce((acc, curr) => acc + curr.valor, 0);
    return {
      totalFat,
      totalDesp,
      lucro: totalFat - totalDesp,
      avgTicket: faturamentos.length > 0 ? totalFat / faturamentos.length : 0,
      countFat: faturamentos.length,
      countDesp: despesas.length
    };
  }, [faturamentos, despesas]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Relatórios</h2>
          <p className="text-white/60 text-sm">Auditoria financeira completa.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-3 glass border-white/50 px-8 py-3 rounded-2xl text-slate-800 font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-xl"
          >
            <Printer className="w-5 h-5" />
            Gerar PDF
          </button>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3rem] border shadow-2xl print:shadow-none print:border-none">
        <div className="flex items-center justify-between mb-12 pb-12 border-b-2 border-slate-100">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-xl">
              <Gauge className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Lava-jato Pro</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Sistemas de Gestão Automotiva</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-black text-slate-900 tracking-tighter text-xl italic">EXTRATO GERAL</p>
            <p className="text-xs text-slate-400 font-bold italic mt-1">Gerado em {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Lavagens</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{summary.countFat}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ticket Médio</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">R$ {summary.avgTicket.toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Entradas</p>
            <p className="text-3xl font-black text-blue-600 tracking-tighter">R$ {summary.totalFat.toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Saídas</p>
            <p className="text-3xl font-black text-red-600 tracking-tighter">R$ {summary.totalDesp.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-16">
          <section>
            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter mb-6 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
              Detalhamento de Entradas
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-black text-slate-500 uppercase text-[10px] tracking-widest">Data/Hora</th>
                    <th className="px-6 py-4 text-left font-black text-slate-500 uppercase text-[10px] tracking-widest">Serviço</th>
                    <th className="px-6 py-4 text-left font-black text-slate-500 uppercase text-[10px] tracking-widest">Forma Pagto</th>
                    <th className="px-6 py-4 text-right font-black text-slate-500 uppercase text-[10px] tracking-widest">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {faturamentos.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-600">
                        {new Date(f.data).toLocaleDateString('pt-BR')} 
                        <span className="text-slate-400 text-[10px] ml-2 font-black italic uppercase">
                          {new Date(f.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 uppercase italic tracking-tighter">{f.tipoLavagem} ({f.porte})</td>
                      <td className="px-6 py-4 font-bold text-slate-600 uppercase text-xs tracking-widest">{f.pagamento}</td>
                      <td className="px-6 py-4 text-right font-black text-slate-900">R$ {f.valor.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter mb-6 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-red-600 rounded-full" />
              Detalhamento de Saídas
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-black text-slate-500 uppercase text-[10px] tracking-widest">Data</th>
                    <th className="px-6 py-4 text-left font-black text-slate-500 uppercase text-[10px] tracking-widest">Observação / Detalhes</th>
                    <th className="px-6 py-4 text-right font-black text-slate-500 uppercase text-[10px] tracking-widest">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {despesas.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-600 whitespace-nowrap">{new Date(d.data).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4 font-semibold text-slate-500 italic leading-relaxed">{d.observacao || "Gasto não detalhado"}</td>
                      <td className="px-6 py-4 text-right font-black text-red-600">R$ {d.valor.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="mt-20 pt-12 border-t-4 border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-900 p-12 rounded-[2.5rem] text-white">
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Resultado Operacional</p>
            <p className="text-6xl font-black tracking-tighter italic leading-none">
              R$ {summary.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <div className={`inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${summary.lucro >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
               {summary.lucro >= 0 ? 'Status: Superávit Confirmado' : 'Status: Déficit de Caixa'}
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="w-48 h-[2px] bg-white/20 mb-3 ml-auto" />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-8">Assinatura Digital</p>
            <p className="text-sm font-black italic tracking-tighter text-blue-500 uppercase">João Layón Developer</p>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sistemas de Gestão Premium v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};
