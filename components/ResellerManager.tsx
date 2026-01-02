
import React, { useState, useEffect } from 'react';
import { isConfigured, subscribeToResellers, saveResellerToCloud } from '../supabaseClient';

interface ResellerManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Reseller {
    id: string;
    name: string;
    phone: string;
    doc: string; // CPF ou CNPJ
    city: string;
    pixKey: string; // Para pagamento de comissão
    createdAt: string;
    totalSales?: number; // Futuro uso
}

const ResellerManager: React.FC<ResellerManagerProps> = ({ isOpen, onClose }) => {
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [formData, setFormData] = useState({
      name: '',
      phone: '',
      doc: '',
      city: '',
      pixKey: ''
  });

  useEffect(() => {
      if (isOpen) {
          // Se estiver online, sincroniza com o banco
          if (isConfigured) {
              const unsubscribe = subscribeToResellers((data) => {
                  setResellers(data);
              });
              return () => unsubscribe();
          } else {
              // Fallback LocalStorage
              const saved = localStorage.getItem('app_resellers_list');
              if (saved) {
                  const parsed = JSON.parse(saved).map((r: any) => ({
                      ...r,
                      phone: r.phone || '',
                      doc: r.doc || '',
                      city: r.city || '',
                      pixKey: r.pixKey || ''
                  }));
                  setResellers(parsed);
              }
          }
      }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.name.trim() || !formData.phone.trim()) {
          alert("Nome e Telefone são obrigatórios.");
          return;
      }

      const newResellerData = {
          ...formData,
          createdAt: new Date().toISOString()
      };

      if (editingId) {
          // Editar existente (apenas local por enquanto na edição rápida, ideal seria update no supabase)
          const updatedList = resellers.map(r => 
              r.id === editingId ? { ...r, ...formData } : r
          );
          setResellers(updatedList);
          localStorage.setItem('app_resellers_list', JSON.stringify(updatedList));
      } else {
          // Criar novo
          const newReseller: Reseller = {
              id: Math.random().toString(36).substr(2, 9),
              ...newResellerData
          };
          
          if (isConfigured) {
              saveResellerToCloud(newReseller);
          } else {
              const newList = [newReseller, ...resellers];
              setResellers(newList);
              localStorage.setItem('app_resellers_list', JSON.stringify(newList));
          }
      }

      resetForm();
  };

  const handleEdit = (reseller: Reseller) => {
      setFormData({
          name: reseller.name,
          phone: reseller.phone,
          doc: reseller.doc,
          city: reseller.city,
          pixKey: reseller.pixKey
      });
      setEditingId(reseller.id);
      setShowForm(true);
  };

  const handleDelete = (id: string) => {
      if (confirm('Tem certeza que deseja remover este vendedor? (Apenas visualização local)')) {
          setResellers(resellers.filter(r => r.id !== id));
      }
  };

  const resetForm = () => {
      setFormData({ name: '', phone: '', doc: '', city: '', pixKey: '' });
      setEditingId(null);
      setShowForm(false);
  };

  const generateStoreLink = (name: string) => {
      const baseUrl = window.location.origin;
      const safeName = encodeURIComponent(name);
      return `${baseUrl}/?vendedor=${safeName}`;
  };

  const generatePlanLink = (name: string) => {
      const baseUrl = window.location.origin;
      const safeName = encodeURIComponent(name);
      return `${baseUrl}/?vendedor=${safeName}#planos`;
  };

  const handleCopyLink = (text: string) => {
      navigator.clipboard.writeText(text);
      alert(`Link copiado!`);
  };

  const handleCopyRegistrationLink = () => {
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/?page=cadastro-revendedor`;
      navigator.clipboard.writeText(link);
      alert("Link de Auto-Cadastro copiado!\n\nEnvie para os candidatos.");
  };

  const handleShareWhatsapp = (r: Reseller) => {
      const link = generateStoreLink(r.name);
      const message = `Olá ${r.name}! \n\nCadastro de revendedor aprovado. ✅\n\nAqui está o seu link de vendas:\n${link}\n\nEnvie este link para seus clientes!`;
      
      const cleanPhone = r.phone.replace(/\D/g, '');
      const whatsappUrl = cleanPhone 
        ? `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-indigo-900 text-white p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              🤝 Gestão de Revendedores
            </h2>
            <p className="text-indigo-200 text-sm">Vendas de produtos físicos e assinaturas.</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* LISTA LATERAL (OU FULL EM MOBILE QUANDO NÃO TEM FORM) */}
            <div className={`flex-1 overflow-y-auto custom-scrollbar bg-gray-50 border-r border-gray-200 ${showForm ? 'hidden md:block md:w-1/3 lg:w-1/4' : 'w-full'}`}>
                <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10 space-y-2">
                    <button 
                        onClick={handleCopyRegistrationLink}
                        className="w-full bg-white border-2 border-indigo-100 text-indigo-700 font-bold py-2 rounded-lg text-xs hover:bg-indigo-50 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                        </svg>
                        Copiar Link de Cadastro
                    </button>
                    <button 
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                        + Adicionar Manual
                    </button>
                </div>

                <div className="p-2 space-y-2">
                    {resellers.length === 0 ? (
                        <p className="text-center text-gray-400 py-10 text-sm">Nenhum cadastro.</p>
                    ) : (
                        resellers.map(r => (
                            <div 
                                key={r.id} 
                                onClick={() => handleEdit(r)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${editingId === r.id ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-300' : 'bg-white border-gray-200 hover:border-indigo-300'}`}
                            >
                                <h4 className="font-bold text-gray-800">{r.name}</h4>
                                <div className="text-xs text-gray-500 mt-1 flex flex-col gap-0.5">
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-green-600">
                                            <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
                                        </svg>
                                        {r.phone || 'Sem telefone'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* FORMULÁRIO (CENTRO/DIREITA) */}
            <div className={`flex-1 bg-white p-6 md:p-8 overflow-y-auto ${!showForm && resellers.length > 0 ? 'hidden md:flex flex-col items-center justify-center text-center' : 'block'}`}>
                
                {!showForm && resellers.length > 0 ? (
                    <div className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 mx-auto mb-4 opacity-30">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                        <p>Selecione um vendedor ao lado para gerar os links.</p>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingId ? 'Editar Cadastro' : 'Novo Cadastro'}
                            </h3>
                            {editingId && (
                                <button onClick={() => handleDelete(editingId)} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                    Excluir
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Nome Completo *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Ex: Carlos Silva"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp / Telefone *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="(00) 90000-0000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">CPF ou CNPJ</label>
                                    <input 
                                        type="text" 
                                        value={formData.doc}
                                        onChange={(e) => setFormData({...formData, doc: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="000.000.000-00"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Cidade / Estado</label>
                                    <input 
                                        type="text" 
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Ex: São Paulo - SP"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Chave Pix (Comissão)</label>
                                    <input 
                                        type="text" 
                                        value={formData.pixKey}
                                        onChange={(e) => setFormData({...formData, pixKey: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none bg-green-50 border-green-200 text-green-800 font-mono"
                                        placeholder="CPF, Email ou Aleatória"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                {editingId ? (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Links para Divulgação</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        const r = resellers.find(x => x.id === editingId);
                                                        if(r) handleCopyLink(generateStoreLink(r.name));
                                                    }}
                                                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold py-2 rounded-lg border border-indigo-200 text-xs"
                                                >
                                                    📦 Link Loja (Placas)
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        const r = resellers.find(x => x.id === editingId);
                                                        if(r) handleCopyLink(generatePlanLink(r.name));
                                                    }}
                                                    className="bg-green-100 hover:bg-green-200 text-green-800 font-bold py-2 rounded-lg border border-green-200 text-xs flex items-center justify-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                                    </svg>
                                                    Link Assinaturas
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    const r = resellers.find(x => x.id === editingId);
                                                    if(r) handleShareWhatsapp(r);
                                                }}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-sm flex items-center justify-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.374-5.03c0-5.42 4.409-9.816 9.824-9.816 2.625 0 5.092 1.022 6.947 2.877 1.855 1.855 2.876 4.323 2.876 6.946 0 5.421-4.411 9.816-9.828 9.816"/>
                                                </svg>
                                                Enviar no Zap
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md"
                                            >
                                                Salvar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button 
                                            type="button" 
                                            onClick={resetForm}
                                            className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-lg hover:bg-gray-200 mr-2"
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md"
                                        >
                                            Cadastrar Vendedor
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResellerManager;
