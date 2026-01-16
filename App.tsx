
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { FaturamentoList } from './components/FaturamentoList';
import { DespesasList } from './components/DespesasList';
import { Relatorios } from './components/Relatorios';
import { Faturamento, Despesa } from './types';
import { storage } from './services/storage';
import { Loader2, CloudOff, Cloud } from 'lucide-react';

type View = 'dashboard' | 'faturamento' | 'despesas' | 'relatorios';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [faturamentos, setFaturamentos] = useState<Faturamento[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [fat, desp] = await Promise.all([
          storage.getFaturamento(),
          storage.getDespesas()
        ]);
        setFaturamentos(fat);
        setDespesas(desp);
      } catch (err) {
        console.error("Falha ao carregar dados remotos", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleUpdateFaturamento = async (items: Faturamento[]) => {
    const oldItems = faturamentos;
    setFaturamentos(items);
    
    // Identificar se foi adição/edição ou exclusão para o Supabase
    const isDelete = items.length < oldItems.length;
    const affectedItem = isDelete 
      ? oldItems.find(o => !items.find(n => n.id === o.id))
      : items.find(n => !oldItems.find(o => o.id === n.id) || JSON.stringify(n) !== JSON.stringify(oldItems.find(o => o.id === n.id)));

    await storage.saveFaturamento(items, affectedItem, isDelete);
  };

  const handleUpdateDespesas = async (items: Despesa[]) => {
    const oldItems = despesas;
    setDespesas(items);
    
    const isDelete = items.length < oldItems.length;
    const affectedItem = isDelete 
      ? oldItems.find(o => !items.find(n => n.id === o.id))
      : items.find(n => !oldItems.find(o => o.id === n.id) || JSON.stringify(n) !== JSON.stringify(oldItems.find(o => o.id === n.id)));

    await storage.saveDespesas(items, affectedItem, isDelete);
  };

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
          <p className="font-black italic uppercase tracking-widest text-sm animate-pulse">Sincronizando com a Nuvem...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard faturamentos={faturamentos} despesas={despesas} />;
      case 'faturamento':
        return <FaturamentoList items={faturamentos} onUpdate={handleUpdateFaturamento} />;
      case 'despesas':
        return <DespesasList items={despesas} onUpdate={handleUpdateDespesas} />;
      case 'relatorios':
        return <Relatorios faturamentos={faturamentos} despesas={despesas} />;
      default:
        return <Dashboard faturamentos={faturamentos} despesas={despesas} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      <div className="relative">
        {/* Status de Sincronização */}
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
          <div className={`glass px-4 py-2 rounded-full flex items-center gap-2 border-white/20 shadow-2xl transition-all ${storage.isCloud() ? 'text-emerald-600' : 'text-amber-600'}`}>
            {storage.isCloud() ? <Cloud size={14} /> : <CloudOff size={14} />}
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
              {storage.isCloud() ? 'Nuvem Ativa' : 'Modo Local'}
            </span>
          </div>
        </div>
        
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;
