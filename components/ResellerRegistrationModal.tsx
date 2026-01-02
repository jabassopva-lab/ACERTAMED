
import React, { useState } from 'react';
import { saveResellerToCloud, isConfigured } from '../supabaseClient';

interface ResellerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappAdmin: string;
}

const ResellerRegistrationModal: React.FC<ResellerRegistrationModalProps> = ({ isOpen, onClose, whatsappAdmin }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    doc: '',
    city: '',
    pixKey: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Nome e Telefone são obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    const newReseller = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        createdAt: new Date().toISOString()
    };

    let saved = false;
    
    // 1. Tenta salvar no Supabase se estiver online
    if (isConfigured) {
        saved = await saveResellerToCloud(newReseller);
    } else {
        // 2. MODO OFFLINE: Salva no LocalStorage para testes imediatos
        try {
            const existingData = localStorage.getItem('app_resellers_list');
            const currentList = existingData ? JSON.parse(existingData) : [];
            const newList = [newReseller, ...currentList];
            localStorage.setItem('app_resellers_list', JSON.stringify(newList));
            saved = true;
        } catch (err) {
            console.error("Erro ao salvar localmente", err);
            saved = false;
        }
    }

    if (saved) {
        // Se salvou (no banco ou local), avisa e fecha
        alert(isConfigured 
            ? "✅ Cadastro enviado para a nuvem com sucesso!" 
            : "✅ Cadastro salvo localmente (Modo Offline)!\n\nAcesse o Painel Admin > Revendedores para ver.");
        onClose();
        
        // Opcional: Ainda pode abrir o WhatsApp para notificar o admin
        if (!isConfigured) {
             const message = `👋 Olá! Fiz meu cadastro de revendedor (Salvo Localmente).\n\n👤 *Nome:* ${formData.name}\n📞 *Zap:* ${formData.phone}`;
             const link = `https://wa.me/${whatsappAdmin}?text=${encodeURIComponent(message)}`;
             // Pequeno delay para não bloquear o alert
             setTimeout(() => window.open(link, '_blank'), 500);
        }
    } else {
        // Fallback total se der erro
        const message = `👋 Olá! Gostaria de me cadastrar como Revendedor.\n\n👤 *Nome:* ${formData.name}\n📞 *Zap:* ${formData.phone}\n📄 *CPF/CNPJ:* ${formData.doc}\n📍 *Cidade:* ${formData.city}\n💰 *Pix:* ${formData.pixKey}`;
        const link = `https://wa.me/${whatsappAdmin}?text=${encodeURIComponent(message)}`;
        window.open(link, '_blank');
        onClose();
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>

        <div className="bg-indigo-900 text-white p-8 pt-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"></div>
            <h2 className="text-2xl font-bold mb-2">Seja um Parceiro</h2>
            <p className="text-indigo-200 text-sm">Cadastre-se para revender nossos produtos e ganhar comissões.</p>
        </div>

        <div className="p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                    <input 
                        type="text" 
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp</label>
                        <input 
                            type="text" 
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="(00) 90000-0000"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cidade / UF</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Cuiabá - MT"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CPF ou CNPJ</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Documento"
                            value={formData.doc}
                            onChange={(e) => setFormData({...formData, doc: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Chave Pix (Comissão)</label>
                        <input 
                            type="text" 
                            className="w-full border border-green-300 bg-green-50 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-500 text-green-800 font-medium"
                            placeholder="Sua chave Pix"
                            value={formData.pixKey}
                            onChange={(e) => setFormData({...formData, pixKey: e.target.value})}
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform hover:scale-[1.02] mt-4 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? 'Salvando...' : 'Confirmar Cadastro'}
                    {!isSubmitting && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12Zm0 0h7.5" />
                        </svg>
                    )}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ResellerRegistrationModal;
