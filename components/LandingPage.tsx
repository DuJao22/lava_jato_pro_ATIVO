
import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  BarChart3, 
  LayoutDashboard,
  Gauge,
  Play,
  MessageCircle
} from 'lucide-react';

interface LandingPageProps {
  onEnterSystem: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterSystem }) => {
  // Configuração do WhatsApp
  const phoneNumber = "5531995281707";
  const message = "Olá João Layon! Vi o sistema Lava-jato Pro pela DS Digital Solutions e tenho interesse em profissionalizar meu negócio.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white overflow-x-hidden pb-20 md:pb-0">
      
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full z-50 glass-dark border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
               <Gauge size={24} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black italic uppercase tracking-tighter leading-none">Lava-jato</span>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Pro Edition</span>
            </div>
          </div>
          <button 
            onClick={onEnterSystem}
            className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all"
          >
            Área do Cliente <ArrowRight size={12} />
          </button>
        </div>
      </nav>

      {/* Hero Section - O Impacto Inicial */}
      <header className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/30 px-4 py-1.5 rounded-full animate-fade-in-up">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">Sistema Financeiro V 1.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight bg-gradient-to-b from-white via-white to-slate-500 bg-clip-text text-transparent">
            Abandone o Caderno e <br className="hidden md:block" />
            <span className="text-blue-500">Pare de Perder Dinheiro.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            O único sistema desenvolvido pela <strong>DS Digital Solutions</strong> especificamente para donos de Lava-jato que querem profissionalizar a gestão, controlar o caixa e ver o lucro real na palma da mão.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <button 
              onClick={onEnterSystem}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
            >
              <Play fill="currentColor" size={16} /> Acessar Sistema Agora
            </button>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2 md:mt-0">
              * Acesso imediato • Sem instalação
            </p>
          </div>
        </div>
      </header>

      {/* A Verdade Cruel: O Malefício de não ter sistema */}
      <section className="py-20 bg-slate-900/50 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-white">Você está "trabalhando cego"?</h2>
            <p className="text-slate-400">A diferença entre um lava-jato amador e um profissional está aqui.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* O Jeito Velho */}
            <div className="bg-red-950/20 p-8 rounded-[2rem] border border-red-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 bg-red-600/20 rounded-bl-2xl border-l border-b border-red-500/20">
                <span className="text-red-500 font-black uppercase text-xs tracking-widest">Jeito Amador</span>
              </div>
              <ul className="space-y-6 mt-4">
                {[
                  "Anotações em caderno que molha e rasga",
                  "Mistura dinheiro pessoal com o da empresa",
                  "Nunca sabe quanto lucrou no fim do dia",
                  "Esquece de cobrar pagamentos pendentes",
                  "Sem histórico de clientes ou serviços"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                    <XCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-sm font-bold text-slate-300 uppercase">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* O Jeito Pro */}
            <div className="bg-emerald-950/20 p-8 rounded-[2rem] border border-emerald-500/20 relative overflow-hidden shadow-2xl shadow-emerald-900/20 scale-105 z-10">
              <div className="absolute top-0 right-0 p-4 bg-emerald-600/20 rounded-bl-2xl border-l border-b border-emerald-500/20">
                <span className="text-emerald-500 font-black uppercase text-xs tracking-widest">Lava-jato Pro</span>
              </div>
              <ul className="space-y-6 mt-4">
                {[
                  "Controle total no celular ou computador",
                  "Separação clara de Faturamento vs. Gastos",
                  "Cálculo automático de Lucro Líquido",
                  "Relatórios profissionais em Excel/PDF",
                  "Histórico completo e seguro na nuvem"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                    <span className="text-sm font-black text-white uppercase tracking-wide">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades Grid */}
      <section className="py-24 px-6 relative">
         <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-center mb-16">
              Tudo o que você precisa <br />
              <span className="text-blue-600 text-2xl not-italic font-black tracking-[0.3em]">Em um único lugar</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-dark p-8 rounded-[2rem] hover:bg-white/5 transition-colors border border-white/5 group">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                  <LayoutDashboard className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-black uppercase italic mb-3">Dashboard em Tempo Real</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Veja quantos carros lavou, ticket médio e faturamento do dia instantaneamente. Gráficos visuais para decisões rápidas.
                </p>
              </div>

              <div className="glass-dark p-8 rounded-[2rem] hover:bg-white/5 transition-colors border border-white/5 group">
                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform">
                  <Smartphone className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-black uppercase italic mb-3">Mobile First</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Não precisa de computador. O sistema roda liso no seu celular, tablet ou notebook. Lance lavagens enquanto caminha pelo pátio.
                </p>
              </div>

              <div className="glass-dark p-8 rounded-[2rem] hover:bg-white/5 transition-colors border border-white/5 group">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                  <BarChart3 className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-black uppercase italic mb-3">Relatórios de Elite</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                  Emita extratos de performance que impressionam. Saiba exatamente para onde está indo cada centavo da sua empresa.
                </p>
              </div>
            </div>
         </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900 to-slate-900 p-10 md:p-16 rounded-[3rem] text-center border border-blue-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-6">
              Pronto para elevar o nível?
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
              Junte-se a gestores que transformaram seus lava-jatos em negócios lucrativos e organizados.
            </p>
            <button 
              onClick={onEnterSystem}
              className="bg-white text-blue-900 px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
            >
              <Zap size={20} className="text-blue-600" fill="currentColor" /> Testar Sistema Agora
            </button>
          </div>
        </div>
      </section>

      {/* Botão Flutuante do WhatsApp */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-[0_0_30px_rgba(37,211,102,0.5)] hover:shadow-[0_0_50px_rgba(37,211,102,0.7)] transition-all duration-300 hover:scale-110 flex items-center gap-0 group-hover:gap-3 overflow-hidden">
          <MessageCircle size={28} fill="currentColor" className="shrink-0" />
          <span className="max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-500 ease-in-out whitespace-nowrap font-black uppercase text-[10px] tracking-widest text-white">
            Falar com João Layon
          </span>
        </div>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </a>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-600 border-t border-white/5 bg-black/20">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Ambiente Seguro & Criptografado</span>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest">
            © 2025 Lava-jato Pro Edition.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-[9px] uppercase tracking-wider">
            <span className="text-slate-500 font-bold">Desenvolvido por</span>
            <span className="text-white font-black bg-white/5 px-2 py-0.5 rounded border border-white/10">João Layon</span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span className="text-blue-500 font-black">DS Digital Solutions</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
