
import React from 'react';

interface HeroProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  isAdminMode: boolean;
}

const Hero: React.FC<HeroProps> = ({ title, onTitleChange, isAdminMode }) => {
  const processTitleHtml = () => {
    if (!title) return '';
    
    const highlightText = "DO TRABALHO";
    
    if (title.includes(highlightText)) {
      return `
        <span class="font-light block sm:inline opacity-80 text-brand-blue tracking-[0.1em] mb-2 sm:mb-0">SINALIZAÇÃO DE</span>
        <span class="block mt-1 sm:mt-0">
          <span class="font-black text-slate-900 tracking-tighter">SEGURANÇA</span>
          <span class="relative inline-block px-3 py-1 ml-1">
            <span class="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-teal rounded-md -skew-x-3 shadow-[0_4px_15px_rgba(29,78,137,0.3)]"></span>
            <span class="relative text-white font-black italic tracking-tighter">${highlightText}</span>
          </span>
        </span>
      `;
    }
    return `<span class="font-black text-brand-blue tracking-tight">${title}</span>`;
  };

  return (
    <section className="relative py-16 sm:py-24 bg-white overflow-hidden border-b border-slate-200">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ 
             backgroundImage: `linear-gradient(#009BA5 1px, transparent 1px), linear-gradient(90deg, #009BA5 1px, transparent 1px)`,
             backgroundSize: '40px 40px' 
           }}>
      </div>
      
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-teal/5 rounded-full blur-[100px]"></div>
      <div className="absolute top-1/2 -right-24 w-64 h-64 bg-brand-blue/5 rounded-full blur-[80px]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full shadow-sm border border-slate-100 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
                </span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-display">
                    ACERTAMED • PADRÃO TÉCNICO INDUSTRIAL
                </span>
            </div>
        </div>
        
        <div className="max-w-5xl mx-auto">
            <h1
              contentEditable={isAdminMode}
              suppressContentEditableWarning={true}
              onBlur={(e) => isAdminMode && onTitleChange(e.currentTarget.textContent || '')}
              className={`text-4xl sm:text-6xl lg:text-8xl font-display text-slate-900 leading-[0.85] uppercase ${isAdminMode ? 'cursor-text focus:outline-none ring-2 ring-brand-teal ring-offset-4 rounded' : ''}`}
              dangerouslySetInnerHTML={{ __html: processTitleHtml() }}
            />
        </div>
        
        <div className="mt-12 flex flex-col items-center">
            <p className="max-w-2xl text-lg text-slate-500 font-medium leading-relaxed mb-8 tracking-tight">
                Consultoria e gestão visual para ambientes de alta complexidade. Garantimos 
                <span className="text-brand-blue font-bold"> conformidade normativa</span> e segurança jurídica para seu projeto.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 font-display">
                <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-teal rounded-full"></div> 
                    Gestão NR-26
                </span>
                <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-teal rounded-full"></div> 
                    ISO 7010
                </span>
                <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-teal rounded-full"></div> 
                    Projetos Técnicos
                </span>
            </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-teal/20 to-transparent"></div>
    </section>
  );
};

export default Hero;
