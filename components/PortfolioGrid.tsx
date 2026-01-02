
import React, { useMemo, useState } from 'react';
import { Sign, SignCategory, MaterialType } from '../types';
import SignCard from './SignCard';

interface PortfolioGridProps {
  signs: Sign[];
  searchTerm: string; 
  onSearchChange: (term: string) => void;
  onSignClick: (sign: Sign) => void;
  onSignContentChange: (signId: number, field: 'title' | 'description', value: string) => void;
  onImageUpload: (signId: number, file: File) => void;
  onAddNewSign: (category: SignCategory) => void;
  onNewSignUrlClick: (category: SignCategory, url?: string) => void; 
  onSortSigns: () => void; 
  onDeleteSign?: (signId: number) => void; 
  isAdminMode: boolean;
  isSubscriber: boolean; 
  onToggleVisibility: (signId: number) => void;
  onApproveSign?: (signId: number, category: SignCategory) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  materialPrices?: Record<MaterialType, number>;
  pdfCatalogUrl?: string;
  priceMultiplier?: number;
}

const ALL_CATEGORIES = 'Todos';

// Ordem de prioridade rigorosa definida pelo usuário
const CATEGORY_PRIORITY: Record<string, number> = {
  [SignCategory.Custom]: 1,      // 1 PLACAS EDITAVEIS
  [SignCategory.Warning]: 2,     // 2 AVISO
  [SignCategory.Attention]: 3,   // 3 ATENÇÃO
  [SignCategory.Security]: 4,    // 4 SEGURANÇA
  [SignCategory.Info]: 5,        // 5 INFORMATIVAS
  [SignCategory.Danger]: 6,      // 6 PERIGO
  [SignCategory.Prohibition]: 7, // 7 PROIBIÇÃO
  [SignCategory.Emergency]: 8,   // 8 EMERGENCIA
  [SignCategory.Fire]: 9,        // 9 COMBATE A INCENDIO
  [SignCategory.Traffic]: 10,    // 10 TRANSITO
  [SignCategory.Mandatory]: 11,  // Obrigatório (Caso exista algum fora da lista 1-10)
};

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ 
    signs, 
    searchTerm,
    onSearchChange,
    onSignClick, 
    onSignContentChange, 
    onImageUpload, 
    onAddNewSign, 
    onNewSignUrlClick, 
    onSortSigns,
    onDeleteSign,
    isAdminMode, 
    isSubscriber, 
    onToggleVisibility,
    onApproveSign,
    activeCategory,
    onCategoryChange,
    materialPrices,
    pdfCatalogUrl,
    priceMultiplier = 1
}) => {
  const [isAddingUrl, setIsAddingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState('');

  const filteredSigns = useMemo(() => {
    // 1. Filtragem inicial
    const filtered = signs.filter(sign => {
      const categoryMatch = activeCategory === ALL_CATEGORIES || sign.category === activeCategory;
      const term = searchTerm.toLowerCase();
      const searchMatch = sign.title.toLowerCase().includes(term) || 
                          (sign.description && sign.description.toLowerCase().includes(term));
      const visibilityMatch = isAdminMode ? true : !sign.isHidden;
      return categoryMatch && searchMatch && visibilityMatch;
    });

    // 2. Ordenação Estruturada pela prioridade de categorias
    return [...filtered].sort((a, b) => {
        const priorityA = CATEGORY_PRIORITY[a.category] || 99;
        const priorityB = CATEGORY_PRIORITY[b.category] || 99;

        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        // Se mesma categoria, ordena por ID (mais novos primeiro)
        return b.id - a.id;
    });
  }, [signs, activeCategory, searchTerm, isAdminMode]);

  const categories = useMemo(() => {
    const allCats = Object.values(SignCategory);
    const sorted = allCats.sort((a, b) => {
        const prioA = CATEGORY_PRIORITY[a] || 99;
        const prioB = CATEGORY_PRIORITY[b] || 99;
        return prioA - prioB;
    });
    return [ALL_CATEGORIES, ...sorted];
  }, []);

  const getCategoryColor = (category: SignCategory | 'Todos') => {
    switch(category) {
        case SignCategory.Custom: return 'hover:bg-purple-100 hover:text-purple-700';
        case SignCategory.Warning: return 'hover:bg-safety-yellow/20 hover:text-safety-yellow';
        case SignCategory.Attention: return 'hover:bg-safety-yellow/20 hover:text-safety-yellow';
        case SignCategory.Danger: return 'hover:bg-safety-red/20 hover:text-safety-red';
        case SignCategory.Mandatory: return 'hover:bg-safety-blue/20 hover:text-safety-blue';
        case SignCategory.Prohibition: return 'hover:bg-safety-red/20 hover:text-safety-red';
        case SignCategory.Emergency: return 'hover:bg-safety-green/20 hover:text-safety-green';
        default: return 'hover:bg-brand-teal/10 hover:text-brand-teal';
    }
  };

  const getActiveCategoryColor = (category: SignCategory | 'Todos') => {
     switch(category) {
        case SignCategory.Custom: return 'bg-purple-600 text-white border-purple-600';
        case SignCategory.Warning: return 'bg-safety-yellow text-slate-900 border-safety-yellow';
        case SignCategory.Attention: return 'bg-safety-yellow text-slate-900 border-safety-yellow';
        case SignCategory.Danger: return 'bg-safety-red text-white border-safety-red';
        case SignCategory.Mandatory: return 'bg-safety-blue text-white border-safety-blue';
        case SignCategory.Prohibition: return 'bg-safety-red text-white border-safety-red';
        case SignCategory.Emergency: return 'bg-safety-green text-white border-safety-green';
        default: return 'bg-brand-teal text-white border-brand-teal';
    }
  };

  const handleConfirmUrl = () => {
    if (tempUrl.trim()) {
      const cat = activeCategory === ALL_CATEGORIES ? SignCategory.Warning : activeCategory as SignCategory;
      onNewSignUrlClick(cat, tempUrl.trim());
      setTempUrl('');
      setIsAddingUrl(false);
    }
  };

  const handleAddNewBlank = () => {
    const cat = activeCategory === ALL_CATEGORIES ? SignCategory.Warning : activeCategory as SignCategory;
    onAddNewSign(cat);
  };

  return (
    <section id="portfolio" className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        
        {/* Painel de Criação (Apenas Admin) */}
        {isAdminMode && (
          <div className="mb-12 animate-fade-in">
            <div className="flex items-center gap-2 mb-4 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              <h3 className="text-sm font-black uppercase tracking-widest">Painel de Criação</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              {!isAddingUrl ? (
                <button 
                  onClick={() => setIsAddingUrl(true)}
                  className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-blue-400 rounded-2xl hover:bg-blue-50 transition-all group"
                >
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                  </div>
                  <span className="text-blue-700 font-black uppercase text-sm">Nova via URL</span>
                  <span className="text-blue-400 text-[10px] font-bold mt-1 uppercase">Link do Cloud/Drive</span>
                </button>
              ) : (
                <div className="flex flex-col p-6 bg-white border-2 border-blue-400 rounded-2xl animate-fade-in shadow-lg">
                  <label className="text-[10px] font-black text-blue-600 uppercase mb-2">Cole o Link da Imagem</label>
                  <input 
                    type="text" 
                    autoFocus
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full border-2 border-slate-100 rounded-lg p-3 text-xs mb-4 outline-none focus:border-blue-400 font-medium"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => { setIsAddingUrl(false); setTempUrl(''); }} className="flex-1 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors">Cancelar</button>
                    <button onClick={handleConfirmUrl} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase shadow-md hover:bg-blue-700 transition-colors">Confirmar</button>
                  </div>
                </div>
              )}

              <button 
                onClick={handleAddNewBlank}
                className="flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-green-400 rounded-2xl hover:bg-green-50 transition-all group"
              >
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-green-600"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </div>
                <span className="text-green-700 font-black uppercase text-sm">Nova Placa</span>
                <span className="text-green-400 text-[10px] font-bold mt-1 uppercase">Modelo em Branco</span>
              </button>
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto mb-8 relative">
            <input 
                type="text" 
                placeholder="Buscar placa..." 
                className="block w-full px-4 py-3 border border-gray-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>

        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-2 p-2 bg-white rounded-full shadow-sm border border-slate-100">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 border ${
                  activeCategory === category
                    ? getActiveCategoryColor(category as SignCategory | 'Todos')
                    : `text-slate-600 border-transparent ${getCategoryColor(category as SignCategory | 'Todos')}`
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredSigns.length === 0 ? (
            <div className="text-center py-20">
                <p className="text-gray-500 font-bold">Nenhuma placa encontrada.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredSigns.map((sign) => (
                <SignCard 
                  key={sign.id} 
                  sign={sign} 
                  onClick={() => onSignClick(sign)}
                  onSignContentChange={onSignContentChange}
                  onImageUpload={onImageUpload}
                  onDeleteSign={onDeleteSign}
                  isAdminMode={isAdminMode}
                  isSubscriber={isSubscriber}
                  onToggleVisibility={() => onToggleVisibility(sign.id)}
                  onApproveSign={onApproveSign}
                  materialPrices={materialPrices}
                  priceMultiplier={priceMultiplier}
                />
              ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioGrid;
