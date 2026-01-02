
import React, { useEffect, useRef, useState } from 'react';

// Declaração para o TS reconhecer o fabric global (injetado via CDN)
declare const fabric: any;

interface SignDesignerProps {
  onSave: (imageBase64: string) => void;
  onCancel: () => void;
  initialTitle?: string;
}

const SignDesigner: React.FC<SignDesignerProps> = ({ onSave, onCancel, initialTitle }) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Ref para guardar a instância do canvas sem causar re-renders
  const fabricRef = useRef<any>(null);
  
  // Estado UI
  const [activeObject, setActiveObject] = useState<any>(null);
  const [textValue, setTextValue] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(40);
  const [canvasScale, setCanvasScale] = useState(1);

  // Cores de Segurança Normatizadas
  const safetyColors = [
    { name: 'Preto', val: '#000000', class: 'bg-black' },
    { name: 'Branco', val: '#FFFFFF', class: 'bg-white border-gray-300' },
    { name: 'Vermelho (Proibição/Perigo)', val: '#DC2626', class: 'bg-red-600' },
    { name: 'Amarelo (Atenção)', val: '#FFD700', class: 'bg-yellow-400' },
    { name: 'Verde (Segurança)', val: '#16A34A', class: 'bg-green-600' },
    { name: 'Azul (Obrigação/Aviso)', val: '#2563EB', class: 'bg-blue-600' },
    { name: 'Laranja (Perigo)', val: '#F97316', class: 'bg-orange-500' },
    { name: 'Cinza', val: '#6B7280', class: 'bg-gray-500' },
  ];

  const baseWidth = 800; // Tamanho base da placa
  const baseHeight = 600;

  // Inicialização do Canvas
  useEffect(() => {
    if (canvasEl.current && containerRef.current) {
      const initCanvas = () => {
          if (!containerRef.current || !canvasEl.current) return;

          // Destruir instância anterior se existir
          if (fabricRef.current) {
              fabricRef.current.dispose();
          }

          // Calcula escala para caber na tela
          const containerW = containerRef.current.clientWidth;
          const containerH = containerRef.current.clientHeight;
          const margin = 40; 
          const availableW = containerW - margin;
          const availableH = containerH - margin;

          const scaleW = availableW / baseWidth;
          const scaleH = availableH / baseHeight;
          const scaleFactor = Math.min(scaleW, scaleH, 1); // Max zoom 1 inicial
          setCanvasScale(scaleFactor);

          const canvas = new fabric.Canvas(canvasEl.current, {
              width: baseWidth * scaleFactor,
              height: baseHeight * scaleFactor,
              backgroundColor: '#FFFFFF',
              preserveObjectStacking: true,
              selection: true,
          });
          
          canvas.setZoom(scaleFactor);
          
          // Configurações visuais dos controles
          fabric.Object.prototype.set({
              transparentCorners: false,
              cornerColor: '#2563EB', // Azul Safety
              cornerStyle: 'circle',
              borderColor: '#2563EB',
              cornerSize: 10,
              padding: 5,
              borderDashArray: [4, 4]
          });

          // Borda da Placa (Base)
          const bgRect = new fabric.Rect({
              left: 0, top: 0,
              width: baseWidth, height: baseHeight,
              fill: '#FFFFFF',
              stroke: '#000000',
              strokeWidth: 2,
              selectable: false,
              evented: false,
              name: 'background'
          });
          canvas.add(bgRect);
          canvas.sendToBack(bgRect);

          // Eventos de Seleção
          const handleSelection = (e: any) => {
              const selected = e.selected ? e.selected[0] : null;
              setActiveObject(selected);
              
              if (selected) {
                  setSelectedColor(selected.fill as string);
                  if (selected.text) {
                      setTextValue(selected.text);
                      setFontSize(selected.fontSize || 40);
                  }
              } else {
                  setTextValue('');
              }
          };

          canvas.on('selection:created', handleSelection);
          canvas.on('selection:updated', handleSelection);
          canvas.on('selection:cleared', () => {
              setActiveObject(null);
              setTextValue('');
          });

          // Adiciona texto inicial se houver
          if (initialTitle && !initialTitle.includes('NOVA') && !initialTitle.includes('PERSONALIZE')) {
              const text = new fabric.Textbox(initialTitle.toUpperCase(), {
                  left: baseWidth / 2,
                  top: baseHeight / 2,
                  width: baseWidth - 100,
                  fontSize: 60,
                  fontFamily: 'Arial',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  originX: 'center',
                  originY: 'center',
                  fill: '#000000'
              });
              canvas.add(text);
              canvas.setActiveObject(text);
          }

          fabricRef.current = canvas;
      };

      // Pequeno delay para o DOM renderizar o container
      const timer = setTimeout(initCanvas, 100);
      
      // Observer para resize da janela
      const resizeObserver = new ResizeObserver(() => {
          // Recalcular zoom se a janela mudar (simplificado: apenas reinit se necessário)
          // Para produção, ideal seria apenas setZoom/setWidth sem recriar
      });
      resizeObserver.observe(containerRef.current);

      return () => {
          clearTimeout(timer);
          resizeObserver.disconnect();
          if (fabricRef.current) {
              fabricRef.current.dispose();
              fabricRef.current = null;
          }
      };
    }
  }, []);

  // Listener para Tecla Delete
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          // Se o foco estiver em um input ou textarea, não deleta o objeto do canvas
          if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
              return;
          }

          if (e.key === 'Delete' || e.key === 'Backspace') {
              const canvas = fabricRef.current;
              if (!canvas) return;

              const activeObj = canvas.getActiveObject();
              
              // Se estiver editando o texto dentro do canvas, não deleta o objeto inteiro
              if (activeObj && (activeObj.type === 'textbox' || activeObj.type === 'i-text') && activeObj.isEditing) {
                  return;
              }

              if (activeObj) {
                  canvas.remove(activeObj);
                  canvas.discardActiveObject();
                  canvas.requestRenderAll();
                  setActiveObject(null);
              }
          }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
      };
  }, []);

  // --- Ações do Editor ---

  const addText = (customText?: string) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const text = new fabric.Textbox(customText || 'SEU TEXTO', {
          left: baseWidth / 2,
          top: baseHeight / 2,
          width: 400,
          fontSize: 50,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          textAlign: 'center',
          originX: 'center',
          originY: 'center',
          fill: '#000000'
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.requestRenderAll();
  };

  const addHeader = (type: 'DANGER' | 'WARNING' | 'NOTICE' | 'SAFETY' | 'PROHIBITED') => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const w = baseWidth - 40;
      const h = 130;
      const x = baseWidth / 2;
      const y = 80;

      let group: any[] = [];
      
      // Construção dos cabeçalhos baseados na norma ANSI Z535 / ABNT
      if (type === 'DANGER') {
          // Perigo: Fundo Vermelho, Texto Branco, muitas vezes com oval preta atrás do texto (simplificado aqui para retangulo)
          const rect = new fabric.Rect({ width: w, height: h, fill: '#DC2626', rx: 10, ry: 10, originX: 'center', originY: 'center' });
          const text = new fabric.Text('PERIGO', { fontSize: 70, fontFamily: 'Arial Black', fill: '#FFFFFF', originX: 'center', originY: 'center', top: 5 });
          group = [rect, text];
      } 
      else if (type === 'WARNING') {
          // Atenção: Fundo Amarelo, Texto Preto
          const rect = new fabric.Rect({ width: w, height: h, fill: '#FFD700', rx: 10, ry: 10, originX: 'center', originY: 'center' });
          const text = new fabric.Text('ATENÇÃO', { fontSize: 70, fontFamily: 'Arial Black', fill: '#000000', originX: 'center', originY: 'center', top: 5 });
          group = [rect, text];
      }
      else if (type === 'NOTICE') {
          // Aviso: Fundo Azul, Texto Branco
          const rect = new fabric.Rect({ width: w, height: h, fill: '#2563EB', rx: 10, ry: 10, originX: 'center', originY: 'center' });
          const text = new fabric.Text('AVISO', { fontSize: 70, fontFamily: 'Arial Black', fill: '#FFFFFF', originX: 'center', originY: 'center', top: 5 });
          group = [rect, text];
      }
      else if (type === 'SAFETY') {
          // Segurança: Fundo Verde, Texto Branco
          const rect = new fabric.Rect({ width: w, height: h, fill: '#16A34A', rx: 10, ry: 10, originX: 'center', originY: 'center' });
          const text = new fabric.Text('SEGURANÇA', { fontSize: 60, fontFamily: 'Arial Black', fill: '#FFFFFF', originX: 'center', originY: 'center', top: 5 });
          group = [rect, text];
      }
      else if (type === 'PROHIBITED') {
          // Proibido: Fundo Branco, Cabeçalho Vermelho "PROIBIDO"
          const rect = new fabric.Rect({ width: w, height: h, fill: '#DC2626', rx: 10, ry: 10, originX: 'center', originY: 'center' });
          const text = new fabric.Text('PROIBIDO', { fontSize: 70, fontFamily: 'Arial Black', fill: '#FFFFFF', originX: 'center', originY: 'center', top: 5 });
          group = [rect, text];
      }

      if (group.length > 0) {
          const groupObj = new fabric.Group(group, {
              left: x, top: y, originX: 'center', originY: 'center',
              selectable: true
          });
          canvas.add(groupObj);
          canvas.setActiveObject(groupObj);
          canvas.requestRenderAll();
      }
  };

  const addIcon = (iconType: 'prohibit' | 'triangle' | 'circle' | 'square') => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      let obj;
      const x = baseWidth / 2;
      const y = baseHeight / 2;

      if (iconType === 'prohibit') {
          const circle = new fabric.Circle({ radius: 80, fill: 'transparent', stroke: '#DC2626', strokeWidth: 15, originX: 'center', originY: 'center' });
          const line = new fabric.Rect({ width: 140, height: 15, fill: '#DC2626', originX: 'center', originY: 'center', angle: -45 });
          obj = new fabric.Group([circle, line], { left: x, top: y, originX: 'center', originY: 'center' });
      } else if (iconType === 'triangle') {
          obj = new fabric.Triangle({ width: 150, height: 130, fill: '#FFD700', stroke: '#000000', strokeWidth: 4, left: x, top: y, originX: 'center', originY: 'center' });
      } else if (iconType === 'circle') {
          obj = new fabric.Circle({ radius: 70, fill: '#2563EB', left: x, top: y, originX: 'center', originY: 'center' });
      } else if (iconType === 'square') {
          obj = new fabric.Rect({ width: 140, height: 140, fill: '#16A34A', rx: 10, ry: 10, left: x, top: y, originX: 'center', originY: 'center' });
      }

      if (obj) {
          canvas.add(obj);
          canvas.setActiveObject(obj);
          canvas.requestRenderAll();
      }
  };

  // --- Manipulação de Propriedades ---

  const handleTextChange = (val: string) => {
      setTextValue(val);
      const canvas = fabricRef.current;
      const obj = canvas?.getActiveObject();
      if (obj && (obj.type === 'text' || obj.type === 'textbox')) {
          obj.set('text', val);
          canvas.requestRenderAll();
      }
  };

  const handleColorChange = (color: string) => {
      setSelectedColor(color);
      const canvas = fabricRef.current;
      const obj = canvas?.getActiveObject();
      if (obj) {
          // Se for grupo, tenta pintar os filhos (exceto se for proibição complexa)
          if (obj.type === 'group') {
              obj._objects.forEach((child: any) => {
                  if (child.fill !== 'transparent') child.set('fill', color);
              });
          } else {
              obj.set('fill', color);
          }
          canvas.requestRenderAll();
      }
  };

  const handleFontSizeChange = (val: number) => {
      setFontSize(val);
      const canvas = fabricRef.current;
      const obj = canvas?.getActiveObject();
      if (obj && (obj.type === 'text' || obj.type === 'textbox')) {
          obj.set('fontSize', val);
          canvas.requestRenderAll();
      }
  };

  const deleteSelected = () => {
      const canvas = fabricRef.current;
      const obj = canvas?.getActiveObject();
      if (obj) {
          canvas.remove(obj);
          canvas.discardActiveObject();
          canvas.requestRenderAll();
          setActiveObject(null);
      }
  };

  const moveLayer = (dir: 'up' | 'down') => {
      const canvas = fabricRef.current;
      const obj = canvas?.getActiveObject();
      if (obj) {
          dir === 'up' ? obj.bringForward() : obj.sendBackwards();
          canvas.requestRenderAll();
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (f) => {
          const data = f.target?.result as string;
          fabric.Image.fromURL(data, (img: any) => {
              img.scaleToWidth(200);
              img.set({ left: baseWidth/2, top: baseHeight/2, originX: 'center', originY: 'center' });
              fabricRef.current.add(img);
              fabricRef.current.setActiveObject(img);
          });
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Função de Demo Automática (Para Vídeo) ---
  const runDemo = () => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      // 1. Limpa tudo
      canvas.clear();
      // Recria o background
      const bgRect = new fabric.Rect({
          left: 0, top: 0, width: baseWidth, height: baseHeight,
          fill: '#FFFFFF', stroke: '#000000', strokeWidth: 2,
          selectable: false, evented: false, name: 'background'
      });
      canvas.add(bgRect);
      canvas.sendToBack(bgRect);

      // Sequência de ações automáticas
      setTimeout(() => addHeader('DANGER'), 500);
      setTimeout(() => addIcon('triangle'), 1500);
      setTimeout(() => {
          const icon = canvas.getObjects().find((o: any) => o.type === 'triangle');
          if (icon) {
              icon.set({ top: baseHeight / 2 - 50 });
              canvas.requestRenderAll();
          }
      }, 2000);
      setTimeout(() => addText('ALTA TENSÃO'), 2500);
      setTimeout(() => {
          const text = canvas.getObjects().find((o: any) => o.text === 'ALTA TENSÃO');
          if (text) {
              text.set({ top: baseHeight / 2 + 100, fontSize: 60 });
              canvas.setActiveObject(text);
              canvas.requestRenderAll();
          }
      }, 3000);
  };

  // --- Funções de Saída (Imprimir, Baixar, Salvar) ---

  const handlePrint = () => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      
      canvas.discardActiveObject();
      canvas.requestRenderAll();

      const dataUrl = canvas.toDataURL({
          format: 'png',
          multiplier: 2, // Maior qualidade para impressão
          quality: 1
      });

      const win = window.open('', '_blank');
      if(win){
          win.document.write(`
              <html>
                  <head><title>Imprimir Arte - Studio Criação</title></head>
                  <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background-color: #f0f0f0;">
                      <img src="${dataUrl}" style="max-width:98%; max-height:98%; box-shadow: 0 0 20px rgba(0,0,0,0.1); background: white;" onload="setTimeout(() => { window.print(); window.close() }, 500)" />
                  </body>
              </html>
          `);
          win.document.close();
      }
  };

  const handleDownload = () => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      
      canvas.discardActiveObject();
      canvas.requestRenderAll();

      const dataUrl = canvas.toDataURL({
          format: 'png',
          multiplier: 2,
          quality: 1
      });

      const link = document.createElement('a');
      link.download = `placa-personalizada-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleFinalSave = () => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      
      canvas.discardActiveObject();
      canvas.requestRenderAll();

      // Exportar em alta resolução (tamanho original)
      const dataUrl = canvas.toDataURL({
          format: 'png',
          multiplier: 1 / canvasScale, // Compensa o zoom para exportar no tamanho real (baseWidth)
          quality: 1
      });
      onSave(dataUrl);
      alert("✅ Arte salva com sucesso!\n\nEla foi enviada para o seu Portfólio (topo da lista de placas).");
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden font-sans">
      
      {/* HEADER SUPERIOR */}
      <div className="bg-slate-900 text-white h-14 flex items-center justify-between px-4 shadow-md shrink-0 z-30">
          <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-yellow-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
              </svg>
              <h2 className="font-bold text-lg tracking-wide hidden sm:block">Studio Criação</h2>
          </div>
          
          <div className="flex gap-2 items-center">
              {/* Botão de Demo Automática */}
              <button 
                onClick={runDemo} 
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow-sm animate-pulse"
                title="Criar placa automaticamente para demonstração"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>
                  Demo Auto
              </button>

              <div className="w-px h-6 bg-slate-700 mx-1"></div>

              {/* Botões de Ação Rápida */}
              <button onClick={handlePrint} className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors border border-slate-600" title="Imprimir Agora">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.198-.54-1.139-1.201l.229-2.523m11.356-8.006a2.25 2.25 0 0 0 2.25-2.25V4.5a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 2.25 4.5v2.812a2.25 2.25 0 0 0 2.25 2.25" />
                  </svg>
                  Imprimir
              </button>
              
              <button onClick={handleDownload} className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-colors border border-slate-600" title="Baixar Imagem PNG">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Baixar
              </button>

              <div className="w-px h-6 bg-slate-700 mx-1"></div>

              <button onClick={onCancel} className="px-3 py-1.5 rounded text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                  Cancelar
              </button>
              <button onClick={handleFinalSave} className="px-4 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow transition-transform hover:scale-105 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  Salvar Arte
              </button>
          </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
          
          {/* BARRA DE FERRAMENTAS ESQUERDA */}
          <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-sm overflow-y-auto custom-scrollbar z-20">
              <div className="p-4 space-y-6">
                  
                  {/* Seção Cabeçalhos */}
                  <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                          <span className="w-full h-px bg-slate-200"></span> Cabeçalhos <span className="w-full h-px bg-slate-200"></span>
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                          <button onClick={() => addHeader('DANGER')} className="flex items-center gap-3 p-2 rounded border border-slate-100 hover:bg-slate-50 hover:border-red-200 group transition-all">
                              <div className="w-8 h-6 bg-red-600 rounded-sm flex items-center justify-center text-[8px] font-black text-white shadow-sm group-hover:scale-110 transition-transform">!!!</div>
                              <span className="text-sm font-medium text-slate-700">Perigo</span>
                          </button>
                          <button onClick={() => addHeader('WARNING')} className="flex items-center gap-3 p-2 rounded border border-slate-100 hover:bg-slate-50 hover:border-yellow-200 group transition-all">
                              <div className="w-8 h-6 bg-yellow-400 rounded-sm flex items-center justify-center text-[8px] font-black text-black shadow-sm group-hover:scale-110 transition-transform">!</div>
                              <span className="text-sm font-medium text-slate-700">Atenção</span>
                          </button>
                          <button onClick={() => addHeader('NOTICE')} className="flex items-center gap-3 p-2 rounded border border-slate-100 hover:bg-slate-50 hover:border-blue-200 group transition-all">
                              <div className="w-8 h-6 bg-blue-600 rounded-sm flex items-center justify-center text-[8px] font-black text-white shadow-sm group-hover:scale-110 transition-transform">i</div>
                              <span className="text-sm font-medium text-slate-700">Aviso</span>
                          </button>
                          <button onClick={() => addHeader('SAFETY')} className="flex items-center gap-3 p-2 rounded border border-slate-100 hover:bg-slate-50 hover:border-green-200 group transition-all">
                              <div className="w-8 h-6 bg-green-600 rounded-sm flex items-center justify-center text-[8px] font-black text-white shadow-sm group-hover:scale-110 transition-transform">+</div>
                              <span className="text-sm font-medium text-slate-700">Segurança</span>
                          </button>
                          <button onClick={() => addHeader('PROHIBITED')} className="flex items-center gap-3 p-2 rounded border border-slate-100 hover:bg-slate-50 hover:border-red-200 group transition-all">
                              <div className="w-8 h-6 bg-white border border-red-500 rounded-sm flex items-center justify-center text-[8px] font-black text-red-600 shadow-sm relative overflow-hidden group-hover:scale-110 transition-transform">
                                  <div className="absolute inset-0 border-2 border-red-600 rounded-full m-0.5"></div>
                                  <div className="absolute w-full h-0.5 bg-red-600 rotate-45"></div>
                              </div>
                              <span className="text-sm font-medium text-slate-700">Proibido</span>
                          </button>
                      </div>
                  </div>

                  {/* Seção Elementos */}
                  <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                          <span className="w-full h-px bg-slate-200"></span> Elementos <span className="w-full h-px bg-slate-200"></span>
                      </h3>
                      
                      <button onClick={() => addText()} className="w-full mb-3 bg-white border-2 border-slate-200 hover:border-blue-400 text-slate-700 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md">
                          <span className="text-lg font-serif">T</span> Adicionar Texto
                      </button>

                      <div className="grid grid-cols-4 gap-2 mb-3">
                          <button onClick={() => addIcon('prohibit')} className="aspect-square flex items-center justify-center rounded bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-red-600 text-xl font-bold transition-all" title="Símbolo Proibido">🚫</button>
                          <button onClick={() => addIcon('triangle')} className="aspect-square flex items-center justify-center rounded bg-slate-50 hover:bg-yellow-50 border border-slate-200 hover:border-yellow-200 transition-all" title="Triângulo Amarelo">
                              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-yellow-500"></div>
                          </button>
                          <button onClick={() => addIcon('circle')} className="aspect-square flex items-center justify-center rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all" title="Círculo Azul">
                              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                          </button>
                          <button onClick={() => addIcon('square')} className="aspect-square flex items-center justify-center rounded bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-green-200 transition-all" title="Quadrado Verde">
                              <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                          </button>
                      </div>

                      <button onClick={() => fileInputRef.current?.click()} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-500 hover:border-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                          📷 Upload Imagem
                      </button>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  </div>

              </div>
          </div>

          {/* ÁREA DO CANVAS (CENTRO) */}
          <div className="flex-1 bg-slate-200 flex items-center justify-center p-8 overflow-auto" ref={containerRef}>
              <div className="relative shadow-2xl">
                  {/* Sombra realista atrás da placa */}
                  <canvas ref={canvasEl} />
              </div>
          </div>

          {/* PAINEL DE PROPRIEDADES (DIREITA) */}
          <div className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 shadow-sm z-20">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Propriedades</h3>
              </div>

              {activeObject ? (
                  <div className="p-4 space-y-6 overflow-y-auto flex-1">
                      
                      {/* Editor de Texto (se aplicável) */}
                      {(activeObject.type === 'textbox' || activeObject.type === 'text') && (
                          <div className="space-y-3">
                              <label className="text-xs font-bold text-slate-500">Conteúdo</label>
                              <textarea 
                                  value={textValue}
                                  onChange={(e) => handleTextChange(e.target.value)}
                                  className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                                  rows={3}
                              />
                              
                              <div className="flex justify-between items-center">
                                  <label className="text-xs font-bold text-slate-500">Tamanho</label>
                                  <input 
                                      type="number" 
                                      value={fontSize} 
                                      onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                                      className="w-20 p-1 text-sm border rounded text-center"
                                  />
                              </div>
                          </div>
                      )}

                      {/* Seletor de Cores */}
                      <div>
                          <label className="text-xs font-bold text-slate-500 mb-2 block">Cor do Objeto</label>
                          <div className="grid grid-cols-4 gap-2">
                              {safetyColors.map(c => (
                                  <button
                                      key={c.val}
                                      onClick={() => handleColorChange(c.val)}
                                      className={`w-10 h-10 rounded-full border-2 shadow-sm transition-transform hover:scale-110 ${c.class} ${selectedColor === c.val ? 'ring-2 ring-offset-2 ring-blue-500 border-transparent' : 'border-slate-200'}`}
                                      title={c.name}
                                  />
                              ))}
                          </div>
                      </div>

                      {/* Ações de Objeto */}
                      <div className="pt-4 border-t border-slate-100 space-y-2">
                          <label className="text-xs font-bold text-slate-500 mb-2 block">Organizar</label>
                          <div className="grid grid-cols-2 gap-2">
                              <button onClick={() => moveLayer('up')} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold text-slate-600">
                                  ↑ Trazer Frente
                              </button>
                              <button onClick={() => moveLayer('down')} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold text-slate-600">
                                  ↓ Enviar Trás
                              </button>
                          </div>
                          <button onClick={deleteSelected} className="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded py-2 text-xs font-bold flex items-center justify-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                              Excluir Seleção
                          </button>
                      </div>

                  </div>
              ) : (
                  <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2 opacity-50">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
                      </svg>
                      <p className="text-sm">Selecione um objeto na placa para editar.</p>
                  </div>
              )}
          </div>

      </div>
    </div>
  );
};

export default SignDesigner;
