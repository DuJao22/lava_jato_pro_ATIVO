
import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Receipt, 
  FileBarChart, 
  Gauge
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setView: (view: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Início', shortLabel: 'Painel', icon: LayoutDashboard },
    { id: 'faturamento', label: 'Lavagens', shortLabel: 'Lavar', icon: Car },
    { id: 'despesas', label: 'Gastos', shortLabel: 'Gastos', icon: Receipt },
    { id: 'relatorios', label: 'Relatórios', shortLabel: 'Relats', icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-x-hidden bg-transparent">
      {/* Sidebar - Desktop (Hidden on Mobile) */}
      <aside className="hidden md:flex flex-col w-72 glass-dark text-white m-4 rounded-[2.5rem] overflow-hidden shadow-2xl border-white/5">
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/50">
            <Gauge className="w-8 h-8 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Lava-jato</span>
            <span className="block text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase -mt-1">Pro Edition</span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 translate-x-1' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="font-bold text-sm tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest text-center">João Layón © 2025</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen pb-[100px] md:pb-0">
        {/* Mobile Header */}
        <header className="md:hidden pt-[var(--safe-top)] px-6 py-4 flex items-center justify-between sticky top-0 z-30 bg-slate-950/50 backdrop-blur-md">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Gauge size={20} className="text-white" />
             </div>
             <h1 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">
               Dashboard
               <span className="block text-[8px] text-blue-500 tracking-[0.2em] font-black not-italic">Lava-jato Pro</span>
             </h1>
           </div>
           <div className="text-[10px] font-black text-white/40 uppercase bg-white/5 px-4 py-2 rounded-full border border-white/10">
              {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
           </div>
        </header>

        {/* Page Title - Desktop Only */}
        <header className="hidden md:flex h-24 items-center px-12 justify-between">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{currentView}</h2>
        </header>

        <div className="flex-1 px-4 md:px-12 py-4">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile (iOS Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-dark border-t border-white/10 ios-bottom-nav px-6">
        <div className="flex items-center justify-between py-3 max-w-lg mx-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive ? 'text-blue-500 scale-110' : 'text-slate-500 opacity-60'
                }`}
              >
                <div className={`p-2 rounded-xl ${isActive ? 'bg-blue-500/10' : ''}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
