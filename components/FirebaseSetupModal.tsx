import React from 'react';

interface FirebaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FirebaseSetupModal: React.FC<FirebaseSetupModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="font-bold text-xl flex items-center gap-2">
              🔥 Ativar Pedidos em Tempo Real
            </h2>
            <p className="text-orange-100 text-sm mt-1">Sincronize Clientes e Painel via Banco de Dados.</p>
          </div>
          <button onClick={onClose} className="hover:text-orange-200 bg-white/10 p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50">
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-4 items-center">
             <div className="text-3xl">🚀</div>
             <div>
                 <h4 className="font-bold text-blue-800 text-sm">Como funciona?</h4>
                 <p className="text-xs text-blue-700 leading-relaxed">
                    Atualmente, os pedidos ficam salvos apenas neste dispositivo. Ao configurar o Firebase (gratuito), quando um cliente fizer um pedido ou cadastro (seja pelo <strong>Celular</strong> ou <strong>Computador</strong>), aparecerá <strong>instantaneamente</strong> aqui no seu painel.
                 </p>
             </div>
          </div>

          <div className="space-y-6">
            
            {/* PASSO 1 */}
            <div className="relative pl-8 border-l-2 border-slate-200 pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-400 border-2 border-slate-50"></div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">1. Criar Projeto no Firebase</h3>
                <p className="text-xs text-slate-600 mb-2">
                    Acesse <a href="https://console.firebase.google.com/" target="_blank" className="text-blue-600 underline font-bold hover:text-blue-800">console.firebase.google.com</a> e clique em "Adicionar projeto". Dê um nome (ex: <em>Placas-Store</em>).
                </p>
            </div>

            {/* PASSO 2 */}
            <div className="relative pl-8 border-l-2 border-slate-200 pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm"></div>
                <h3 className="font-bold text-orange-700 text-sm mb-1">2. Criar Banco de Dados (Firestore) - IMPORTANTE</h3>
                <p className="text-xs text-slate-600 mb-2">
                    No menu lateral, vá em <strong>Criação &gt; Firestore Database</strong> e clique em "Criar banco de dados".
                </p>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 ml-2 bg-white p-3 rounded border border-slate-100">
                    <li>Local: Escolha <strong>nam5 (us-central)</strong> ou <strong>sao-paulo</strong>.</li>
                    <li><strong>Regras de Segurança:</strong> Selecione <strong>Modo de Teste</strong> (Test Mode).</li>
                    <li className="text-orange-600 font-bold mt-1">
                        Se pedir para definir regras manualmente, use:<br/>
                        <code className="bg-slate-100 px-1 rounded text-slate-800 font-mono text-[10px]">allow read, write: if true;</code>
                    </li>
                </ul>
                <p className="text-[10px] text-slate-400 mt-1 italic">
                    Isso permite que qualquer cliente salve pedidos (mesmo sem login Google).
                </p>
            </div>

            {/* PASSO 3 */}
            <div className="relative pl-8 border-l-2 border-slate-200 pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-400 border-2 border-slate-50"></div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">3. Pegar as Chaves (Config)</h3>
                <p className="text-xs text-slate-600 mb-2">
                    Vá nas configurações do projeto (⚙️) &gt; Configurações do projeto. Role até o fim e clique no ícone <strong>&lt;/&gt;</strong> (Web).
                </p>
                <p className="text-xs text-slate-600">
                    Registre o app (dê um apelido) e copie o trecho de código que contém <code>apiKey</code>, <code>authDomain</code>, etc.
                </p>
            </div>

            {/* PASSO 4 */}
            <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                <h3 className="font-bold text-green-700 text-sm mb-1">4. Onde colar o código?</h3>
                <ol className="list-decimal list-inside text-xs text-slate-600 mb-3 space-y-2">
                    <li>
                        No menu de arquivos à esquerda (file tree), clique no arquivo chamado <code className="font-bold text-blue-600 bg-blue-50 px-1 rounded">firebaseConfig.ts</code>.
                    </li>
                    <li>
                        Localize o trecho que começa com <code>const firebaseConfig = &#123;</code> e termina com <code>&#125;;</code>.
                    </li>
                    <li>
                        <strong>Substitua</strong> os valores genéricos (como "SUA_API_KEY_AQUI") pelos valores reais que você copiou do site do Firebase.
                    </li>
                </ol>
                
                <div className="bg-slate-900 text-gray-300 p-3 rounded font-mono text-[10px] overflow-x-auto border border-slate-800 relative">
                    <div className="absolute top-2 right-2 text-[9px] text-gray-500 font-sans uppercase tracking-widest">Exemplo</div>
                    <span className="text-green-400">// No arquivo firebaseConfig.ts:</span><br/><br/>
                    const firebaseConfig = &#123;<br/>
                    &nbsp;&nbsp;<span className="text-yellow-300">apiKey: "AIzaSy...",</span> <span className="text-gray-500">// &lt;-- Cole a chave real aqui</span><br/>
                    &nbsp;&nbsp;<span className="text-yellow-300">authDomain: "...",</span><br/>
                    &nbsp;&nbsp;<span className="text-yellow-300">projectId: "...",</span><br/>
                    &nbsp;&nbsp;...<br/>
                    &#125;;
                </div>
                <p className="text-[10px] text-green-700 mt-2 font-bold bg-green-50 p-2 rounded border border-green-200">
                    ✅ Assim que você salvar o arquivo com as chaves corretas, o site recarregará e os pedidos passarão a ser salvos na nuvem automaticamente.
                </p>
            </div>

          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 text-right shrink-0 flex justify-between items-center">
           <span className="text-xs text-gray-400 hidden sm:inline">As tabelas 'orders' e 'subscribers' serão criadas automaticamente.</span>
           <button onClick={onClose} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded font-bold text-xs transition-colors shadow-lg">
               Entendi, vou configurar
           </button>
        </div>
      </div>
    </div>
  );
};

export default FirebaseSetupModal;