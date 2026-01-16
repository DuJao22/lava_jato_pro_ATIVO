
import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, X, Receipt, MessageSquare, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { Despesa } from '../types';

interface DespesasListProps {
  items: Despesa[];
  onUpdate: (items: Despesa[]) => void;
}

export const DespesasList: React.FC<DespesasListProps> = ({ items, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Form states
  const [valor, setValor] = useState('');
  const [observacao, setObservacao] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const itemDate = new Date(item.data.split('T')[0]);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && end) return itemDate >= start && itemDate <= end;
      if (start) return itemDate >= start;
      if (end) return itemDate <= end;
      return true;
    }).sort((a,b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [items, startDate, endDate]);

  const resetForm = () => {
    setValor('');
    setObservacao('');
    setData(new Date().toISOString().split('T')[0]);
    setEditingId(null);
  };

  const handleSave = () => {
    const vTotal = Number(valor) || 0;
    if (vTotal <= 0) return;

    if (editingId) {
      const updated = items.map(item => 
        item.id === editingId 
          ? { ...item, valor: vTotal, observacao, data: new Date(data).toISOString() } 
          : item
      );
      onUpdate(updated);
    } else {
      const newItem: Despesa = {
        id: Math.random().toString(36).substr(2, 9),
        valor: vTotal,
        observacao,
        data: new Date(data).toISOString()
      };
      onUpdate([...items, newItem]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (item: Despesa) => {
    setEditingId(item.id);
    setValor(item.valor.toString());
    setObservacao(item.observacao);
    setData(item.data.split('T')[0]);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir esta despesa?')) {
      onUpdate(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Gestão de Saídas</h2>
          <p className="text-white/60 text-sm">Controle rigoroso de custos operacionais.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            <div className="flex items-center gap-2 px-3 text-white">
              <Calendar size={14} className="text-red-500" />
              <input 
                type="date" 
                className="bg-transparent border-none p-0 focus:ring-0 text-[10px] font-black uppercase text-white"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <ArrowRight size={14} className="text-white/20" />
            <div className="flex items-center gap-2 px-3 text-white">
              <input 
                type="date" 
                className="bg-transparent border-none p-0 focus:ring-0 text-[10px] font-black uppercase text-white"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {(startDate || endDate) && (
                <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-red-400 hover:text-red-200">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-red-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-red-700 shadow-xl shadow-red-600/30 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Registrar Gasto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="glass p-8 rounded-[2rem] border-white/30 shadow-2xl group hover:shadow-red-600/10 transition-all animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-500/30">
                <Receipt className="w-6 h-6" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="p-2 glass rounded-xl text-slate-600 hover:text-blue-600 hover:bg-white transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 glass rounded-xl text-slate-600 hover:text-red-600 hover:bg-white transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Valor</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">R$ {item.valor.toFixed(2)}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Observação</p>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed italic">
                    {item.observacao || "Gasto operacional."}
                  </p>
                </div>
              </div>
              <div>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Data</p>
                 <p className="text-xs font-black text-slate-600">{new Date(item.data).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center glass border-dashed rounded-[3rem] border-white/50">
            <Receipt size={64} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/40 font-black italic uppercase tracking-tighter text-xl">Nada para exibir</p>
            <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Ajuste os filtros de data</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="glass w-full max-w-md rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border-white/50 animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-slate-800 italic uppercase tracking-tighter text-xl">
                {editingId ? 'Editar Despesa' : 'Novo Lançamento'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Valor (R$)</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <DollarSign size={18} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:outline-none font-black text-xl tracking-tighter transition-all"
                    placeholder="0,00"
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Observação</label>
                <textarea
                  className="w-full px-4 py-4 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-medium text-sm min-h-[120px]"
                  placeholder="Detalhamento do custo..."
                  value={observacao}
                  onChange={e => setObservacao(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Data</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-bold"
                  value={data}
                  onChange={e => setData(e.target.value)}
                />
              </div>
            </div>
            <div className="px-8 py-6 bg-slate-50 border-t flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-4 border-2 border-slate-200 rounded-2xl font-black uppercase text-xs tracking-widest text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-red-600/30 hover:bg-red-700 transition-all active:scale-95"
              >
                Salvar Gasto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
