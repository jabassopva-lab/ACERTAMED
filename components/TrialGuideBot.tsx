
import React, { useState, useEffect } from 'react';

interface TrialGuideBotProps {
  credits: number;
  onSubscribeClick: () => void;
  customMessage?: React.ReactNode; 
  className?: string; 
  forceVisible?: boolean; 
}

const TrialGuideBot: React.FC<TrialGuideBotProps> = ({ credits, onSubscribeClick, customMessage, className = '', forceVisible = false }) => {
  const [isVisible, setIsVisible] = useState(forceVisible);
  const [isDismissed, setIsDismissed] = useState(false);
  
  // URL PRINCIPAL: Robô 3D "Mascote"
  const [imgSrc, setImgSrc] = useState("https://cdn-icons-png.flaticon.com/512/8943/8943377.png");
  
  const fallbackSrc = "https://cdn-icons-png.flaticon.com/512/3222/3222625.png";
  
  const isExhausted = customMessage ? true : credits <= 0;

  useEffect(() => {
    if (!forceVisible) {
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }
  }, [forceVisible]);

  useEffect(() => {
    if (forceVisible) {
        setIsDismissed(false);
        setIsVisible(true);
    }
  }, [forceVisible]);

  useEffect(() => {
    if (isExhausted && !isDismissed && !forceVisible) {
        setIsVisible(true);
    }
  }, [isExhausted, isDismissed, forceVisible]);

  if (isDismissed) return null;

  const handleClick = () => {
    if (isExhausted || customMessage) {
        onSubscribeClick();
    } else {
        document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const positionClasses = className.includes('fixed') || className.includes('absolute') 
    ? className 
    : `fixed bottom-4 left-4 md:bottom-8 md:left-8 z-40 ${className}`;

  // Lógica de Mensagem baseada em Créditos
  const renderMessage = () => {
      if (customMessage) return customMessage;

      if (credits <= 0) {
          return (
            <div onClick={handleClick} className="cursor-pointer">
                <p className="text-xs md:text-sm text-gray-800 font-medium leading-snug">
                  🚫 <span className="text-red-600 font-bold">Créditos esgotados!</span> <br/>
                  <span className="font-black text-gray-900 bg-yellow-200 px-1 rounded shadow-sm">Você usou seus 5 testes gratuitos.</span>
                </p>
                <p className="text-[10px] md:text-xs text-blue-600 font-bold mt-2 underline decoration-blue-300 decoration-2 underline-offset-2">
                    Clique aqui para liberar acesso ilimitado! 🚀
                </p>
            </div>
          );
      }

      if (credits === 1) {
          return (
            <p className="text-xs md:text-sm text-gray-800 font-medium leading-snug" onClick={handleClick}>
              ⚠️ <strong>Última chance!</strong> <br/>
              Você tem apenas <span className="text-red-600 font-black bg-red-100 px-1 rounded">1 crédito</span> restante. Escolha bem! 🎯
            </p>
          );
      }

      if (credits <= 3) {
          return (
            <p className="text-xs md:text-sm text-gray-800 font-medium leading-snug" onClick={handleClick}>
              👀 <strong>Aproveite!</strong> <br/>
              Você ainda tem <span className="text-blue-600 font-bold">{credits} impressões grátis</span>. Teste a qualidade!
            </p>
          );
      }

      // Default (5)
      return (
        <p className="text-xs md:text-sm text-gray-800 font-medium leading-snug" onClick={handleClick}>
          🤖 <strong>Bem-vindo!</strong> <br/>
          Você ganhou <span className="text-green-600 font-bold bg-green-100 px-1 rounded">5 créditos grátis</span> para testar nosso sistema! 👇
        </p>
      );
  };

  return (
    <div 
      className={`${positionClasses} flex flex-col items-start transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
    >
      {/* Balão de Fala */}
      <div className={`relative bg-white border-2 ${isExhausted ? 'border-red-500 bg-red-50' : 'border-blue-50' } p-3 md:p-4 rounded-2xl shadow-xl mb-2 max-w-[220px] md:max-w-[260px] animate-fade-in-up ml-2 md:ml-4`}>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsDismissed(true); }}
          className="absolute -top-2 -right-2 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-600 rounded-full p-1 transition-colors shadow-sm z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
        
        {renderMessage()}

        {/* Triângulo do Balão */}
        <div className={`absolute -bottom-2.5 left-6 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] ${isExhausted ? 'border-t-red-500' : 'border-t-blue-500'} border-r-[10px] border-r-transparent`}></div>
      </div>

      {/* O Robô (Imagem 3D) - Responsivo: w-20 (mobile) / w-28 (desktop) */}
      <div 
        className="relative w-20 h-20 md:w-28 md:h-28 -mt-1 md:-mt-2 animate-bounce-slow filter drop-shadow-2xl cursor-pointer hover:scale-110 transition-transform duration-300 group z-10 ml-2 md:ml-0" 
        onClick={handleClick}
      >
        <img 
            src={imgSrc} 
            alt="Assistente Virtual 3D" 
            className={`w-full h-full object-contain ${isExhausted ? 'hue-rotate-[320deg] saturate-150 drop-shadow-[0_10px_10px_rgba(220,38,38,0.5)]' : 'drop-shadow-[0_10px_15px_rgba(37,99,235,0.4)]'}`}
            draggable={false}
            onError={() => {
                if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
            }}
        />
        
        {/* Efeito de brilho atrás do robô */}
        <div className={`absolute inset-0 rounded-full blur-xl -z-10 opacity-60 ${isExhausted ? 'bg-red-500/30' : 'bg-blue-400/30'}`}></div>
      </div>
    </div>
  );
};

export default TrialGuideBot;
