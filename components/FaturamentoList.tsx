
import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, X, Clock, CreditCard, Banknote, QrCode, Calendar, ArrowRight } from 'lucide-react';
import { Faturamento, CarSize, PaymentMethod } from '../types';

interface FaturamentoListProps {
  items: Faturamento[];
  onUpdate: (items: Faturamento[]) => void;
}

export const FaturamentoList: React.FC<FaturamentoListProps> = ({ items, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [tipoLavagem, setTipoLavagem] = useState('');
  const [porte, setPorte] = useState<CarSize>(CarSize.MEDIUM);
  const [valor, setValor] = useState('');
  const [pagamento, setPagamento] = useState<PaymentMethod>(PaymentMethod.PIX);
  
  const getNowLocal = () => {
    const d = new Date();
    const datePart = d.toLocaleDateString('sv-SE').split(' ')[0];
    const timePart = d.toTimeString().substring(0, 5);
    return `${datePart}T${timePart}`;
  };

  const [data, setData] = useState(getNowLocal());

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = item.tipoLavagem.toLowerCase().includes(searchTerm.toLowerCase());
      const itemDateOnly = item.data.substring(0, 10);
      
      let matchDate = true;
      if (startDate && endDate) {
        matchDate = itemDateOnly >= startDate && itemDateOnly <= endDate;
      } else if (startDate) {
        matchDate = itemDateOnly >= startDate;
      } else if (endDate) {
        matchDate = itemDateOnly <= endDate;
      }

      return matchSearch && matchDate;
    }).sort((a, b) => b.data.localeCompare(a.data));
  }, [items, searchTerm, startDate, endDate]);

  const resetForm = () => {
    setTipoLavagem('');
    setPorte(CarSize.MEDIUM);
    setValor('');
    setPagamento(PaymentMethod.PIX);
    setData(getNowLocal());
    setEditingId(null);
  };

  const handleSave = () => {
    if (!tipoLavagem || !valor) {
      alert("Preencha o serviço e o valor!");
      return;
    }
    
    const finalDate = data.length === 16 ? `${data}:00` : data;

    if (editingId) {
      const updated = items.map(item => 
        item.id === editingId 
          ? { ...item, tipoLavagem, porte, valor: Number(valor), pagamento, data: finalDate } 
          : item
      );
      onUpdate(updated);
    } else {
      const newItem: Faturamento = {
        id: Math.random().toString(36).substr(2, 9),
        tipoLavagem,
        porte,
        valor: Number(valor),
        pagamento,
        data: finalDate
      };
      onUpdate([...items, newItem]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (item: Faturamento) => {
    setEditingId(item.id);
    setTipoLavagem(item.tipoLavagem);
    setPorte(item.porte);
    setValor(item.valor.toString());
    setPagamento(item.pagamento);
    setData(item.data.substring(0, 16));
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir este registro?')) {
      onUpdate(items.filter(item => item.id !== id));
    }
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.DINHEIRO: return <Banknote className="w-5 h-5" />;
      case PaymentMethod.CARTAO: return <CreditCard className="w-5 h-5" />;
      case PaymentMethod.PIX: return <QrCode className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Botão Flutuante (Mobile FAB) */}
      <button
        onClick={() => { resetForm(); setIsModalOpen(true); }}
        className="md:hidden fixed bottom-24 right-6 z-40 bg-blue-600 text-white p-5 rounded-full shadow-2xl shadow-blue-600/50 active:scale-90 transition-transform flex items-center justify-center border-4 border-white"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Header com busca e filtros */}
      <div className="flex flex-col gap-3 glass p-4 rounded-[1.5rem] border-white/20">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar serviço..."
            className="w-full pl-11 pr-4 py-3 bg-white border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
           <div className="flex items-center gap-1.5 bg-white/50 p-1.5 rounded-xl border border-white shrink-0">
              <input 
                type="date" 
                className="bg-transparent border-none p-1 text-[10px] font-black uppercase text-slate-800 focus:ring-0"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <ArrowRight size={10} className="text-slate-300" />
              <input 
                type="date" 
                className="bg-transparent border-none p-1 text-[10px] font-black uppercase text-slate-800 focus:ring-0"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
           </div>
           {(startDate || endDate) && (
              <button onClick={() => { setStartDate(''); setEndDate(''); }} className="p-2 bg-red-100 text-red-500 rounded-lg shrink-0">
                <X size={14} />
              </button>
           )}
           <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700"
          >
            <Plus size={16} /> Novo Registro
          </button>
        </div>
      </div>

      {/* Listagem Mobile Cards */}
      <div className="grid grid-cols-1 gap-3">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group active:bg-slate-50">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                  item.porte === CarSize.SMALL ? 'bg-emerald-100 text-emerald-700' :
                  item.porte === CarSize.MEDIUM ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {item.porte}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{item.pagamento}</span>
              </div>
              <h4 className="text-sm font-black text-slate-900 uppercase italic truncate">{item.tipoLavagem}</h4>
              <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5 uppercase">
                <Calendar size={10} /> {new Date(item.data).toLocaleDateString('pt-BR')} • {item.data.substring(11, 16)}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[9px] font-black text-slate-400 block uppercase">Valor</span>
                <span className="text-lg font-black text-slate-900 tracking-tighter">R$ {Number(item.valor).toFixed(2)}</span>
              </div>
              <button onClick={() => handleEdit(item)} className="p-2 bg-slate-50 text-slate-400 rounded-xl">
                <Edit2 size={16} />
              </button>
            </div>
          </div>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="py-20 text-center opacity-40">
            <Search size={40} className="mx-auto mb-2" />
            <p className="font-black uppercase text-xs">Nenhuma lavagem encontrada</p>
          </div>
        )}
      </div>

      {/* Modal - Totalmente Responsivo e Otimizado Mobile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col max-h-[92vh] md:max-h-[90vh] overflow-hidden">
            {/* Header Modal */}
            <div className="px-5 py-4 md:px-6 md:py-5 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-black text-slate-900 italic uppercase tracking-tighter text-base md:text-lg">
                {editingId ? 'Editar Lavagem' : 'Nova Lavagem'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>

            {/* Content Modal (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4 md:space-y-5">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Serviço Realizado</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-black text-slate-800 italic uppercase text-sm"
                  placeholder="Ex: Lavagem Geral"
                  value={tipoLavagem}
                  onChange={e => setTipoLavagem(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Porte</label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-black uppercase text-[10px] md:text-xs"
                    value={porte}
                    onChange={e => setPorte(e.target.value as CarSize)}
                  >
                    <option value={CarSize.SMALL}>Pequeno</option>
                    <option value={CarSize.MEDIUM}>Médio</option>
                    <option value={CarSize.LARGE}>Grande</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Valor (R$)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-black text-lg tracking-tighter"
                    placeholder="0,00"
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Pagamento</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(PaymentMethod).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPagamento(method)}
                      className={`flex flex-col items-center justify-center py-3 border-2 rounded-xl transition-all ${
                        pagamento === method 
                          ? 'border-blue-600 bg-blue-600 text-white shadow-md' 
                          : 'border-slate-50 bg-slate-50 text-slate-400'
                      }`}
                    >
                      {getPaymentIcon(method)}
                      <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest mt-1.5">{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Data e Hora</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-black text-[10px] uppercase"
                  value={data}
                  onChange={e => setData(e.target.value)}
                />
              </div>
              
              {editingId && (
                <button 
                  onClick={() => handleDelete(editingId)}
                  className="w-full py-2 text-red-500 font-black uppercase text-[9px] flex items-center justify-center gap-2 mt-2"
                >
                  <Trash2 size={12} /> Excluir Registro
                </button>
              )}
            </div>

            {/* Footer Modal (Fixed) */}
            <div className="p-5 md:p-6 bg-slate-50 border-t flex gap-3 sticky bottom-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3.5 border-2 border-slate-200 rounded-xl font-black uppercase text-[10px] text-slate-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-[2] py-3.5 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-600/30 active:scale-95"
              >
                Salvar Lavagem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
