
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
  const [data, setData] = useState(new Date().toISOString().substring(0, 16));

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
    setData(new Date().toLocaleString('sv-SE').replace(' ', 'T').substring(0, 16));
    setEditingId(null);
  };

  const handleSave = () => {
    if (!tipoLavagem || !valor) return;
    // Salva exatamente o que está no input ou converte mantendo a data local
    const entryData = data.includes('T') ? data : new Date(data).toISOString();

    if (editingId) {
      const updated = items.map(item => 
        item.id === editingId 
          ? { ...item, tipoLavagem, porte, valor: Number(valor), pagamento, data: entryData } 
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
        data: entryData
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
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      onUpdate(items.filter(item => item.id !== id));
    }
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.DINHEIRO: return <Banknote className="w-4 h-4" />;
      case PaymentMethod.CARTAO: return <CreditCard className="w-4 h-4" />;
      case PaymentMethod.PIX: return <QrCode className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-slate-900/10 p-4 rounded-[2rem] border border-white/20">
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar serviço..."
              className="w-full pl-10 pr-4 py-3 bg-white/80 border rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-2xl border w-full md:w-auto">
            <div className="flex items-center gap-2 px-2">
              <Calendar size={14} className="text-blue-500" />
              <input 
                type="date" 
                className="bg-transparent border-none p-0 focus:ring-0 text-[10px] font-black uppercase"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <ArrowRight size={14} className="text-slate-300" />
            <div className="flex items-center gap-2 px-2">
              <input 
                type="date" 
                className="bg-transparent border-none p-0 focus:ring-0 text-[10px] font-black uppercase"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {(startDate || endDate) && (
                <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-red-400 hover:text-red-600">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nova Lavagem
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Serviço</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Porte</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pagamento</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-900 italic uppercase tracking-tighter">{item.tipoLavagem}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      item.porte === CarSize.SMALL ? 'bg-emerald-100 text-emerald-700' :
                      item.porte === CarSize.MEDIUM ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {item.porte}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-bold uppercase">
                      <div className="p-1.5 bg-slate-100 rounded-lg">{getPaymentIcon(item.pagamento)}</div>
                      {item.pagamento}
                    </div>
                  </td>
                  <td className="px-8 py-5 font-black text-slate-900 text-lg tracking-tighter">R$ {Number(item.valor).toFixed(2)}</td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-700">{new Date(item.data.replace(' ', 'T')).toLocaleDateString('pt-BR')}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {new Date(item.data.replace(' ', 'T')).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleEdit(item)} className="p-2.5 glass rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2.5 glass rounded-xl text-slate-400 hover:text-red-600 hover:bg-white transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto text-slate-300">
                       <Search size={48} className="mx-auto mb-4 opacity-20" />
                       <p className="font-black italic uppercase tracking-tighter text-xl">Nenhum registro</p>
                       <p className="text-xs font-medium">Não há lavagens para este filtro.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="glass w-full max-w-md rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border-white/50">
            <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-black text-slate-800 italic uppercase tracking-tighter text-xl">
                {editingId ? 'Editar Registro' : 'Nova Lavagem'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <div className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Serviço Prestado</label>
                <input
                  type="text"
                  className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-bold text-slate-700 italic placeholder:font-normal"
                  placeholder="Ex: Lavagem Geral, Cera..."
                  value={tipoLavagem}
                  onChange={e => setTipoLavagem(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Porte</label>
                  <select
                    className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none bg-white font-black uppercase text-xs tracking-widest"
                    value={porte}
                    onChange={e => setPorte(e.target.value as CarSize)}
                  >
                    <option value={CarSize.SMALL}>Pequeno</option>
                    <option value={CarSize.MEDIUM}>Médio</option>
                    <option value={CarSize.LARGE}>Grande</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Preço (R$)</label>
                  <input
                    type="number"
                    className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-black text-lg tracking-tighter"
                    placeholder="0,00"
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Pagamento</label>
                <div className="grid grid-cols-3 gap-3">
                  {Object.values(PaymentMethod).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPagamento(method)}
                      className={`flex flex-col items-center justify-center py-4 border-2 rounded-2xl transition-all ${
                        pagamento === method 
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                          : 'border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {getPaymentIcon(method)}
                      <span className="text-[9px] font-black uppercase tracking-widest mt-2">{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Horário</label>
                <input
                  type="datetime-local"
                  className="w-full px-5 py-4 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none font-black text-xs uppercase"
                  value={data}
                  onChange={e => setData(e.target.value)}
                />
              </div>
            </div>
            <div className="px-8 py-6 bg-slate-50/80 border-t flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-4 border-2 border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
