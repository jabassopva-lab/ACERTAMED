
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface VideoGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
}

const VideoGeneratorModal: React.FC<VideoGeneratorModalProps> = ({ isOpen, onClose, storeName }) => {
  const [step, setStep] = useState<'check-key' | 'instructions' | 'ready' | 'generating' | 'finished'>('check-key');
  const [hasKey, setHasKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      checkApiKey();
    }
  }, [isOpen]);

  const checkApiKey = async () => {
    try {
        // @ts-ignore
        const keySelected = await window.aistudio.hasSelectedApiKey();
        setHasKey(keySelected);
        if (!keySelected) {
            setStep('check-key');
        } else {
            setStep('ready');
        }
    } catch (e) {
        setStep('check-key');
    }
  };

  const handleSelectKey = async () => {
    try {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        // Após selecionar, assumimos sucesso conforme as diretrizes
        setHasKey(true);
        setStep('ready');
    } catch (e) {
        console.error("Erro ao selecionar chave", e);
    }
  };

  const generateVideoTour = async () => {
    setStep('generating');
    setProgress(10);
    setStatusMessage('Iniciando motores de renderização industrial...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Cinematic 3D industrial commercial for "${storeName}". 
      High-end 4K render of a modern factory environment. 
      Show close-ups of professional safety signs (Danger, Warning, Emergency) with clear text and industrial textures. 
      The lighting is professional with realistic shadows. 
      End the video with a wide shot of a warehouse perfectly organized with safety signaling. 
      Vibrant colors, smooth camera movement.`;

      setProgress(25);
      setStatusMessage('Enviando projeto para o Google Veo...');

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      let currentProgress = 30;
      const progressMessages = [
        'Modelando ambiente industrial...',
        'Aplicando texturas normatizadas...',
        'Renderizando iluminação global...',
        'Finalizando efeitos cinematográficos...',
        'Processando download do vídeo...'
      ];

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        // @ts-ignore
        operation = await ai.operations.getVideosOperation({ operation: operation });
        
        currentProgress = Math.min(currentProgress + 2, 98);
        setProgress(currentProgress);
        setStatusMessage(progressMessages[Math.floor(Math.random() * progressMessages.length)]);
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setStep('finished');
        setProgress(100);
      }
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found")) {
          alert("Erro: Chave de API expirada ou sem permissão para VEO. Por favor, selecione uma chave de um projeto com faturamento ativo.");
          setStep('check-key');
      } else {
          alert("Ocorreu um erro na geração. Verifique se sua chave Google Cloud tem o modelo VEO habilitado e créditos disponíveis.");
          setStep('ready');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col relative animate-fade-in-up max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        <div className="bg-brand-blue p-6 text-white relative overflow-hidden shrink-0">
            <h2 className="text-xl font-display font-black uppercase tracking-tight flex items-center gap-2">
                <span className="bg-white/20 p-1.5 rounded-lg">🎬</span>
                Gerador de Vídeo IA
            </h2>
            <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
            {step === 'check-key' && (
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-3xl border-4 border-amber-100 animate-pulse">🔑</div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Chave de API Necessária</h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                            Para gerar vídeos cinematográficos com o <strong>Google Veo</strong>, você precisa conectar sua chave de faturamento do Google Cloud.
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handleSelectKey}
                            className="w-full bg-brand-blue text-white font-black py-4 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                        >
                            Selecionar Chave Existente
                        </button>
                        <button 
                            onClick={() => setStep('instructions')}
                            className="w-full bg-slate-100 text-slate-600 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all text-xs uppercase"
                        >
                            Como criar uma nova chave?
                        </button>
                    </div>
                </div>
            )}

            {step === 'instructions' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <button onClick={() => setStep('check-key')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                        </button>
                        <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Tutorial de Configuração</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="shrink-0 w-8 h-8 bg-brand-teal text-white rounded-full flex items-center justify-center font-black text-sm">1</div>
                            <div className="text-sm">
                                <p className="font-bold text-slate-800">Acesse o Google AI Studio</p>
                                <a href="https://aistudio.google.com/" target="_blank" className="text-blue-600 underline text-xs">aistudio.google.com</a>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0 w-8 h-8 bg-brand-teal text-white rounded-full flex items-center justify-center font-black text-sm">2</div>
                            <div className="text-sm">
                                <p className="font-bold text-slate-800">Crie sua API Key</p>
                                <p className="text-slate-500 text-xs">Clique em "Get API key" e depois em "Create API key in new project".</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0 w-8 h-8 bg-brand-teal text-white rounded-full flex items-center justify-center font-black text-sm">3</div>
                            <div className="text-sm">
                                <p className="font-bold text-slate-800">Ative o Faturamento (Billing)</p>
                                <p className="text-slate-500 text-xs">O modelo Veo 3.1 exige um projeto com cartão vinculado. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-blue-600 underline">Ver docs de faturamento</a>.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                        <span className="text-xl">💡</span>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            <strong>Dica para a apresentação:</strong> Se você já tiver a chave pronta, a geração do vídeo demora cerca de 3 minutos e impressiona muito o cliente pela tecnologia envolvida.
                        </p>
                    </div>

                    <button 
                        onClick={() => setStep('check-key')}
                        className="w-full bg-brand-blue text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-sm"
                    >
                        Entendi, vamos conectar
                    </button>
                </div>
            )}

            {step === 'ready' && (
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl border-4 border-green-200">✨</div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Motor de Renderização Pronto!</h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto">
                            A IA criará um comercial técnico de <strong>1080p HD</strong> exclusivo para a <strong>{storeName}</strong>.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-left">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Resolução</p>
                            <p className="text-xs font-bold text-slate-700">Full HD (16:9)</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Tecnologia</p>
                            <p className="text-xs font-bold text-slate-700">Google Veo 3.1</p>
                        </div>
                    </div>
                    <button 
                        onClick={generateVideoTour}
                        className="w-full bg-brand-teal text-white font-black py-4 rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                        Gerar Teaser Agora 🚀
                    </button>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Tempo estimado: 2 a 4 minutos</p>
                </div>
            )}

            {step === 'generating' && (
                <div className="w-full text-center space-y-8 py-10">
                    <div className="relative mx-auto w-32 h-32">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <div 
                            className="absolute inset-0 border-4 border-brand-teal rounded-full transition-all duration-500" 
                            style={{ 
                                clipPath: `polygon(50% 50%, -50% -50%, ${progress}% -50%, ${progress}% 150%, -50% 150%)`,
                                transform: 'rotate(-90deg)'
                            }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-black text-brand-teal">{progress}%</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900 animate-pulse">{statusMessage}</h3>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                            Os servidores do Google estão processando seu ambiente industrial em 3D. Não feche esta janela.
                        </p>
                    </div>
                </div>
            )}

            {step === 'finished' && videoUrl && (
                <div className="text-center space-y-6 w-full animate-fade-in">
                    <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-100 bg-slate-900 aspect-video relative group">
                        <video 
                            src={videoUrl} 
                            controls 
                            autoPlay 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                            onClick={() => {
                                setVideoUrl(null);
                                setStep('ready');
                            }}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase text-xs"
                        >
                            Gerar Outro
                        </button>
                        <a 
                            href={videoUrl} 
                            download={`comercial-${storeName.toLowerCase().replace(/\s+/g, '-')}.mp4`}
                            className="flex-[2] py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl hover:bg-green-700 transition-all uppercase text-xs flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Baixar Vídeo MP4
                        </a>
                    </div>
                </div>
            )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center shrink-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Gerenciamento Visual Acertamed • IA Engine
            </p>
        </div>
      </div>
    </div>
  );
};

export default VideoGeneratorModal;
