
import React, { useState } from 'react';

interface QuickRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (name: string, city: string) => void;
}

const QuickRegisterModal: React.FC<QuickRegisterModalProps> = ({ isOpen, onClose, onRegister }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && city.trim()) {
      onRegister(name, city);
    } else {
      alert("Por favor, preencha Nome e Cidade para continuar.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de Fechar (X) */}
        <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-2 transition-colors z-10"
            title="Fechar"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>

        {/* Cabeçalho Visual */}
        <div className="bg-theme-green-600 p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md border-2 border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Acesso Rápido</h2>
            <p className="text-theme-green-100 text-sm">Identifique-se para visualizar e editar.</p>
        </div>

        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Seu Nome ou Empresa</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-green-500 focus:border-theme-green-500 outline-none transition-all"
                            placeholder="Ex: João Silva ou Empresa X"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Sua Cidade</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.006.003.002.001.003.001a.75.75 0 0 1-.01-.001Z" clipRule="evenodd" />
                                <path d="M5.5 9a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Z" />
                            </svg>
                        </div>
                        <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-green-500 focus:border-theme-green-500 outline-none transition-all"
                            placeholder="Ex: Primavera do Leste"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-theme-green-600 hover:bg-theme-green-700 text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-theme-green-200 transition-all transform hover:-translate-y-0.5 mt-2 text-base flex items-center justify-center gap-2"
                >
                    Liberar Catálogo
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </form>
            
            <p className="text-center text-[10px] text-gray-400 mt-4">
                Ao continuar, você concorda em liberar o acesso demonstrativo.
            </p>
        </div>
      </div>
    </div>
  );
};

export default QuickRegisterModal;
