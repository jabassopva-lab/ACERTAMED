
import React, { useState, useEffect } from 'react';
import { CartItem, Order } from '../types';
import { processGoogleDriveLink } from '../utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  whatsappNumber?: string;
  onPlaceOrder: (order: Order) => void;
  storeName?: string;
  logoUrl?: string;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
    isOpen, 
    onClose, 
    cartItems, 
    onRemoveItem, 
    onUpdateQuantity, 
    whatsappNumber = '5566992442998',
    onPlaceOrder,
    storeName = "Sinalização de Segurança",
    logoUrl
}) => {
  const [customerName, setCustomerName] = useState(() => localStorage.getItem('saved_customer_name') || '');
  const [customerPhone, setCustomerPhone] = useState(() => localStorage.getItem('saved_customer_phone') || '');
  const [observations, setObservations] = useState('');
  const [errors, setErrors] = useState<{name?: string, phone?: string}>({});
  const [orderPlaced, setOrderPlaced] = useState<Order | null>(null);

  useEffect(() => {
      if (isOpen && !orderPlaced) {
          setCustomerName(localStorage.getItem('saved_customer_name') || '');
          setCustomerPhone(localStorage.getItem('saved_customer_phone') || '');
          setObservations('');
      }
  }, [isOpen, orderPlaced]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    setCustomerPhone(value);
  };

  const validateForm = () => {
      const newErrors: {name?: string, phone?: string} = {};
      let isValid = true;
      if (!customerName.trim()) { newErrors.name = 'Obrigatório'; isValid = false; }
      if (!customerPhone.trim() || customerPhone.length < 14) { newErrors.phone = 'Telefone inválido'; isValid = false; }
      setErrors(newErrors);
      return isValid;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (!validateForm()) return;

    const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        shortId: `#REL-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        customerName: customerName,
        customerPhone: customerPhone,
        items: [...cartItems],
        status: 'Pendente',
        total: 0,
        paymentMethod: 'consulta',
        observations: observations.trim() || undefined
    };

    onPlaceOrder(newOrder);
    setOrderPlaced(newOrder);
  };

  const handlePrintOrder = () => {
    if (!orderPlaced) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = orderPlaced.items.map(i => {
        const imgSrc = i.customImage || processGoogleDriveLink(i.sign.imageUrl);
        const code = i.sign.code || `REF-${i.sign.id.toString().slice(-4)}`;
        return `
            <tr>
                <td style="text-align: center; padding: 10px;">
                    <img src="${imgSrc}" style="width: 80px; height: 80px; object-fit: contain; border: 1px solid #ddd; border-radius: 4px;" />
                </td>
                <td style="text-align: center; font-weight: bold; font-family: monospace;">${code}</td>
                <td><strong>${i.sign.title}</strong><br/><small>${i.sign.category}</small></td>
                <td style="text-align: center;">${i.size}</td>
                <td style="text-align: center;">${i.quantity}</td>
                <td style="font-size: 10px; color: #555;">${i.customText || i.sign.description}</td>
            </tr>
        `;
    }).join('');

    const htmlContent = `
        <html>
        <head>
            <title>Relatório de Escolhas - ${storeName}</title>
            <style>
                body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.4; } 
                table { width: 100%; border-collapse: collapse; margin-top: 20px; } 
                th, td { border: 1px solid #eee; padding: 12px; text-align: left; font-size: 12px; } 
                th { background: #f8fafc; text-transform: uppercase; font-size: 10px; color: #64748b; font-weight: 800; }
                .header { text-align: center; border-bottom: 2px solid #1D4E89; padding-bottom: 20px; }
                .logo { max-height: 60px; margin-bottom: 10px; object-fit: contain; }
                .footer { margin-top: 40px; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #eee; padding-top: 20px; }
                .meta { margin-top: 20px; background: #f1f5f9; padding: 15px; border-radius: 8px; font-size: 11px; display: flex; justify-content: space-between; }
                .compliance-badge { margin-top: 25px; border: 1px solid #009BA5; background: #f0fdfa; padding: 12px; border-radius: 6px; }
                .compliance-badge h4 { color: #009BA5; margin: 0 0 5px 0; font-size: 11px; text-transform: uppercase; font-weight: 900; }
                .compliance-badge p { margin: 0; font-size: 10px; color: #0f766e; font-weight: 500; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="header">
                ${logoUrl ? `<img src="${logoUrl}" class="logo" />` : ''}
                <h1 style="margin:0; font-size: 20px; color: #1D4E89;">${storeName}</h1>
                <h2 style="margin:5px 0 0 0; font-size: 14px; color: #64748b;">Relatório de Sinalização Técnica</h2>
            </div>
            
            <div class="meta">
                <div>
                    <strong>Solicitante:</strong> ${orderPlaced.customerName}<br/>
                    <strong>Contato:</strong> ${orderPlaced.customerPhone}
                </div>
                <div style="text-align: right;">
                    <strong>Relatório:</strong> ${orderPlaced.shortId}<br/>
                    <strong>Emissão:</strong> ${new Date().toLocaleDateString('pt-BR')}
                </div>
            </div>

            <div class="compliance-badge">
                <h4>✅ Conformidade Normativa NR 26</h4>
                <p>Esta seleção segue os padrões da NR 26 e ISO 7010.</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="width: 80px;">Arte</th>
                        <th style="text-align: center;">Cód.</th>
                        <th>Modelo / Categoria</th>
                        <th style="text-align: center;">Tamanho</th>
                        <th style="text-align: center;">Qtd</th>
                        <th>Especificações</th>
                    </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>

            <div class="footer">
                © ${new Date().getFullYear()} ${storeName}
            </div>
            <script>window.onload = function() { setTimeout(function() { window.print(); }, 800); }</script>
        </body>
        </html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className={`px-6 py-5 border-b flex items-center justify-between ${orderPlaced ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <h2 className="text-xl font-bold uppercase tracking-tight">{orderPlaced ? 'Relatório Gerado' : 'Minha Lista'}</h2>
            <button onClick={onClose} className="hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
        </div>

        {orderPlaced ? (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-blue-50/30 overflow-y-auto">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">Relatório Pronto!</h3>
                <p className="text-slate-500 text-sm mb-6">Seus modelos foram registrados seguindo os padrões da NR 26.</p>
                <button onClick={handlePrintOrder} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg mb-6 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.198-.54-1.139-1.201l.229-2.523m11.356-8.006a2.25 2.25 0 0 0 2.25-2.25V4.5a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 2.25 4.5v2.812a2.25 2.25 0 0 0 2.25 2.25" /></svg>
                    Imprimir PDF Normatizado
                </button>
                <button onClick={() => { setOrderPlaced(null); onClose(); }} className="text-blue-600 font-bold underline">Criar nova lista</button>
            </div>
        ) : (
            <>
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                            <p className="text-lg font-bold">Sua lista está vazia.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border border-slate-100 shadow-sm relative group">
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border">
                                            <img src={item.customImage || processGoogleDriveLink(item.sign.imageUrl)} className="max-w-full max-h-full object-contain pointer-events-none" alt="Preview" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between">
                                                <h3 className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{item.sign.title}</h3>
                                                <span className="text-[9px] font-black text-slate-400 font-mono">#{item.sign.code || item.sign.id.toString().slice(-4)}</span>
                                            </div>
                                            <p className="text-[10px] font-black text-blue-600 uppercase mt-0.5">{item.size}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <div className="flex items-center border rounded h-7 bg-slate-50">
                                                    <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-2 font-bold">-</button>
                                                    <span className="px-3 font-bold text-xs">{item.quantity}</span>
                                                    <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-2 font-bold">+</button>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => onRemoveItem(item.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b pb-2">Seus Dados</h3>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Seu Nome / Empresa *</label>
                                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={`w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:outline-none ${errors.name ? 'border-red-500' : 'border-slate-300'}`} placeholder="Como devemos chamar você?" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">WhatsApp de Contato *</label>
                                    <input type="text" value={customerPhone} onChange={handlePhoneChange} className={`w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:outline-none ${errors.phone ? 'border-red-500' : 'border-slate-300'}`} placeholder="(00) 00000-0000" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Observações Adicionais</label>
                                    <textarea value={observations} onChange={(e) => setObservations(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Ex: Entrega prioritária..." rows={3} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-6 border-t bg-white">
                        <button onClick={handleCheckout} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                            Gerar Relatório de Escolhas
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        </button>
                    </div>
                )}
            </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
