
import React, { useState, useEffect } from 'react';
import { MaterialType } from '../types';

interface MaterialPriceManagerProps {
  isOpen: boolean;
  onClose: () => void;
  prices: Record<MaterialType, number>;
  onUpdatePrice: (material: MaterialType, newPrice: number) => void;
}

const MaterialPriceManager: React.FC<MaterialPriceManagerProps> = ({
  isOpen,
  onClose,
  prices,
  onUpdatePrice
}) => {
  const [localPrices, setLocalPrices] = useState<Record<MaterialType, string>>({
      'Vinil Adesivo': '',
      'PVC 2mm': '',
      'PVC 3mm': '',
      'ACM 3mm': '',
      'Banner Impresso': ''
  });

  // Sincroniza estado local quando as props mudam ou modal abre
  useEffect(() => {
      if (isOpen) {
          setLocalPrices({
              'Vinil Adesivo': (prices['Vinil Adesivo'] || 0).toFixed(2),
              'PVC 2mm': (prices['PVC 2mm'] || 0).toFixed(2),
              'PVC 3mm': (prices['PVC 3mm'] || 0).toFixed(2),
              'ACM 3mm': (prices['ACM 3mm'] || 0).toFixed(2),
              'Banner Impresso': (prices['Banner Impresso'] || 0).toFixed(2),
          });
      }
  }, [isOpen, prices]);

  if (!isOpen) return null;

  const handleChange = (material: MaterialType, value: string) => {
      // Permite digitar, validando apenas números e vírgula/ponto
      setLocalPrices(prev => ({ ...prev, [material]: value }));
  };

  const handleBlur = (material: MaterialType) => {
      const stringVal = localPrices[material].replace(',', '.');
      const numVal = parseFloat(stringVal);
      
      if (!isNaN(numVal) && numVal >= 0) {
          onUpdatePrice(material, numVal);
          // Formata de volta para exibição bonita
          setLocalPrices(prev => ({ ...prev, [material]: numVal.toFixed(2) }));
      } else {
          // Reverte se inválido
          setLocalPrices(prev => ({ ...prev, [material]: (prices[material] || 0).toFixed(2) }));
      }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        <div className="bg-emerald-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Tabela de Preços (m²)
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 bg-emerald-50">
            <p className="text-xs text-emerald-700 mb-4 border border-emerald-200 bg-white p-2 rounded">
                ℹ️ <strong>Atenção:</strong> Alterar os valores aqui atualizará automaticamente o preço de venda de <strong>TODAS</strong> as placas da loja com base na área (m²).
            </p>

            <div className="space-y-4">
                {(Object.keys(localPrices) as MaterialType[]).map((material) => (
                    <div key={material} className="flex items-center justify-between bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                        <span className="font-bold text-gray-700 text-sm">{material}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs font-medium">R$ / m²</span>
                            <input 
                                type="text" 
                                value={localPrices[material]}
                                onChange={(e) => handleChange(material, e.target.value)}
                                onBlur={() => handleBlur(material)}
                                className="w-24 text-right font-bold text-emerald-800 border border-emerald-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
            <button 
                onClick={onClose}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded shadow-md text-sm"
            >
                Concluir
            </button>
        </div>

      </div>
    </div>
  );
};

export default MaterialPriceManager;