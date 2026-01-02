
import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminMode: boolean;
  reseller?: string;
  onGenerateFreeAccess: (name: string, city: string, resellerName?: string) => any;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  reseller, 
  onGenerateFreeAccess 
}) => {
  const [step, setStep] = useState<'selection' | 'form' | 'success'>('selection');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [accessKey, setAccessKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && city.trim()) {
      const newSub = onGenerateFreeAccess(name, city, reseller);
      setAccessKey(newSub.accessKey);
      setStep('success');
    }
  };

  const handleCopyKey = () => {
    if (accessKey) {
      navigator.clipboard.writeText(accessKey);
      alert("Chave de acesso copiada!");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()}>
        
        <div className="bg-brand-blue p-6 text-white flex justify-between items-center shrink-0 border-b border-white/10">
          <h2 className="text-xl font-display font-black uppercase tracking-tight">Acesso ao Catálogo</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white bg-white/10 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8">
          {step === 'selection' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-4xl">🏗️</span>
              </div>
              <h3 className="text-2xl font-display font-black text-slate-900 uppercase mb-2">Acesso Liberado</h3>
              <p className="text-slate-500 mb-8 text-sm font-medium">Visualize nosso catálogo completo e gere relatórios de escolhas de sinalização para seu projeto.</p>
              <button 
                onClick={() => setStep('form')}
                className="w-full py-4 bg-brand-teal text-white font-display font-black rounded-xl hover:bg-brand-teal/90 shadow-lg transition-all uppercase tracking-widest text-lg"
              >
                Começar Agora
              </button>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
              <p className="text-center text-sm text-slate-600 mb-6 font-medium">Identifique-se para liberar o sistema.</p>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Seu Nome / Empresa</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-teal outline-none font-medium text-slate-800"
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Sua Cidade</label>
                <input 
                  type="text" 
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-teal outline-none font-medium text-slate-800"
                  placeholder="Ex: Primavera do Leste - MT"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-brand-blue text-white font-display font-black rounded-xl hover:bg-slate-900 transition-colors uppercase tracking-widest text-base shadow-xl mt-4"
              >
                Gerar Chave de Acesso 🚀
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center text-center py-4 animate-fade-in">
              <div className="w-16 h-16 bg-brand-teal/10 text-brand-teal rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>
              <h3 className="text-2xl font-display font-black text-slate-900 mb-2 uppercase">Sucesso!</h3>
              <p className="text-slate-500 text-sm mb-8 font-medium">Sua chave de acesso foi gerada. Utilize-a para entrar no sistema.</p>
              
              <div className="bg-slate-50 border-2 border-slate-100 p-6 rounded-2xl w-full mb-8">
                <span className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em]">Sua Chave de Acesso</span>
                <span className="text-3xl font-mono font-black text-brand-blue tracking-widest select-all">{accessKey}</span>
              </div>

              <button 
                onClick={handleCopyKey}
                className="w-full py-4 bg-brand-blue text-white font-display font-black rounded-xl hover:bg-slate-900 transition-colors uppercase text-base mb-4 shadow-lg"
              >
                Copiar Chave
              </button>
              <button 
                onClick={onClose}
                className="text-xs font-bold text-slate-400 hover:text-brand-teal underline uppercase tracking-tighter"
              >
                Fechar e acessar catálogo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
