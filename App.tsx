
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { FaturamentoList } from './components/FaturamentoList';
import { DespesasList } from './components/DespesasList';
import { Relatorios } from './components/Relatorios';
import { Faturamento, Despesa } from './types';
import { storage } from './services/storage';

type View = 'dashboard' | 'faturamento' | 'despesas' | 'relatorios';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [faturamentos, setFaturamentos] = useState<Faturamento[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);

  useEffect(() => {
    setFaturamentos(storage.getFaturamento());
    setDespesas(storage.getDespesas());
  }, []);

  const handleUpdateFaturamento = (items: Faturamento[]) => {
    setFaturamentos(items);
    storage.saveFaturamento(items);
  };

  const handleUpdateDespesas = (items: Despesa[]) => {
    setDespesas(items);
    storage.saveDespesas(items);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard faturamentos={faturamentos} despesas={despesas} />;
      case 'faturamento':
        return (
          <FaturamentoList 
            items={faturamentos} 
            onUpdate={handleUpdateFaturamento} 
          />
        );
      case 'despesas':
        return (
          <DespesasList 
            items={despesas} 
            onUpdate={handleUpdateDespesas} 
          />
        );
      case 'relatorios':
        return <Relatorios faturamentos={faturamentos} despesas={despesas} />;
      default:
        return <Dashboard faturamentos={faturamentos} despesas={despesas} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderView()}
    </Layout>
  );
};

export default App;
