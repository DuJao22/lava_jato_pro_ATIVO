
import React, { useMemo, useState } from 'react';
import { 
  Download, 
  Printer, 
  Calendar, 
  ArrowRight, 
  X, 
  FileSpreadsheet, 
  Gauge, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { Faturamento, Despesa } from '../types';
import * as XLSX from 'xlsx';

interface RelatoriosProps {
  faturamentos: Faturamento[];
  despesas: Despesa[];
}

export const Relatorios: React.FC<RelatoriosProps> = ({ faturamentos, despesas }) => {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredData = useMemo(() => {
    const start = startDate ? new Date(startDate + 'T00:00:00') : new Date(0);
    const end = endDate ? new Date(endDate + 'T23:59:59') : new Date();

    const fat = faturamentos.filter(f => {
      const d = new Date(f.data);
      return d >= start && d <= end;
    });
    
    const desp = despesas.filter(d => {
      const dt = new Date(d.data);
      return dt >= start && dt <= end;
    });
    
    return { fat, desp, start, end };
  }, [faturamentos, despesas, startDate, endDate]);

  const summary = useMemo(() => {
    const totalFat = filteredData.fat.reduce((acc, curr) => acc + curr.valor, 0);
    const totalDesp = filteredData.desp.reduce((acc, curr) => acc + curr.valor, 0);
    return {
      totalFat,
      totalDesp,
      lucro: totalFat - totalDesp,
      avgTicket: filteredData.fat.length > 0 ? totalFat / filteredData.fat.length : 0,
      countFat: filteredData.fat.length,
      countDesp: filteredData.desp.length
    };
  }, [filteredData]);

  const handlePrint = () => window.print();

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const resumoData = [
      ["EXTRATO DE PERFORMANCE - LAVA-JATO PRO"],
      ["Período:", `${new Date(filteredData.start).toLocaleDateString()} a ${new Date(filteredData.end).toLocaleDateString()}`],
      [""],
      ["Métrica", "Valor"],
      ["Total Lavagens", summary.countFat],
      ["Ticket Médio", summary.avgTicket.toFixed(2)],
      ["Entradas (R$)", summary.totalFat.toFixed(2)],
      ["Saídas (R$)", summary.totalDesp.toFixed(2)],
      ["LUCRO LÍQUIDO", summary.lucro.toFixed(2)],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumoData), "Resumo");
    XLSX.writeFile(wb, `Relatorio_${startDate}_${endDate}.xlsx`);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Barra de Filtros Executiva */}
      <div className="flex flex-col gap-4 no-print">
        <div className="glass p-5 rounded-[2rem] border-white/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-500/30">
              <Calendar size={20} />
            </div>
            <div className="flex flex-1 items-center gap-2 bg-slate-100/50 p-2 rounded-xl border border-slate-200">
              <input 
                type="date" 
                className="bg-transparent border-none p-1 text-[11px] font-black uppercase text-slate-700 focus:ring-0 w-full"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <ArrowRight size={12} className="text-slate-400" />
              <input 
                type="date" 
                className="bg-transparent border-none p-1 text-[11px] font-black uppercase text-slate-700 focus:ring-0 w-full"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={handleExportExcel}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
            >
              <FileSpreadsheet size={16} /> Excel
            </button>
            <button 
              onClick={handlePrint}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
            >
              <Printer size={16} /> Imprimir
            </button>
          </div>
        </div>
      </div>

      {/* Documento do Relatório */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 print:shadow-none print:border-none">
        
        {/* Header Profissional */}
        <div className="p-8 md:p-12 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
              <Gauge size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight">Lava-jato Pro</h1>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Gestão de Alta Performance</p>
            </div>
          </div>
          <div className="text-left md:text-right border-l-4 md:border-l-0 md:border-r-4 border-blue-600 pl-4 md:pl-0 md:pr-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Período Selecionado</span>
            <div className="text-sm font-black text-slate-900 uppercase">
              {new Date(filteredData.start).toLocaleDateString()} — {new Date(filteredData.end).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Grade de KPIs */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-2 mb-3 text-slate-400">
                <ClipboardList size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Atendimentos</span>
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tighter">{summary.countFat}</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-2 mb-3 text-slate-400">
                <Activity size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Ticket Médio</span>
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tighter">R$ {summary.avgTicket.toFixed(2)}</div>
            </div>
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
              <div className="flex items-center gap-2 mb-3 text-emerald-600">
                <TrendingUp size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Total Faturado</span>
              </div>
              <div className="text-2xl font-black text-emerald-700 tracking-tighter">R$ {summary.totalFat.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
              <div className="flex items-center gap-2 mb-3 text-red-600">
                <TrendingDown size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Total Gastos</span>
              </div>
              <div className="text-2xl font-black text-red-700 tracking-tighter">R$ {summary.totalDesp.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          {/* Resultado Destaque */}
          <div className="mb-12 bg-slate-900 p-8 rounded-[2rem] text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500" />
             <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.5em] mb-3 block">Resultado Líquido do Período</span>
             <div className={`text-5xl md:text-6xl font-black tracking-tighter italic ${summary.lucro >= 0 ? 'text-white' : 'text-red-400'}`}>
                R$ {summary.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
             </div>
             <div className="mt-4 flex items-center justify-center gap-2 text-white/40 font-bold text-[10px] uppercase tracking-widest">
                <Activity size={12} /> Desempenho Operacional Validado
             </div>
          </div>

          {/* Tabelas de Detalhamento */}
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Detalhamento de Entradas</h3>
              </div>
              <div className="overflow-hidden border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase">Data</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase">Serviço / Porte</th>
                      <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredData.fat.map(f => (
                      <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-black text-slate-900">{new Date(f.data).toLocaleDateString('pt-BR')}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[11px] font-bold text-slate-800 uppercase italic">{f.tipoLavagem}</div>
                          <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{f.porte}</div>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-slate-900 text-sm tracking-tighter">
                          R$ {f.valor.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">Detalhamento de Saídas</h3>
              </div>
              <div className="overflow-hidden border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase">Data</th>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase">Descrição</th>
                      <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredData.desp.map(d => (
                      <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-[11px] font-black text-slate-900">{new Date(d.data).toLocaleDateString('pt-BR')}</td>
                        <td className="px-6 py-4 text-[11px] font-bold text-slate-600 italic uppercase truncate max-w-[150px]">{d.observacao || 'Gasto Operacional'}</td>
                        <td className="px-6 py-4 text-right font-black text-red-600 text-sm tracking-tighter">R$ {d.valor.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Rodapé do Documento */}
          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 italic">
            <div className="text-center md:text-left">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Responsável Técnico</p>
              <p className="text-xs font-black text-slate-800 uppercase">Administração Jato Pro</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Data de Emissão</p>
              <p className="text-xs font-black text-slate-800 uppercase">{new Date().toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
