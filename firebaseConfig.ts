import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, getDocs, where } from "firebase/firestore";

// -----------------------------------------------------------
// CONFIGURAÇÃO DO FIREBASE
// Substitua os valores abaixo pelas chaves do seu projeto no console.firebase.google.com
// -----------------------------------------------------------

const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI", // Ex: AIzaSyD...
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "00000000000",
  appId: "1:00000000000:web:00000000000000"
};

// Verifica se está configurado
const isConfigured = firebaseConfig.apiKey !== "SUA_API_KEY_AQUI";

// Inicializa Firebase apenas se configurado para evitar erros no console
const app = isConfigured ? initializeApp(firebaseConfig) : null;
const db = isConfigured && app ? getFirestore(app) : null;

// --- FUNÇÕES DE PEDIDOS (ORDERS) ---

// Salvar novo pedido (Cliente)
export const saveOrderToCloud = async (orderData: any) => {
    if (!db) return false;
    try {
        const docRef = await addDoc(collection(db, "orders"), {
            ...orderData,
            createdAt: new Date().toISOString() // Garante timestamp do servidor/cliente
        });
        console.log("Pedido salvo na nuvem: ", docRef.id);
        return true;
    } catch (e) {
        console.error("Erro ao salvar pedido: ", e);
        return false;
    }
};

// Ouvir pedidos em tempo real (Painel Admin)
export const subscribeToOrders = (callback: (orders: any[]) => void) => {
    if (!db) return () => {};
    
    // Ordena por data de criação (mais recente primeiro)
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(orders);
    }, (error) => {
        console.error("Erro ao ouvir pedidos:", error);
    });

    return unsubscribe;
};

// Atualizar status do pedido (Painel Admin)
export const updateOrderStatusInCloud = async (orderId: string, newStatus: string) => {
    if (!db) return;
    try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: newStatus });
    } catch (e) {
        console.error("Erro ao atualizar status:", e);
    }
};

// Deletar pedido (Painel Admin)
export const deleteOrderInCloud = async (orderId: string) => {
    if (!db) return;
    try {
        const orderRef = doc(db, "orders", orderId);
        await deleteDoc(orderRef);
    } catch (e) {
        console.error("Erro ao deletar pedido:", e);
    }
};

// --- FUNÇÕES DE ASSINANTES (SUBSCRIBERS) ---

// Salvar novo assinante (Cadastro Grátis/Pago)
export const saveSubscriberToCloud = async (subscriberData: any) => {
    if (!db) return false;
    try {
        // Verifica se chave já existe (opcional, básico)
        const q = query(collection(db, "subscribers"), where("accessKey", "==", subscriberData.accessKey));
        const existing = await getDocs(q);
        if (!existing.empty) {
            console.warn("Chave já existe");
            return false;
        }

        await addDoc(collection(db, "subscribers"), subscriberData);
        return true;
    } catch (e) {
        console.error("Erro ao salvar assinante: ", e);
        return false;
    }
};

// Ouvir assinantes em tempo real (Painel Admin)
export const subscribeToSubscribers = (callback: (subs: any[]) => void) => {
    if (!db) return () => {};
    
    const q = query(collection(db, "subscribers"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(subs);
    }, (error) => {
        console.error("Erro ao ouvir assinantes:", error);
    });

    return unsubscribe;
};

// Atualizar assinante (Painel Admin - Editar/Bloquear)
export const updateSubscriberInCloud = async (subId: string, data: any) => {
    if (!db) return;
    try {
        const subRef = doc(db, "subscribers", subId);
        await updateDoc(subRef, data);
    } catch (e) {
        console.error("Erro ao atualizar assinante:", e);
    }
};

// Deletar assinante
export const deleteSubscriberInCloud = async (subId: string) => {
    if (!db) return;
    try {
        const subRef = doc(db, "subscribers", subId);
        await deleteDoc(subRef);
    } catch (e) {
        console.error("Erro ao deletar assinante:", e);
    }
};

export { db, isConfigured };
