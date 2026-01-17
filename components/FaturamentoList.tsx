
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
  
  // Inicializa com a data local correta YYYY-MM-DDTHH:mm
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
    if (!tipoLavagem || !valor) return;
    
    // Força o formato YYYY-MM-DDTHH:mm:ss para o banco
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
    if (confirm('Excluir este registro permanentemente?')) {
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
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between glass p-6 rounded-[2.5rem] border-white/20">
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto items-center">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por serviço..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border-none rounded-2xl focus:ring-4 focus:ring-blue-500/20 transition-all font-bold text-sm italic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl w-full md:w-auto shadow-sm">
            <Calendar size={14} className="text-blue-500 ml-2" />
            <input 
              type="date" 
              className="bg-transparent border-none p-1 focus:ring-0 text-[10px] font-black uppercase"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <ArrowRight size={14} className="text-slate-300" />
            <input 
              type="date" 
              className="bg-transparent border-none p-1 focus:ring-0 text-[10px] font-black uppercase"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {(startDate || endDate) && (
              <button onClick={() => { setStartDate(''); setEndDate(''); }} className="p-1 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-blue-700 shadow-2xl shadow-blue-600/40 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Registrar Lavagem
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Serviço</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Porte</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pagamento</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data/Hora</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Opções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-10 py-6 font-black text-slate-900 italic uppercase tracking-tighter text-lg">{item.tipoLavagem}</td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      item.porte === CarSize.SMALL ? 'bg-emerald-100 text-emerald-700' :
                      item.porte === CarSize.MEDIUM ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {item.porte}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase">
                      <div className="p-2 bg-slate-100 rounded-xl">{getPaymentIcon(item.pagamento)}</div>
                      {item.pagamento}
                    </div>
                  </td>
                  <td className="px-10 py-6 font-black text-slate-900 text-xl tracking-tighter">R$ {Number(item.valor).toFixed(2)}</td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-800">{new Date(item.data.replace(' ', 'T')).toLocaleDateString('pt-BR')}</span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {item.data.substring(11, 16)}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleEdit(item)} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-2xl transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-2xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-24 text-center">
                    <div className="max-w-xs mx-auto text-slate-300">
                       <Search size={56} className="mx-auto mb-6 opacity-20" />
                       <p className="font-black italic uppercase tracking-tighter text-2xl">Nada encontrado</p>
                       <p className="text-[10px] font-black uppercase tracking-widest mt-2">Nenhum registro corresponde ao filtro.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-900 italic uppercase tracking-tighter text-2xl">
                {editingId ? 'Editar Lavagem' : 'Novo Atendimento'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white hover:bg-red-50 rounded-2xl transition-all text-slate-400 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tipo de Serviço</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-black text-slate-800 italic text-lg"
                  placeholder="Ex: Lavagem Geral + Cera"
                  value={tipoLavagem}
                  onChange={e => setTipoLavagem(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Porte do Veículo</label>
                  <select
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-black uppercase text-xs"
                    value={porte}
                    onChange={e => setPorte(e.target.value as CarSize)}
                  >
                    <option value={CarSize.SMALL}>Pequeno</option>
                    <option value={CarSize.MEDIUM}>Médio</option>
                    <option value={CarSize.LARGE}>Grande</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Valor cobrado (R$)</label>
                  <input
                    type="number"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-black text-2xl tracking-tighter"
                    placeholder="0,00"
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Forma de Pagamento</label>
                <div className="grid grid-cols-3 gap-4">
                  {Object.values(PaymentMethod).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPagamento(method)}
                      className={`flex flex-col items-center justify-center py-5 border-2 rounded-[2rem] transition-all ${
                        pagamento === method 
                          ? 'border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-500/30' 
                          : 'border-slate-50 bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {getPaymentIcon(method)}
                      <span className="text-[9px] font-black uppercase tracking-widest mt-3">{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Data e Horário</label>
                <input
                  type="datetime-local"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:outline-none font-black text-xs uppercase"
                  value={data}
                  onChange={e => setData(e.target.value)}
                />
              </div>
            </div>
            <div className="px-10 py-8 bg-slate-50 border-t flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-5 bg-white border border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-100 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] shadow-2xl shadow-blue-600/40 hover:bg-blue-700 transition-all active:scale-95"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
