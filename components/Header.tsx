
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
  onViewCatalog?: () => void;
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
  onViewCatalog,
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
      setIsMenuOpen(false);
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
      
      if (newCount === 5) { 
          onToggleLockVisibility(); 
          setLogoClickCount(0);
          alert("🔑 Modo administrativo ativado. Clique no cadeado para entrar.");
      }
  };

  const saveLogoUrl = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputLogoUrl.trim()) {
          onLogoUpload(inputLogoUrl.trim());
      }
      setIsEditingLogo(false);
  };

  const closeMenuAndCall = (fn?: () => void) => {
      if (fn) fn();
      setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-brand-blue text-white shadow-lg sticky top-0 z-40 border-b border-white/10">
        {/* Top bar de Versão de Teste */}
        <div className="bg-safety-yellow text-slate-900 py-1 px-4 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Ambiente de Demonstração • Versão de Teste</p>
        </div>

        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex justify-between items-center h-20 gap-2">
            
            <div className="flex items-center gap-3 shrink-0 relative">
               <div className={`relative group cursor-pointer select-none bg-white p-1 rounded-sm shadow-sm transition-all ${isAdminMode ? 'hover:ring-2 hover:ring-brand-teal' : ''}`} onClick={handleLogoClick}>
                  <img src={logoUrl || "https://via.placeholder.com/150x50?text=LOGO"} alt="Logo" className="h-9 sm:h-11 w-auto object-contain" />
                  {isAdminMode && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
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
                              <button type="button" onClick={() => setIsEditingLogo(false)} className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase hover:bg-gray-200">Cancelar</button>
                              <button type="submit" className="flex-1 px-3 py-2 bg-brand-blue text-white text-[10px] font-bold rounded uppercase hover:bg-slate-900 shadow-md">Aplicar</button>
                          </div>
                      </form>
                  </div>
              )}

              <div className="hidden lg:block">
                  <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-[13px] font-display font-bold text-white tracking-wide leading-none">{storeName.toUpperCase()}</h1>
                      <span className="bg-safety-yellow text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm animate-pulse whitespace-nowrap">VERSÃO DE TESTE</span>
                  </div>
                  <p className="text-[9px] text-brand-teal font-black uppercase tracking-wider">Segurança do Trabalho</p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2 relative flex-1 justify-end">
               {(isAdminMode || isSubscriber) && (
                   <button onClick={onOpenDesigner} className="px-3 py-2 bg-gradient-to-r from-brand-teal to-brand-blue text-white text-[10px] font-bold rounded-lg shadow-lg hover:shadow-brand-teal/30 transition-all flex items-center gap-1.5 border border-white/20 whitespace-nowrap">🎨 Designer</button>
               )}
               
               {/* BOTÃO VISUALIZAR (ABERTO) */}
               <button onClick={onViewCatalog} className="px-3 py-2 text-[10px] font-bold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all flex items-center gap-1.5 whitespace-nowrap">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                   VER CATÁLOGO
               </button>

               {/* BOTÃO BAIXAR (PROTEGIDO) */}
               <button onClick={onDownloadCatalog} className={`px-3 py-2 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 border whitespace-nowrap ${isAdminMode ? 'bg-white/10 hover:bg-white/20 text-white border-white/10' : 'bg-white/5 hover:bg-white/10 text-white/40 border-white/5 opacity-60 hover:opacity-100'}`}>
                   {isAdminMode ? (
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                   ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25Z" /></svg>
                   )}
                   BAIXAR PDF
               </button>

               {isAdminMode && (
                   <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg border border-white/10 overflow-x-auto">
                       <button onClick={onOpenOrderManager} className="relative px-2 py-1.5 text-[10px] font-bold bg-white/10 text-white rounded hover:bg-white/20 transition-colors whitespace-nowrap">Pedidos {pendingOrdersCount > 0 && <span className="ml-1 bg-red-600 px-1 rounded-full text-[9px]">{pendingOrdersCount}</span>}</button>
                       <button onClick={onOpenSubscriberManager} className="px-2 py-1.5 text-[10px] font-bold bg-white/10 text-white rounded hover:bg-white/20 transition-colors whitespace-nowrap">Assinantes</button>
                       <div className="h-4 w-px bg-white/20 mx-0.5"></div>
                       <button onClick={onExportData} className="px-2 py-1.5 text-[10px] font-bold bg-blue-600 text-white rounded hover:bg-blue-500" title="Backup">⬇️</button>
                       <button onClick={() => fileInputRef.current?.click()} className="px-2 py-1.5 text-[10px] font-bold bg-slate-700 text-white rounded hover:bg-slate-600" title="Restaurar">⬆️</button>
                       <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={(e) => e.target.files?.[0] && onImportData(e.target.files[0])} />
                       <button onClick={onGenerateCode} className="px-2 py-1.5 text-[10px] font-bold bg-orange-600 text-white rounded hover:bg-orange-500 shadow-sm flex items-center gap-1 border border-orange-400 whitespace-nowrap">🚀 Código</button>
                   </div>
               )}

               {!adminLockHidden && (
                   <button onClick={onToggleAdmin} className={`text-[10px] font-bold px-3 py-1.5 rounded transition-all uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 shadow-lg border ${isAdminMode ? 'bg-red-600 text-white border-red-500' : 'bg-white text-brand-blue border-white hover:bg-gray-100'}`}>
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                           {isAdminMode ? <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25Z" />}
                       </svg>
                       {isAdminMode ? 'Sair' : 'Acesso Restrito'}
                   </button>
               )}

               {isSubscriber ? (
                   <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 shrink-0">
                       <div className="flex flex-col items-end">
                           <span className="text-[10px] font-bold text-white truncate max-w-[80px]">{currentSubscriber?.name}</span>
                           <span className="text-[8px] text-brand-teal font-black uppercase">VIP</span>
                       </div>
                       <button onClick={onSubscriberLogout} className="text-white/40 hover:text-red-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg></button>
                   </div>
               ) : (
                   <div className="flex items-center gap-2 shrink-0">
                       <button onClick={onOpenPaymentModal} className="hidden lg:block text-[10px] font-bold px-3 py-2 rounded shadow-lg bg-brand-teal text-white hover:bg-brand-teal/80 transition-all uppercase tracking-wide">Acesso</button>
                       <button onClick={() => setShowLogin(!showLogin)} className={`text-[10px] font-bold px-3 py-2 rounded border transition-colors uppercase tracking-wide ${showLogin ? 'bg-white/20 text-white border-white/40' : 'text-white/60 border-white/20 hover:border-white/40 hover:text-white'}`}>Entrar</button>
                   </div>
               )}

               <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <button onClick={onOpenCart} className="relative p-1.5 text-white/80 hover:text-brand-teal transition-colors shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                      {cartItemCount > 0 && <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-safety-red rounded-full border border-brand-blue">{cartItemCount}</span>}
                  </button>
                  <button onClick={() => setIsQrModalOpen(true)} className="p-1.5 text-white/40 hover:text-white transition-colors shrink-0"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" /></svg></button>
              </div>
            </div>

            {/* Mobile Header Icons */}
            <div className="md:hidden flex items-center gap-3">
                <button onClick={onOpenCart} className="relative p-2 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>
                    {cartItemCount > 0 && <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-safety-red rounded-full">{cartItemCount}</span>}
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white transition-colors hover:bg-white/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                        {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
                    </svg>
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Content */}
        {isMenuOpen && (
            <div className="md:hidden bg-slate-900 border-t border-white/10 animate-fade-in shadow-2xl overflow-y-auto max-h-[calc(100vh-80px)]">
                <div className="p-4 space-y-3">
                    {/* Badge Mobile */}
                    <div className="bg-safety-yellow p-2 rounded-lg text-slate-900 text-center mb-2">
                         <span className="text-[10px] font-black uppercase">Modo de Apresentação • Versão de Teste</span>
                    </div>

                    {/* Public Actions */}
                    <button onClick={() => closeMenuAndCall(onViewCatalog)} className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all border border-white/10">
                        <span className="bg-blue-500/20 p-2 rounded-lg text-blue-500">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                        </span>
                        Ver Catálogo Técnico
                    </button>

                    <button onClick={() => closeMenuAndCall(onDownloadCatalog)} className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all border border-white/10">
                        <span className="bg-red-500/20 p-2 rounded-lg text-red-500">
                             {isAdminMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                             ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25Z" /></svg>
                             )}
                        </span>
                        Baixar Catálogo (Admin)
                    </button>

                    {(isAdminMode || isSubscriber) && (
                        <button onClick={() => closeMenuAndCall(onOpenDesigner)} className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-brand-teal/20 to-brand-blue/20 hover:from-brand-teal/30 hover:to-brand-blue/30 rounded-xl text-sm font-black transition-all border border-brand-teal/30">
                            <span className="text-brand-teal bg-white/10 p-2 rounded-lg">🎨</span>
                            Abrir Studio Designer
                        </button>
                    )}

                    {!isSubscriber && !isAdminMode && (
                        <button onClick={() => closeMenuAndCall(onOpenPaymentModal)} className="w-full flex items-center gap-3 p-3 bg-brand-teal text-white rounded-xl text-sm font-black shadow-lg">
                            <span className="bg-white/20 p-2 rounded-lg">🚀</span>
                            Liberar Acesso Completo
                        </button>
                    )}

                    {/* Restricted Access Login */}
                    {!adminLockHidden && !isAdminMode && (
                        <button onClick={() => closeMenuAndCall(onToggleAdmin)} className="w-full flex items-center gap-3 p-3 bg-white text-brand-blue rounded-xl text-sm font-black shadow-lg">
                            <span className="bg-brand-blue/10 p-2 rounded-lg">🔒</span>
                            Acesso Restrito (Admin)
                        </button>
                    )}

                    {/* VIP Login Section */}
                    {isSubscriber ? (
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-brand-teal rounded-full flex items-center justify-center font-bold">
                                        {currentSubscriber?.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold truncate max-w-[120px]">{currentSubscriber?.name}</p>
                                        <p className="text-[10px] text-brand-teal font-black uppercase">Cliente VIP</p>
                                    </div>
                                </div>
                                <button onClick={() => closeMenuAndCall(onSubscriberLogout)} className="text-red-400 font-bold text-xs p-2 bg-red-400/10 rounded-lg">Sair</button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2 pt-2">
                             <p className="text-[10px] font-black text-white/40 uppercase px-2">Já é Assinante?</p>
                             <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={loginKey} 
                                    onChange={(e) => setLoginKey(e.target.value)}
                                    placeholder="Chave VIP"
                                    className="flex-1 bg-white/10 border border-white/20 rounded-lg p-3 text-xs outline-none focus:border-brand-teal"
                                />
                                <button onClick={handleLoginSubmit} className="bg-white text-brand-blue px-4 rounded-lg font-bold text-xs">Entrar</button>
                             </div>
                        </div>
                    )}

                    {/* Admin Tools (Shown only if Admin Mode is ON) */}
                    {isAdminMode && (
                        <div className="pt-4 border-t border-white/10 space-y-2">
                             <p className="text-[10px] font-black text-brand-teal uppercase px-2 mb-2">Painel de Controle</p>
                             <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => closeMenuAndCall(onOpenOrderManager)} className="p-3 bg-white/5 rounded-lg text-[10px] font-bold text-left hover:bg-white/10 border border-white/5">📦 Pedidos</button>
                                <button onClick={() => closeMenuAndCall(onOpenSubscriberManager)} className="p-3 bg-white/5 rounded-lg text-[10px] font-bold text-left hover:bg-white/10 border border-white/5">👥 Assinantes</button>
                                <button onClick={() => closeMenuAndCall(onOpenResellerManager)} className="p-3 bg-white/5 rounded-lg text-[10px] font-bold text-left hover:bg-white/10 border border-white/5">🤝 Revenda</button>
                                <button onClick={() => closeMenuAndCall(onGenerateCode)} className="p-3 bg-orange-600/20 text-orange-400 rounded-lg text-[10px] font-bold text-left hover:bg-orange-600/30 border border-orange-600/30">🚀 Gerar Código</button>
                             </div>
                             <div className="flex gap-2 pt-2">
                                <button onClick={() => closeMenuAndCall(onExportData)} className="flex-1 p-3 bg-blue-600 rounded-lg text-[10px] font-bold text-center">Exportar Backup</button>
                                <button onClick={() => closeMenuAndCall(onToggleAdmin)} className="flex-1 p-3 bg-red-600 rounded-lg text-[10px] font-bold text-center">Sair Admin</button>
                             </div>
                        </div>
                    )}

                    <button onClick={() => closeMenuAndCall(() => setIsQrModalOpen(true))} className="w-full flex items-center justify-center gap-2 p-3 text-white/40 hover:text-white transition-colors text-xs font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" /></svg>
                        Compartilhar Site
                    </button>
                </div>
            </div>
        )}
        <div className="h-1 w-full bg-safety-stripes opacity-30"></div>
      </header>
      <SiteQrModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} storeName={storeName} />
    </>
  );
};

export default Header;
