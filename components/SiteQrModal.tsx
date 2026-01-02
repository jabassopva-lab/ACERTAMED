
import React, { useState, useEffect } from 'react';

interface SiteQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
}

const SiteQrModal: React.FC<SiteQrModalProps> = ({ isOpen, onClose, storeName }) => {
  const [qrUrl, setQrUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      const url = window.location.href;
      setCurrentUrl(url);
      // Utiliza a API do QRServer para gerar o QR Code dinamicamente
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=png&margin=10&data=${encodeURIComponent(url)}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-loja-${storeName.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Erro ao baixar. Tente clicar com o botão direito na imagem e 'Salvar como'.");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center h-[100dvh] w-screen p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-fade-in-up m-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão X de Fechar - Mais visível e maior */}
        <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-white bg-red-500 hover:bg-red-600 rounded-full p-2 transition-colors shadow-md z-10"
            title="Fechar"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>

        <div className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand-teal/10 text-brand-teal rounded-full flex items-center justify-center mb-4 border border-brand-teal/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                </svg>
            </div>

            <h3 className="text-xl font-display font-black text-slate-900 mb-1 uppercase tracking-tight">QR Code da Loja</h3>
            <p className="text-xs text-slate-500 mb-6 max-w-[250px] font-medium leading-tight">
                Aponte a câmera para acessar: <br/>
                <span className="text-brand-teal font-mono text-[10px] break-all font-bold">{currentUrl}</span>
            </p>

            <div className="bg-slate-50 p-3 border-2 border-slate-100 rounded-2xl shadow-inner mb-6 flex items-center justify-center">
                {qrUrl ? (
                    <img src={qrUrl} alt="QR Code do Site" className="w-48 h-48 object-contain mix-blend-multiply" />
                ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-slate-300 font-bold text-xs uppercase tracking-widest">
                        Carregando...
                    </div>
                )}
            </div>

            <button 
                onClick={handleDownload}
                className="w-full bg-brand-teal text-white font-display font-black py-4 px-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 12.75l-3.3-3.3m6.6 0l-3.3 3.3m0 0V3.75" />
                </svg>
                Baixar QR Code
            </button>
            <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-tighter">
                Compartilhe sua loja com facilidade.
            </p>
        </div>
      </div>
    </div>
  );
};

export default SiteQrModal;
