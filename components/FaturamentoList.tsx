
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Clock, CreditCard, Banknote, QrCode } from 'lucide-react';
import { Faturamento, CarSize, PaymentMethod } from '../types';

interface FaturamentoListProps {
  items: Faturamento[];
  onUpdate: (items: Faturamento[]) => void;
}

export const FaturamentoList: React.FC<FaturamentoListProps> = ({ items, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [tipoLavagem, setTipoLavagem] = useState('');
  const [porte, setPorte] = useState<CarSize>(CarSize.MEDIUM);
  const [valor, setValor] = useState('');
  const [pagamento, setPagamento] = useState<PaymentMethod>(PaymentMethod.PIX);
  const [data, setData] = useState(new Date().toISOString().substring(0, 16)); // YYYY-MM-DDTHH:mm

  const filteredItems = items.filter(item => 
    item.tipoLavagem.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const resetForm = () => {
    setTipoLavagem('');
    setPorte(CarSize.MEDIUM);
    setValor('');
    setPagamento(PaymentMethod.PIX);
    setData(new Date().toISOString().substring(0, 16));
    setEditingId(null);
  };

  const handleSave = () => {
    if (!tipoLavagem || !valor) return;

    const entryData = new Date(data).toISOString();

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
    setData(new Date(item.data).toISOString().substring(0, 16));
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
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por tipo de lavagem..."
            className="w-full pl-10 pr-4 py-2 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Registrar Lavagem
        </button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Tipo de Lavagem</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Porte</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Pagamento</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Valor</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Data e Hora</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.tipoLavagem}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                      item.porte === CarSize.SMALL ? 'bg-green-100 text-green-700' :
                      item.porte === CarSize.MEDIUM ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {item.porte}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      {getPaymentIcon(item.pagamento)}
                      {item.pagamento}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">R$ {item.valor.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    <div className="flex flex-col">
                      <span>{new Date(item.data).toLocaleDateString('pt-BR')}</span>
                      <span className="text-xs flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(item.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">{editingId ? 'Editar Registro' : 'Novo Registro de Lavagem'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Lavagem</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ex: Lavagem Simples, Geral, Motor..."
                  value={tipoLavagem}
                  onChange={e => setTipoLavagem(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Porte</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    value={porte}
                    onChange={e => setPorte(e.target.value as CarSize)}
                  >
                    <option value={CarSize.SMALL}>Pequeno</option>
                    <option value={CarSize.MEDIUM}>Médio</option>
                    <option value={CarSize.LARGE}>Grande</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0,00"
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Forma de Pagamento</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(PaymentMethod).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPagamento(method)}
                      className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all ${
                        pagamento === method 
                          ? 'border-blue-600 bg-blue-50 text-blue-600' 
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {getPaymentIcon(method)}
                      <span className="text-xs font-bold mt-1">{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data e Hora do Registro</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={data}
                  onChange={e => setData(e.target.value)}
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 border rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
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
