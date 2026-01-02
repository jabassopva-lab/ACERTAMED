
import React, { useState, useRef } from 'react';
import { Subscriber } from '../types';
import SiteQrModal from './SiteQrModal';

interface HeaderProps {
  logoUrl: string;
  onLogoUpload: (url: string) => void;
  cartItemCount: number;
  onOpenCart: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
  isAdminMode: boolean;
  onToggleAdmin: () => void;
  adminLockHidden: boolean;
  onToggleLockVisibility: () => void;
  isSubscriber: boolean;
  currentSubscriber: Subscriber | null;
  onSubscriberLogin: (key: string) => boolean;
  onSubscriberLogout: () => void;
  onOpenSubscriberManager: () => void;
  onOpenOrderManager: () => void;
  lastBackupTime: Date;
  onRestoreCheckpoint: () => void;
  onOpenMaterialManager: () => void;
  onOpenDesigner?: () => void;
  onManualSave: () => void;
  storageUsage: string;
  whatsappNumber: string;
  storeName: string;
  onStoreNameChange: (name: string) => void;
  pdfCatalogUrl: string;
  onPdfUrlChange: (url: string) => void;
  onGenerateCode: () => void;
  onOpenPaymentModal: () => void;
  onOpenSupabaseModal: () => void;
  onOpenResellerManager?: () => void;
  pendingOrdersCount?: number;
  onDownloadCatalog?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  logoUrl,
  onLogoUpload,
  cartItemCount,
  onOpenCart,
  isAdminMode,
  onToggleAdmin,
  adminLockHidden,
  onToggleLockVisibility,
  isSubscriber,
  currentSubscriber,
  onSubscriberLogin,
  onSubscriberLogout,
  onOpenSubscriberManager,
  onOpenOrderManager,
  onOpenDesigner,
  storeName,
  onGenerateCode,
  onOpenPaymentModal,
  onOpenSupabaseModal,
  onOpenResellerManager,
  pendingOrdersCount = 0,
  onDownloadCatalog,
  onExportData,
  onImportData
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginKey, setLoginKey] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [inputLogoUrl, setInputLogoUrl] = useState(logoUrl);

  const [logoClickCount, setLogoClickCount] = useState(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubscriberLogin(loginKey)) {
      setLoginKey('');
      setShowLogin(false);
    }
  };

  const handleLogoClick = () => {
      if (isAdminMode) {
          setInputLogoUrl(logoUrl);
          setIsEditingLogo(true);
          return;
      }
      
      const newCount = logoClickCount + 1;
      setLogoClickCount(newCount);
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => setLogoClickCount(0), 1000);
      if (newCount === 5) { onToggleLockVisibility(); setLogoClickCount(0); }
  };

  const saveLogoUrl = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputLogoUrl.trim()) {
          onLogoUpload(inputLogoUrl.trim());
      }
      setIsEditingLogo(false);
  };

  return (
    <>
      <header className="bg-brand-blue text-white shadow-lg sticky top-0 z-40 border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <div className="flex items-center gap-3 shrink-0 relative">
               <div className={`relative group cursor-pointer select-none bg-white p-1 rounded-sm shadow-sm transition-all ${isAdminMode ? 'hover:ring-2 hover:ring-brand-teal' : ''}`} onClick={handleLogoClick}>
                  <img src={logoUrl || "https://via.placeholder.com/150x50?text=LOGO"} alt="Logo" className="h-10 sm:h-12 w-auto object-contain" />
                  {isAdminMode && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                      </div>
                  )}
              </div>

              {isEditingLogo && isAdminMode && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-2xl border-2 border-brand-teal p-4 z-[60] animate-fade-in-down">
                      <h4 className="text-slate-900 text-xs font-black uppercase mb-3 border-b pb-2">Link da Nova Logo</h4>
                      <form onSubmit={saveLogoUrl} className="space-y-3">
                          <input 
                              type="text" 
                              className="w-full text-xs p-2.5 border border-gray-300 rounded text-slate-900 focus:ring-2 focus:ring-brand-teal outline-none"
                              placeholder="Cole o link do Google Drive aqui..."
                              value={inputLogoUrl}
                              onChange={(e) => setInputLogoUrl(e.target.value)}
                              autoFocus
                          />
                          <div className="flex gap-2">
                              <button 
                                  type="button" 
                                  onClick={() => setIsEditingLogo(false)}
                                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase hover:bg-gray-200"
                              >
                                  Cancelar
                              </button>
                              <button 
                                  type="submit" 
                                  className="flex-1 px-3 py-2 bg-brand-blue text-white text-[10px] font-bold rounded uppercase hover:bg-slate-900 shadow-md"
                              >
                                  Aplicar
                              </button>
                          </div>
                      </form>
                  </div>
              )}

              <div className="hidden sm:block">
                  <h1 className="text-sm font-display font-bold text-white tracking-wide leading-none">{storeName.toUpperCase()}</h1>
                  <p className="text-[10px] text-brand-teal font-black uppercase tracking-wider">Segurança e Medicina do Trabalho</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4 relative">
               {(isAdminMode || isSubscriber) && (
                   <button 
                     onClick={onOpenDesigner}
                     className="px-4 py-2 bg-gradient-to-r from-brand-teal to-brand-blue text-white text-xs font-bold rounded-lg shadow-lg hover:shadow-brand-teal/30 transition-all flex items-center gap-2 border border-white/20"
                   >
                       🎨 Designer Studio
                   </button>
               )}
               
               <button 
                 onClick={onDownloadCatalog}
                 className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 border border-white/10"
               >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                   Catálogo PDF
               </button>

               {isAdminMode && (
                   <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-lg border border-white/10 shrink-0">
                       <button onClick={onOpenOrderManager} className="relative px-3 py-1.5 text-xs font-bold bg-white/10 text-white rounded hover:bg-white/20 transition-colors">
                           Pedidos {pendingOrdersCount > 0 && <span className="ml-1 bg-red-600 px-1.5 rounded-full">{pendingOrdersCount}</span>}
                       </button>
                       <button onClick={onOpenSubscriberManager} className="px-3 py-1.5 text-xs font-bold bg-white/10 text-white rounded hover:bg-white/20 transition-colors">Assinantes</button>
                       <button onClick={onOpenResellerManager} className="px-3 py-1.5 text-xs font-bold bg-white/10 text-white rounded hover:bg-white/20 transition-colors">Revendedores</button>
                       
                       <div className="h-4 w-px bg-white/20 mx-1"></div>
                       
                       <button onClick={onExportData} className="px-2 py-1.5 text-[10px] font-bold bg-blue-600 text-white rounded hover:bg-blue-500" title="Exportar Backup JSON">⬇️ Backup</button>
                       <button onClick={() => fileInputRef.current?.click()} className="px-2 py-1.5 text-[10px] font-bold bg-slate-700 text-white rounded hover:bg-slate-600" title="Importar Backup JSON">⬆️ Restaurar</button>
                       <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={(e) => e.target.files?.[0] && onImportData(e.target.files[0])} />
                       
                       <button onClick={onGenerateCode} className="px-3 py-1.5 text-xs font-bold bg-orange-600 text-white rounded hover:bg-orange-500 shadow-sm flex items-center gap-1 border border-orange-400">🚀 Gerar Código</button>
                   </div>
               )}

               {!adminLockHidden && (
                   <button onClick={onToggleAdmin} className={`text-xs font-bold px-3 py-1.5 rounded transition-colors uppercase tracking-wider shrink-0 ${isAdminMode ? 'bg-red-600 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
                       {isAdminMode ? 'Sair Admin' : 'Admin'}
                   </button>
               )}

               {isSubscriber ? (
                   <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/10 shrink-0">
                       <div className="flex flex-col items-end">
                           <span className="text-xs font-bold text-white">{currentSubscriber?.name}</span>
                           <span className="text-[10px] text-brand-teal font-black uppercase">Acesso Liberado</span>
                       </div>
                       <button onClick={onSubscriberLogout} className="text-white/40 hover:text-red-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg></button>
                   </div>
               ) : (
                   <div className="flex items-center gap-3 shrink-0">
                       <button onClick={onOpenPaymentModal} className="hidden sm:block text-xs font-bold px-5 py-2.5 rounded shadow-lg bg-brand-teal text-white hover:bg-brand-teal/80 transition-all uppercase tracking-wide">Solicitar Acesso</button>
                       <button onClick={() => setShowLogin(!showLogin)} className={`text-xs font-bold px-4 py-2 rounded border transition-colors uppercase tracking-wide ${showLogin ? 'bg-white/20 text-white border-white/40' : 'text-white/60 border-white/20 hover:border-white/40 hover:text-white'}`}>Entrar</button>
                   </div>
               )}

               {showLogin && !isSubscriber && (
                   <form onSubmit={handleLoginSubmit} className="absolute top-full right-0 mt-3 bg-white p-4 shadow-xl rounded-lg border-2 border-brand-teal z-50 flex flex-col gap-2 w-72 animate-fade-in-down">
                       <label className="text-xs font-bold text-slate-800 uppercase">Chave de Acesso</label>
                       <input type="text" value={loginKey} onChange={(e) => setLoginKey(e.target.value)} className="border border-gray-300 rounded p-2.5 text-sm font-mono text-center text-slate-900 focus:ring-2 focus:ring-brand-teal outline-none" placeholder="XXXX-0000" autoFocus />
                       <button type="submit" className="bg-brand-blue text-white text-sm font-bold py-2.5 rounded hover:bg-slate-900 transition-colors uppercase tracking-wide shadow-md">Acessar Sistema</button>
                   </form>
               )}

               <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <button onClick={onOpenCart} className="relative p-2 text-white/80 hover:text-brand-teal transition-colors shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                      {cartItemCount > 0 && <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-safety-red rounded-full border-2 border-brand-blue">{cartItemCount}</span>}
                  </button>
                  <button onClick={() => setIsQrModalOpen(true)} className="p-2 text-white/40 hover:text-white transition-colors shrink-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" /></svg></button>
              </div>
            </div>

            <div className="md:hidden flex items-center gap-4">
                <button onClick={onOpenCart} className="relative p-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                    {cartItemCount > 0 && <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-safety-red rounded-full">{cartItemCount}</span>}
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                        {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
                    </svg>
                </button>
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-safety-stripes opacity-30"></div>
      </header>
      
      <SiteQrModal 
        isOpen={isQrModalOpen} 
        onClose={() => setIsQrModalOpen(false)} 
        storeName={storeName} 
      />
    </>
  );
};

export default Header;
