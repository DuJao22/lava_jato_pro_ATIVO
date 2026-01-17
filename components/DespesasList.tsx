
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
      const itemDate = item.data.split('T')[0];
      
      let matchDate = true;
      if (startDate && endDate) {
        matchDate = itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        matchDate = itemDate >= startDate;
      } else if (endDate) {
        matchDate = itemDate <= endDate;
      }
      return matchDate;
    }).sort((a,b) => b.data.localeCompare(a.data));
  }, [items, startDate, endDate]);

  const resetForm = () => {
    setValor('');
    setObservacao('');
    setData(new Date().toISOString().split('T')[0]);
    setEditingId(null);
  };

  const handleSave = () => {
    const vTotal = Number(valor) || 0;
    if (vTotal <= 0) {
      alert("Insira um valor válido!");
      return;
    }

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
    <div className="space-y-4 pb-20">
      {/* Botão Flutuante (Mobile FAB) - Vermelho para Gastos */}
      <button
        onClick={() => { resetForm(); setIsModalOpen(true); }}
        className="md:hidden fixed bottom-24 right-6 z-40 bg-red-600 text-white p-5 rounded-full shadow-2xl shadow-red-600/50 active:scale-90 transition-transform flex items-center justify-center border-4 border-white"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Header Mobile / Desktop */}
      <div className="flex flex-col gap-3 glass p-4 rounded-[1.5rem] border-white/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="hidden md:block">
            <h2 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">Gestão de Saídas</h2>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
             <div className="flex flex-1 items-center gap-1.5 bg-white/50 p-2 rounded-xl border border-white">
                <Calendar size={12} className="text-red-500" />
                <input 
                  type="date" 
                  className="bg-transparent border-none p-0 text-[10px] font-black uppercase text-slate-800 focus:ring-0 w-full"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <ArrowRight size={10} className="text-slate-300" />
                <input 
                  type="date" 
                  className="bg-transparent border-none p-0 text-[10px] font-black uppercase text-slate-800 focus:ring-0 w-full"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
             </div>
             {(startDate || endDate) && (
                <button onClick={() => { setStartDate(''); setEndDate(''); }} className="p-2.5 bg-red-100 text-red-500 rounded-xl">
                  <X size={16} />
                </button>
             )}
             <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="hidden md:flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 shadow-lg shadow-red-600/20"
            >
              <Plus size={16} /> Novo Gasto
            </button>
          </div>
        </div>
      </div>

      {/* Listagem em Cards - Adaptada Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 group active:bg-slate-50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <Receipt size={20} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600">
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-1 mb-4">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Valor do Gasto</span>
              <div className="text-2xl font-black text-slate-900 tracking-tighter">
                R$ {Number(item.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50">
               <div className="flex items-center gap-2 mb-2">
                 <MessageSquare size={12} className="text-slate-300" />
                 <p className="text-[10px] font-bold text-slate-600 italic line-clamp-2">
                    {item.observacao || "Gasto não detalhado"}
                 </p>
               </div>
               <div className="flex items-center gap-2">
                 <Calendar size={12} className="text-slate-300" />
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                   {new Date(item.data).toLocaleDateString('pt-BR')}
                 </p>
               </div>
            </div>
          </div>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-40">
            <Receipt size={40} className="mx-auto mb-2" />
            <p className="font-black uppercase text-xs">Nenhum gasto registrado</p>
          </div>
        )}
      </div>

      {/* Modal - Responsivo iPhone com Scroll Interno */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header Fixo */}
            <div className="px-8 py-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-black text-slate-900 italic uppercase tracking-tighter text-xl">
                {editingId ? 'Editar Gasto' : 'Novo Lançamento'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                <X size={24} />
              </button>
            </div>

            {/* Conteúdo Rolável */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Valor Total (R$)</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                    <DollarSign size={20} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-red-500 font-black text-2xl tracking-tighter"
                    placeholder="0,00"
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Observação / Detalhes</label>
                <textarea
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm min-h-[120px] italic"
                  placeholder="Ex: Compra de detergente, Aluguel, Luz..."
                  value={observacao}
                  onChange={e => setObservacao(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Data do Gasto</label>
                <input
                  type="date"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-black text-xs uppercase"
                  value={data}
                  onChange={e => setData(e.target.value)}
                />
              </div>

              {editingId && (
                <button 
                  onClick={() => handleDelete(editingId)}
                  className="w-full py-3 text-red-500 font-black uppercase text-[10px] flex items-center justify-center gap-2 mt-4"
                >
                  <Trash2 size={12} /> Excluir permanentemente
                </button>
              )}
            </div>

            {/* Footer Fixo */}
            <div className="p-8 bg-slate-50 border-t flex gap-4 sticky bottom-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-black uppercase text-[10px] text-slate-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-600/30 active:scale-95"
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
