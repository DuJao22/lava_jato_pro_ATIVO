
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Receipt, 
  FileBarChart, 
  Menu, 
  X,
  Gauge
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setView: (view: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard },
    { id: 'faturamento', label: 'Nova Lavagem', icon: Car },
    { id: 'despesas', label: 'Gestão de Gastos', icon: Receipt },
    { id: 'relatorios', label: 'Relatórios', icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 glass-dark text-white shadow-2xl m-4 rounded-3xl overflow-hidden">
        <div className="p-8 flex items-center gap-3 border-b border-white/10">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/50">
            <Gauge className="w-8 h-8 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Lava-jato</span>
            <span className="block text-blue-500 text-xs font-bold tracking-widest uppercase -mt-1">Pro Edition</span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 translate-x-1' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="font-bold text-sm tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/10 text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black mb-1">Engenharia de Software</p>
          <span className="text-sm font-bold text-slate-300 italic">João Layón</span>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden glass-dark text-white p-5 flex items-center justify-between sticky top-0 z-50 m-2 rounded-2xl">
        <div className="flex items-center gap-2">
          <Gauge className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-black tracking-tighter italic">Lava-jato Pro</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-white/10 rounded-lg">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 glass-dark z-40 flex flex-col items-center justify-center p-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-center gap-4 py-6 rounded-2xl mb-4 text-2xl font-black italic ${
                  currentView === item.id ? 'text-blue-500' : 'text-slate-400'
                }`}
              >
                <Icon className="w-8 h-8" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="mt-12 text-slate-500 text-sm font-bold uppercase tracking-widest">
             João Layón Developer
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-2 md:p-4 overflow-y-auto">
        <header className="hidden md:flex h-20 items-center px-8 justify-between">
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">{currentView}</h1>
          <div className="glass px-6 py-2 rounded-2xl text-slate-800 font-bold shadow-lg border-white/50 text-sm">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </header>

        <div className="flex-1 pb-20 md:pb-8 px-2 md:px-8">
          {children}
        </div>

        <footer className="mt-auto py-6 px-8 flex flex-col md:flex-row items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-widest">
          <div>&copy; {new Date().getFullYear()} Lava-jato Pro Management System</div>
          <div className="mt-2 md:mt-0 glass px-4 py-1 rounded-full border-white/10 text-white/60">
            Desenvolvido por João Layón
          </div>
        </footer>
      </main>
    </div>
  );
};
