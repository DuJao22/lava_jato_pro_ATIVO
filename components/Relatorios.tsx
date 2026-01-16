
import React, { useMemo, useState } from 'react';
import { Download, FileText, Printer, Clock, Gauge, Calendar, ArrowRight, X, FileSpreadsheet } from 'lucide-react';
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

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Aba 1: Resumo Geral
    const resumoData = [
      ["RELATÓRIO DE DESEMPENHO - LAVA-JATO PRO"],
      [""],
      ["Período:", `${new Date(filteredData.start).toLocaleDateString()} até ${new Date(filteredData.end).toLocaleDateString()}`],
      ["Exportado em:", new Date().toLocaleString()],
      [""],
      ["Indicadores", "Valor"],
      ["Total de Atendimentos", summary.countFat],
      ["Ticket Médio", `R$ ${summary.avgTicket.toFixed(2)}`],
      ["Faturamento Bruto", `R$ ${summary.totalFat.toFixed(2)}`],
      ["Total de Despesas", `R$ ${summary.totalDesp.toFixed(2)}`],
      ["Lucro Líquido", `R$ ${summary.lucro.toFixed(2)}`],
    ];
    const wsResumo = XLSX.utils.aoa_to_sheet(resumoData);
    XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");

    // Aba 2: Detalhamento de Entradas (Faturamentos)
    const fatExcel = filteredData.fat.map(f => ({
      "Data": new Date(f.data).toLocaleDateString('pt-BR'),
      "Hora": new Date(f.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      "Serviço": f.tipoLavagem,
      "Porte": f.porte,
      "Pagamento": f.pagamento,
      "Valor (R$)": f.valor
    }));
    const wsFat = XLSX.utils.json_to_sheet(fatExcel);
    XLSX.utils.book_append_sheet(wb, wsFat, "Entradas");

    // Aba 3: Detalhamento de Saídas (Despesas)
    const despExcel = filteredData.desp.map(d => ({
      "Data": new Date(d.data).toLocaleDateString('pt-BR'),
      "Descrição": d.observacao || "Gasto operacional",
      "Valor (R$)": d.valor
    }));
    const wsDesp = XLSX.utils.json_to_sheet(despExcel);
    XLSX.utils.book_append_sheet(wb, wsDesp, "Saídas");

    // Gerar Download
    const fileName = `Relatorio_LavaJato_${startDate}_a_${endDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 print:hidden">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Relatórios</h2>
          <p className="text-white/60 text-sm">Extrato consolidado por período.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="glass p-2 rounded-2xl flex items-center gap-3 pr-4 shadow-xl">
             <div className="bg-blue-600 p-2 rounded-xl text-white">
                <Calendar size={18} />
             </div>
             <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  className="bg-transparent border-none focus:ring-0 font-black uppercase text-[10px] tracking-widest text-slate-800"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <ArrowRight size={14} className="text-slate-300" />
                <input 
                  type="date" 
                  className="bg-transparent border-none focus:ring-0 font-black uppercase text-[10px] tracking-widest text-slate-800"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
             </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleExportExcel}
              className="flex items-center gap-3 bg-emerald-600 px-6 py-3.5 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
              title="Baixar Planilha Excel"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Excel
            </button>
            
            <button 
              onClick={handlePrint}
              className="flex items-center gap-3 bg-white px-6 py-3.5 rounded-2xl text-slate-800 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl shadow-black/20 active:scale-95"
            >
              <Printer className="w-5 h-5 text-blue-600" />
              Imprimir
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] border shadow-2xl print:shadow-none print:border-none print:p-0 overflow-hidden">
        <div className="flex items-center justify-between mb-12 pb-12 border-b-2 border-slate-100">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-4 rounded-2xl text-white shadow-xl">
              <Gauge className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Lava-jato Pro</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Gestão de Alta Performance</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-black text-slate-900 tracking-tighter text-xl italic uppercase">Relatório de Período</p>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-1">
              {new Date(filteredData.start).toLocaleDateString()} — {new Date(filteredData.end).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Atendimentos</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{summary.countFat}</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Ticket Médio</p>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">R$ {summary.avgTicket.toFixed(0)}</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Faturado</p>
            <p className="text-2xl font-black text-blue-600 tracking-tighter">R$ {summary.totalFat.toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Gastos</p>
            <p className="text-2xl font-black text-red-600 tracking-tighter">R$ {summary.totalDesp.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-16">
          <section>
            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter mb-8 flex items-center gap-4">
              <div className="w-2 h-10 bg-blue-600 rounded-full" />
              Entradas no Intervalo
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-left font-black text-slate-400 uppercase text-[9px] tracking-[0.2em]">Data</th>
                    <th className="px-8 py-5 text-left font-black text-slate-400 uppercase text-[9px] tracking-[0.2em]">Descrição / Porte</th>
                    <th className="px-8 py-5 text-right font-black text-slate-400 uppercase text-[9px] tracking-[0.2em]">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.fat.map(f => (
                    <tr key={f.id}>
                      <td className="px-8 py-5">
                        <span className="font-black text-slate-900">{new Date(f.data).toLocaleDateString('pt-BR')}</span>
                      </td>
                      <td className="px-8 py-5 font-bold text-slate-900 uppercase italic tracking-tighter">
                         {f.tipoLavagem} <span className="text-blue-500 ml-1">({f.porte})</span>
                      </td>
                      <td className="px-8 py-5 text-right font-black text-slate-900 text-lg tracking-tighter">R$ {f.valor.toFixed(2)}</td>
                    </tr>
                  ))}
                  {filteredData.fat.length === 0 && (
                    <tr><td colSpan={3} className="p-12 text-center text-slate-300 font-black italic uppercase">Nenhum dado encontrado</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter mb-8 flex items-center gap-4">
              <div className="w-2 h-10 bg-red-600 rounded-full" />
              Saídas no Intervalo
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-left font-black text-slate-400 uppercase text-[9px] tracking-[0.2em]">Data</th>
                    <th className="px-8 py-5 text-left font-black text-slate-400 uppercase text-[9px] tracking-[0.2em]">Detalhamento</th>
                    <th className="px-8 py-5 text-right font-black text-slate-400 uppercase text-[9px] tracking-[0.2em]">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.desp.map(d => (
                    <tr key={d.id}>
                      <td className="px-8 py-5 font-black text-slate-900">{new Date(d.data).toLocaleDateString('pt-BR')}</td>
                      <td className="px-8 py-5 font-semibold text-slate-500 italic">{d.observacao}</td>
                      <td className="px-8 py-5 text-right font-black text-red-600 text-lg tracking-tighter">R$ {d.valor.toFixed(2)}</td>
                    </tr>
                  ))}
                  {filteredData.desp.length === 0 && (
                    <tr><td colSpan={3} className="p-12 text-center text-slate-300 font-black italic uppercase">Nenhum dado encontrado</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="mt-20 bg-slate-900 p-12 rounded-[3.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 border-4 border-slate-800 shadow-2xl">
          <div className="text-center md:text-left">
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Resultado de Período</p>
            <p className="text-7xl font-black tracking-tighter italic leading-none mb-4">
              R$ {summary.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-lg font-black italic tracking-tighter text-blue-500 uppercase leading-none">João Layón</p>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-2">Software Architect</p>
          </div>
        </div>
      </div>
    </div>
  );
};
