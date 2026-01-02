
import React from 'react';
import { Subscriber } from '../types';

interface SubscriptionBannerProps {
  onSubscribeClick: () => void;
  currentSubscriber?: Subscriber | null;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ 
  onSubscribeClick, 
  currentSubscriber,
}) => {
  const hasActiveAccess = currentSubscriber && currentSubscriber.isActive;

  return (
    <section id="acesso" className="bg-gradient-to-br from-brand-blue to-brand-teal text-white py-10 relative overflow-hidden shadow-xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-white/10"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        
        <div className="text-center lg:text-left max-w-4xl">
          <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20 mb-4 inline-block font-display">
            Acesso ao Sistema Técnico
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-black text-white mb-3 tracking-tight uppercase">
            Acesse o banco de dados normatizado
          </h2>
          <p className="text-teal-50/80 text-sm md:text-base max-w-2xl font-medium">
            Identifique-se para consultar toda a biblioteca de sinalização técnica e gerar memoriais descritivos para seus projetos de SST.
          </p>
        </div>
        
        <div className="shrink-0 w-full lg:w-auto">
           {hasActiveAccess ? (
              <button 
                onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-white text-brand-blue hover:bg-teal-50 font-black text-sm py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg transform hover:scale-105 font-display"
              >
                  ACESSO AUTORIZADO • ABRIR SISTEMA
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-brand-teal">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                  </svg>
              </button>
           ) : (
             <button 
                onClick={() => onSubscribeClick()}
                className="w-full sm:w-auto bg-white hover:bg-teal-50 text-brand-blue py-4 px-10 rounded-2xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 group font-display"
              >
                <span className="text-lg font-black uppercase tracking-tighter">LIBERAR ACESSO AO SISTEMA</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 text-brand-teal group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
           )}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionBanner;
