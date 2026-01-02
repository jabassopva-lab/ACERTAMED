import React, { useState } from 'react';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
}

const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose, code }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }).catch(err => {
      alert("Erro ao copiar automaticamente. Por favor, selecione o texto e copie manualmente (Ctrl+C).");
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-[80vh] border border-slate-700">
        
        <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
          <div>
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-yellow-400">⚡</span> Código Gerado para Vercel
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Copie este código e substitua TODO o conteúdo do arquivo <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">constants.tsx</code>.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 relative bg-slate-950 p-0 overflow-hidden">
            <textarea 
                value={code}
                readOnly
                className="w-full h-full bg-slate-950 text-green-400 font-mono text-xs p-4 focus:outline-none resize-none custom-scrollbar selection:bg-green-900 selection:text-white"
                spellCheck={false}
            />
        </div>

        <div className="bg-slate-800 p-4 border-t border-slate-700 flex justify-end gap-3">
             <button 
                onClick={onClose}
                className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium"
            >
                Fechar
            </button>
            <button 
                onClick={handleCopy}
                className={`px-6 py-2 rounded font-bold text-sm shadow-lg transition-all flex items-center gap-2 ${
                    copySuccess 
                    ? 'bg-green-600 text-white cursor-default' 
                    : 'bg-yellow-500 hover:bg-yellow-400 text-yellow-900 hover:shadow-yellow-500/20'
                }`}
            >
                {copySuccess ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        Copiado!
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.913-.184" />
                        </svg>
                        Copiar Código
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CodeModal;
