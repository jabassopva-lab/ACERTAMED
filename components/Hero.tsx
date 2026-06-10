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
        <span class="block text-slate-800 tracking-tight font-black uppercase text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">
          Sinalização de Segurança
        </span>
        <span class="block mt-1">
          <span class="relative inline-block px-4 py-2">
            <span class="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-teal rounded-xl -skew-x-3 shadow-[0_6px_20px_rgba(11,60,36,0.25)]"></span>
            <span class="relative text-white font-black italic tracking-tighter text-3xl sm:text-5xl lg:text-6xl uppercase">
              ${highlightText} AGRO
            </span>
          </span>
        </span>
      `;
    }
    return `<span class="font-black text-brand-blue tracking-tight">${title}</span>`;
  };

  return (
    <section className="relative py-12 sm:py-20 lg:py-24 bg-white overflow-hidden border-b border-slate-200">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ 
             backgroundImage: `linear-gradient(#008751 1px, transparent 1px), linear-gradient(90deg, #008751 1px, transparent 1px)`,
             backgroundSize: '40px 40px' 
           }}>
      </div>
      
      {/* Ambient Lighting Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-teal/5 rounded-full blur-[100px]"></div>
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-brand-blue/5 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading & Text */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Indicator Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-50/70 border border-emerald-200/50 px-4 py-2 rounded-full shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
              </span>
              <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.2em] font-display">
                Sinalização Técnica Agro • Portfólio de Conformidade NR-31
              </span>
            </div>

            <div className="max-w-xl w-full">
                <h1
                  contentEditable={isAdminMode}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => isAdminMode && onTitleChange(e.currentTarget.textContent || '')}
                  className={`font-display text-slate-950 leading-[1.08] ${isAdminMode ? 'cursor-text focus:outline-none ring-2 ring-brand-teal ring-offset-4 rounded' : ''}`}
                  dangerouslySetInnerHTML={{ __html: processTitleHtml() }}
                />
            </div>
            
            <p className="mt-6 text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl tracking-tight">
              Comunicação visual de altíssima durabilidade projetada especificamente para o campo. Placas normativas para <strong className="text-brand-blue font-bold">silos de grãos, usinas, frotas agrícolas e áreas de defensivos</strong> em total conformidade jurídica com a <span className="text-brand-teal font-black underline decoration-2 decoration-brand-teal/30">Norma Regulamentadora NR-31</span>.
            </p>

            {/* Quick Agro Pillars lists */}
            <div className="mt-8 flex flex-wrap gap-3 font-display text-[11px] font-black uppercase tracking-wider text-slate-700">
                <span className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-xl shadow-xs">
                    <span className="text-sm">🌾</span>
                    <span>Silos & Armazenamento</span>
                </span>
                <span className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-xl shadow-xs">
                    <span className="text-sm">🚜</span>
                    <span>Maquinários e Frotas</span>
                </span>
                <span className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-xl shadow-xs">
                    <span className="text-sm">⚡</span>
                    <span>Subestações e Elétrica</span>
                </span>
                <span className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-xl shadow-xs">
                    <span className="text-sm">🛡️</span>
                    <span>Área de Defensivos</span>
                </span>
            </div>

            <div className="mt-10 flex items-center gap-3 bg-brand-blue/5 border border-brand-blue/10 px-4 py-3 rounded-2xl max-w-xl">
              <span className="text-xl">💡</span>
              <p className="text-xs text-brand-blue font-bold leading-tight">
                Personalizamos todas as placas com as cores oficiais e a logotipo da sua fazenda ou cooperativa agropecuária para fortalecimento de marca.
              </p>
            </div>
          </div>

          {/* Right Column: Beautiful Masked Silos and Farm Photo */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <div className="relative w-full max-w-[440px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200/50 bg-slate-100 group">
              <img 
                src="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=700&q=85" 
                alt="Silos de grãos e fazenda de soja moderna" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25"></div>

              {/* Float Information Badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between gap-2 items-center">
                <span className="bg-brand-blue/95 backdrop-blur-md text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full shadow border border-white/20 tracking-wider">
                  Alta Resistência UV
                </span>
                <span className="bg-emerald-600/95 backdrop-blur-md text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-full shadow border border-white/20 tracking-wider">
                  NR-31 Aprovada
                </span>
              </div>

              {/* Content bottom box */}
              <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                <div className="flex items-center gap-1.5 mb-1 bg-brand-teal text-white w-fit px-2 py-0.5 rounded text-[8px] font-black uppercase">
                  <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  Garantia de Qualidade
                </div>
                <h3 className="font-display font-black text-xl leading-tight uppercase drop-shadow-md">
                  Placas Metálicas & PVC
                </h3>
                <p className="text-xs text-slate-200 font-medium leading-normal mt-1 drop-shadow-sm">
                  Desenvolvidas com película protetora antipoeira e antichuva para durabilidade estendida em ambientes severos de poeira de grão e sol do Cerrado.
                </p>
              </div>
            </div>

            {/* Decorative background stripes representing hazard colors */}
            <div className="absolute -bottom-4 -right-4 -z-10 w-24 h-24 bg-safety-yellow/15 rounded-2xl pointer-events-none border border-safety-yellow/30"></div>
            <div className="absolute -top-4 -left-4 -z-10 w-32 h-32 bg-brand-teal/10 rounded-full blur-2xl pointer-events-none"></div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-teal/20 to-transparent"></div>
    </section>
  );
};

export default Hero;
