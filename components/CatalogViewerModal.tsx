
import React from 'react';

interface CatalogViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
}

const CatalogViewerModal: React.FC<CatalogViewerModalProps> = ({ isOpen, onClose, htmlContent }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-4 bg-slate-950/95 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white w-full h-full md:max-w-6xl md:h-[95vh] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-fade-in-up" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header do Visualizador */}
        <div className="bg-brand-blue p-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-white/20 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
             </div>
             <div>
                <h3 className="font-display font-black uppercase text-sm tracking-widest leading-none">Visualização do Catálogo</h3>
                <p className="text-[10px] text-blue-200 font-bold uppercase opacity-80 mt-1">Geração Dinâmica • NR-26 / ISO 7010</p>
             </div>
          </div>
          
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 group">
            <span className="text-[10px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Fechar Leitura</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* O Frame do PDF Gerado via HTML - Ajustado zoom para 75% para ver mais da página */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
            <iframe 
                srcDoc={htmlContent}
                className="w-full h-full border-none shadow-inner"
                style={{ transform: 'scale(0.85)', transformOrigin: 'top center', height: '117.6%', width: '117.6%' }}
                title="Catálogo Gerado"
                sandbox="allow-scripts"
            ></iframe>
            
            {/* Overlay superior para bloquear ferramentas de inspeção rápida */}
            <div className="absolute top-0 left-0 w-full h-8 pointer-events-none bg-gradient-to-b from-black/5 to-transparent"></div>
        </div>

        {/* Footer com Aviso Legal */}
        <div className="bg-slate-50 p-3 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                </svg>
                <span className="text-[9px] font-bold uppercase tracking-widest">Somente Leitura • Download Bloqueado</span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium text-center md:text-right max-w-md">
                Este catálogo é gerado em tempo real. A impressão oficial está reservada para o administrador.
            </p>
        </div>
      </div>
    </div>
  );
};

export default CatalogViewerModal;