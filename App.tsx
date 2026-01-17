
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { FaturamentoList } from './components/FaturamentoList';
import { DespesasList } from './components/DespesasList';
import { Relatorios } from './components/Relatorios';
import { Faturamento, Despesa } from './types';
import { storage } from './services/storage';
import { Loader2, CloudOff, Cloud, RefreshCw } from 'lucide-react';

type View = 'dashboard' | 'faturamento' | 'despesas' | 'relatorios';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [faturamentos, setFaturamentos] = useState<Faturamento[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Função centralizada para carregar dados
  const loadData = useCallback(async (showMainLoader = false) => {
    if (showMainLoader) setIsLoading(true);
    setIsSyncing(true);
    
    try {
      const [fat, desp] = await Promise.all([
        storage.getFaturamento(),
        storage.getDespesas()
      ]);
      
      // Atualiza o estado apenas se houver mudança para evitar re-renders desnecessários
      setFaturamentos(fat);
      setDespesas(desp);
    } catch (err) {
      console.error("Falha ao sincronizar dados:", err);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Efeito inicial e Polling (Auto-atualização a cada 30 segundos)
  useEffect(() => {
    loadData(true);

    const interval = setInterval(() => {
      loadData(false);
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [loadData]);

  const handleUpdateFaturamento = async (items: Faturamento[]) => {
    const oldItems = faturamentos;
    // Atualização otimista (mostra na hora)
    setFaturamentos(items);
    
    const isDelete = items.length < oldItems.length;
    const affectedItem = isDelete 
      ? oldItems.find(o => !items.find(n => n.id === o.id))
      : items.find(n => !oldItems.find(o => o.id === n.id) || JSON.stringify(n) !== JSON.stringify(oldItems.find(o => o.id === n.id)));

    try {
      await storage.saveFaturamento(items, affectedItem, isDelete);
      // Força sincronização após salvar para garantir integridade
      await loadData(false);
    } catch (e) {
      console.error("Erro ao salvar faturamento:", e);
      // Reverte em caso de erro crítico (opcional)
      await loadData(false);
    }
  };

  const handleUpdateDespesas = async (items: Despesa[]) => {
    const oldItems = despesas;
    setDespesas(items);
    
    const isDelete = items.length < oldItems.length;
    const affectedItem = isDelete 
      ? oldItems.find(o => !items.find(n => n.id === o.id))
      : items.find(n => !oldItems.find(o => o.id === n.id) || JSON.stringify(n) !== JSON.stringify(oldItems.find(o => o.id === n.id)));

    try {
      await storage.saveDespesas(items, affectedItem, isDelete);
      await loadData(false);
    } catch (e) {
      console.error("Erro ao salvar despesa:", e);
      await loadData(false);
    }
  };

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
          <p className="font-black italic uppercase tracking-widest text-sm animate-pulse">Estabelecendo Conexão...</p>
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
        {/* Status de Sincronização Dinâmico */}
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none transition-all duration-500">
          <div className={`glass px-4 py-2 rounded-full flex items-center gap-3 border-white/20 shadow-2xl ${storage.isCloud() ? 'text-emerald-600' : 'text-amber-600'}`}>
            <div className="relative">
              {isSyncing ? (
                <RefreshCw size={14} className="animate-spin text-blue-500" />
              ) : storage.isCloud() ? (
                <Cloud size={14} />
              ) : (
                <CloudOff size={14} />
              )}
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">
              {isSyncing ? 'Sincronizando...' : storage.isCloud() ? 'Nuvem Conectada' : 'Offline (Local)'}
            </span>
          </div>
        </div>
        
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;
