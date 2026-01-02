
import React, { useState, useEffect } from 'react';
import { Subscriber } from '../types';
import { APP_CONFIG } from '../constants';

interface SubscriberManagerProps {
  isOpen: boolean;
  onClose: () => void;
  subscribers: Subscriber[];
  onAddSubscriber: (name: string, type: 'vip' | 'trial', validity?: string, reseller?: string, planType?: 'annual' | 'monthly', commission?: number) => void;
  onToggleStatus: (id: string) => void;
  onDeleteSubscriber: (id: string) => void;
  onUpdateSubscriber: (id: string, data: Partial<Subscriber>) => void;
  isOnline?: boolean;
}

const SubscriberManager: React.FC<SubscriberManagerProps> = (props) => {
  const {
    isOpen,
    onClose,
    subscribers = [], 
    onAddSubscriber,
    onToggleStatus,
    onDeleteSubscriber,
    onUpdateSubscriber,
    isOnline = false
  } = props;

  const [newSubscriberName, setNewSubscriberName] = useState('');
  // Data padrão: hoje + 30 dias
  const [newSubscriberValidity, setNewSubscriberValidity] = useState(() => {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date.toISOString().split('T')[0];
  });

  // Novos estados para Vendedor e Plano
  const [selectedReseller, setSelectedReseller] = useState('');
  const [selectedPlanType, setSelectedPlanType] = useState<'annual' | 'monthly'>('annual');
  const [resellersList, setResellersList] = useState<any[]>([]);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSub, setEditingSub] = useState<Subscriber | null>(null);

  // Carrega lista de vendedores
  useEffect(() => {
      if (isOpen) {
          const savedResellers = localStorage.getItem('app_resellers_list');
          if (savedResellers) {
              setResellersList(JSON.parse(savedResellers));
          }
      }
  }, [isOpen]);

  // Atualiza a validade quando muda o tipo de plano
  useEffect(() => {
      const date = new Date();
      if (selectedPlanType === 'annual') {
          date.setFullYear(date.getFullYear() + 1);
      } else {
          date.setDate(date.getDate() + 30);
      }
      setNewSubscriberValidity(date.toISOString().split('T')[0]);
  }, [selectedPlanType]);

  if (!isOpen) return null;

  // Proteção: Garante que subscribers é um array
  const safeSubscribers = Array.isArray(subscribers) ? subscribers : [];

  const calculateCommission = (type: 'annual' | 'monthly') => {
      // REGRA DE COMISSÃO:
      // Anual: 20% do valor total
      // Mensal: 100% da primeira mensalidade (Bounty)
      
      const priceAnnual = parseFloat(APP_CONFIG.subscriptionPrice.replace(',', '.'));
      const priceMonthly = parseFloat(APP_CONFIG.subscriptionMonthlyPrice.replace(',', '.'));

      if (type === 'annual') {
          return priceAnnual * 0.20; // 20%
      } else {
          return priceMonthly * 1.0; // 100% do primeiro mês
      }
  };

  const handleAddVip = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newSubscriberName.trim()) {
      let commission = 0;
      if (selectedReseller) {
          commission = calculateCommission(selectedPlanType);
      }

      onAddSubscriber(
          newSubscriberName, 
          'vip', 
          newSubscriberValidity, 
          selectedReseller || undefined,
          selectedPlanType,
          commission
      );
      
      setNewSubscriberName('');
      setSelectedReseller('');
      alert("✅ Assinante VIP adicionado!");
    }
  };

  const handleAddTrial = (e: React.MouseEvent) => {
      e.preventDefault();
      const name = newSubscriberName.trim() || "Cliente Teste";
      // Trial não tem comissão nem plano selecionado
      onAddSubscriber(name, 'trial', newSubscriberValidity);
      setNewSubscriberName('');
  }

  const handleResetTrial = () => {
      localStorage.removeItem('app_device_trial_claimed');
      alert("✅ Limite de teste (5 créditos) resetado para este navegador!");
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (deleteConfirmId === id) {
          onDeleteSubscriber(id);
          setDeleteConfirmId(null);
      } else {
          setDeleteConfirmId(id);
          setTimeout(() => setDeleteConfirmId(null), 3000);
      }
  };

  const handleEditClick = (sub: Subscriber, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingSub(sub);
  };

  const handleToggleStatusClick = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleStatus(id);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation(); 
      
      if (editingSub && onUpdateSubscriber) {
          onUpdateSubscriber(editingSub.id, {
              name: editingSub.name,
              credits: editingSub.credits,
              type: editingSub.type,
              accessKey: editingSub.accessKey,
              validUntil: editingSub.validUntil,
              reseller: editingSub.reseller,
              commission: editingSub.commission
          });
          setEditingSub(null); 
      }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setEditingSub(null);
  };

  const handleOverlayClick = () => {
      onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
      e.stopPropagation();
  };

  const checkStatus = (sub: Subscriber) => {
      if (!sub.validUntil) return 'indefinido';
      const today = new Date().toISOString().split('T')[0];
      return sub.validUntil < today ? 'expirado' : 'valido';
  };

  const formatDate = (dateStr?: string) => {
      if (!dateStr) return '-';
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const filteredList = safeSubscribers.filter(sub => {
      if (!sub) return false;
      const term = searchTerm.toLowerCase();
      const name = (sub.name || '').toLowerCase();
      const key = (sub.accessKey || '').toLowerCase();
      const reseller = (sub.reseller || '').toLowerCase();
      return name.includes(term) || key.includes(term) || reseller.includes(term);
  });

  const total = safeSubscribers.length;
  const active = safeSubscribers.filter(s => s && s.isActive).length;
  const vip = safeSubscribers.filter(s => s && s.type === 'vip').length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={handleOverlayClick}>
      <div 
        className="bg-white w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden flex flex-col h-[90vh]"
        onClick={handleModalClick}
      >
        
        {/* Header */}
        <div className="bg-purple-900 text-white p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Gestão de Assinantes
            </h2>
            <p className="text-purple-200 text-sm">Gerencie acessos VIP e Trial.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
                onClick={handleResetTrial}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded border border-white/20"
                title="Libera novamente o teste grátis neste navegador"
            >
                Resetar Limite
            </button>
            <button onClick={onClose} className="text-white/70 hover:text-white">
                ✕
            </button>
          </div>
        </div>

        {!isOnline ? (
            <div className="bg-purple-50 border-b border-purple-100 p-3 flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-700 mt-0.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <div className="text-xs text-purple-800">
                    <strong>Modo Offline:</strong> Cadastre manualmente os clientes que pagaram via Pix.
                </div>
            </div>
        ) : (
            <div className="bg-green-50 border-b border-green-100 p-3 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <div className="text-xs text-green-800 font-bold">
                    🟢 ONLINE: Dados sincronizados.
                </div>
            </div>
        )}

        <div className="p-6 flex-1 overflow-hidden flex flex-col relative">
          
          {/* Stats */}
          <div className="flex gap-4 mb-6">
              <div className="bg-purple-50 text-purple-800 px-4 py-2 rounded-lg flex-1 border border-purple-100 text-center">
                  <span className="block text-2xl font-bold">{total}</span>
                  <span className="text-xs uppercase font-bold">Total</span>
              </div>
              <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg flex-1 border border-green-100 text-center">
                  <span className="block text-2xl font-bold">{active}</span>
                  <span className="text-xs uppercase font-bold">Ativos</span>
              </div>
              <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg flex-1 border border-yellow-100 text-center">
                  <span className="block text-2xl font-bold">{vip}</span>
                  <span className="text-xs uppercase font-bold">VIP</span>
              </div>
          </div>

          {/* Controls - Form de Cadastro Rápido */}
          <div className="flex flex-col gap-4 mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase">Novo Acesso Manual</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-[10px] text-gray-500 font-bold mb-1">Nome do Cliente</label>
                        <input 
                            type="text" 
                            value={newSubscriberName}
                            onChange={(e) => setNewSubscriberName(e.target.value)}
                            placeholder="Nome..."
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    </div>
                    
                    <div className="md:col-span-1">
                        <label className="block text-[10px] text-gray-500 font-bold mb-1">Vendedor Indicado</label>
                        <select 
                            value={selectedReseller}
                            onChange={(e) => setSelectedReseller(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                            <option value="">-- Nenhum / Direto --</option>
                            {resellersList.map(r => (
                                <option key={r.id} value={r.name}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-[10px] text-gray-500 font-bold mb-1">Plano & Comissão</label>
                        <select 
                            value={selectedPlanType}
                            onChange={(e) => setSelectedPlanType(e.target.value as 'annual' | 'monthly')}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                        >
                            <option value="annual">Anual (Comissão 20%)</option>
                            <option value="monthly">Mensal (Comissão 100% 1º mês)</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleAddVip} className="flex-1 bg-purple-700 text-white font-bold px-3 py-2 rounded text-xs shadow hover:bg-purple-800 transition-colors">
                            + Add VIP
                        </button>
                        <button onClick={handleAddTrial} className="flex-1 bg-blue-600 text-white font-bold px-3 py-2 rounded text-xs shadow hover:bg-blue-700 transition-colors" title="Acesso Grátis 30 dias">
                            + Trial
                        </button>
                    </div>
                </div>
                
                {selectedReseller && (
                    <div className="text-xs text-indigo-600 bg-indigo-50 p-2 rounded border border-indigo-100 flex justify-between">
                        <span>Vendedor: <strong>{selectedReseller}</strong></span>
                        <span>Comissão Estimada: <strong>{formatCurrency(calculateCommission(selectedPlanType))}</strong></span>
                    </div>
                )}
          </div>

          <div className="mb-4">
              <input 
                  type="text" 
                  placeholder="Pesquisar por nome, chave ou vendedor..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
              />
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto border rounded-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-xs sticky top-0 z-10">
                <tr>
                  <th className="p-3 border-b">Nome</th>
                  <th className="p-3 border-b">Chave</th>
                  <th className="p-3 border-b text-center">Tipo / Plano</th>
                  <th className="p-3 border-b text-center">Vendedor / Comissão</th>
                  <th className="p-3 border-b text-center">Validade</th>
                  <th className="p-3 border-b text-center">Status</th>
                  <th className="p-3 border-b text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredList.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-gray-400">Nenhum assinante.</td></tr>
                ) : (
                  filteredList.map((sub) => {
                    const status = checkStatus(sub);
                    return (
                    <tr key={sub.id} className={`hover:bg-gray-50 ${!sub.isActive ? 'bg-red-50' : ''}`}>
                      <td className="p-3 font-medium">{sub.name}</td>
                      <td className="p-3 font-mono text-purple-700 select-all">{sub.accessKey}</td>
                      <td className="p-3 text-center">
                        {sub.type === 'trial' ? (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">TRIAL</span>
                        ) : (
                            <div className="flex flex-col items-center">
                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800">VIP</span>
                                {sub.planType && (
                                    <span className="text-[9px] text-gray-500 uppercase font-bold mt-0.5">{sub.planType === 'annual' ? 'Anual' : 'Mensal'}</span>
                                )}
                            </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                          {sub.reseller ? (
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase mb-0.5">{sub.reseller}</span>
                                  {sub.commission ? (
                                      <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1 rounded border border-green-100">
                                          Comissão: {formatCurrency(sub.commission)}
                                      </span>
                                  ) : (
                                      <span className="text-[9px] text-gray-400">S/ Comissão</span>
                                  )}
                              </div>
                          ) : (
                              <span className="text-gray-400 text-xs">-</span>
                          )}
                      </td>
                      <td className="p-3 text-center">
                          {status === 'expirado' ? (
                              <span className="text-red-600 font-bold text-xs bg-red-100 px-2 py-0.5 rounded">EXPIRADO ({formatDate(sub.validUntil)})</span>
                          ) : sub.validUntil ? (
                              <span className="text-green-700 font-medium text-xs">{formatDate(sub.validUntil)}</span>
                          ) : (
                              <span className="text-gray-400 text-xs">-</span>
                          )}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${sub.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {sub.isActive ? 'ATIVO' : 'BLOQ'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={(e) => handleEditClick(sub, e)}
                            className="p-1.5 rounded text-blue-500 hover:bg-blue-50 border border-blue-200"
                            title="Editar"
                          >
                              ✏️
                          </button>
                          <button 
                            onClick={(e) => handleToggleStatusClick(sub.id, e)}
                            className={`p-1.5 rounded border ${sub.isActive ? 'text-orange-500 border-orange-200' : 'text-green-500 border-green-200'}`}
                            title="Bloquear/Desbloquear"
                          >
                            {sub.isActive ? '🔒' : '🔓'}
                          </button>
                          <button 
                            onClick={(e) => handleDeleteClick(sub.id, e)}
                            className={`p-1.5 rounded border ${deleteConfirmId === sub.id ? 'bg-red-600 text-white border-red-600' : 'text-red-500 border-red-200'}`}
                            title="Excluir"
                          >
                            {deleteConfirmId === sub.id ? 'CONFIRMAR?' : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})
                )}
              </tbody>
            </table>
          </div>

          {/* Edit Modal Overlay */}
          {editingSub && (
              <div 
                className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-8"
                onClick={(e) => e.stopPropagation()} 
              >
                  <div className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-xl p-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Editar Assinante</h3>
                      
                      <form onSubmit={handleSaveEdit} className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Nome:</label>
                              <input 
                                  type="text" 
                                  value={editingSub.name || ''}
                                  onChange={(e) => setEditingSub({...editingSub, name: e.target.value})}
                                  className="w-full border rounded p-2 text-sm"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Chave:</label>
                              <input 
                                  type="text" 
                                  value={editingSub.accessKey || ''}
                                  onChange={(e) => setEditingSub({...editingSub, accessKey: e.target.value})}
                                  className="w-full border rounded p-2 text-sm font-mono"
                              />
                          </div>
                          
                          {/* Novos Campos de Edição */}
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1">Vendedor:</label>
                                  <input 
                                      type="text" 
                                      value={editingSub.reseller || ''}
                                      onChange={(e) => setEditingSub({...editingSub, reseller: e.target.value})}
                                      className="w-full border rounded p-2 text-sm"
                                      placeholder="Opcional"
                                  />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1">Comissão (R$):</label>
                                  <input 
                                      type="number" 
                                      value={editingSub.commission || 0}
                                      onChange={(e) => setEditingSub({...editingSub, commission: parseFloat(e.target.value) || 0})}
                                      className="w-full border rounded p-2 text-sm"
                                  />
                              </div>
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Validade do Plano:</label>
                              <input 
                                  type="date" 
                                  value={editingSub.validUntil || ''}
                                  onChange={(e) => setEditingSub({...editingSub, validUntil: e.target.value})}
                                  className="w-full border rounded p-2 text-sm"
                              />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1">Tipo:</label>
                                  <select 
                                      value={editingSub.type}
                                      onChange={(e) => setEditingSub({...editingSub, type: e.target.value as any})}
                                      className="w-full border rounded p-2 text-sm"
                                  >
                                      <option value="vip">VIP</option>
                                      <option value="trial">Trial</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1">Créditos:</label>
                                  <input 
                                      type="number" 
                                      value={editingSub.credits}
                                      onChange={(e) => setEditingSub({...editingSub, credits: parseInt(e.target.value) || 0})}
                                      className="w-full border rounded p-2 text-sm"
                                      disabled={editingSub.type === 'vip'}
                                  />
                              </div>
                          </div>

                          <div className="flex gap-2 mt-6">
                              <button 
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="flex-1 py-2 bg-gray-100 text-gray-600 rounded font-bold hover:bg-gray-200"
                              >
                                  Cancelar
                              </button>
                              <button 
                                  type="submit"
                                  className="flex-1 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 shadow-md"
                              >
                                  Salvar Alterações
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SubscriberManager;
