
export enum SignCategory {
  Custom = 'Placas Editável', 
  Warning = 'Aviso',
  Attention = 'Atenção',
  Danger = 'Perigo',
  Mandatory = 'Obrigatório',
  Prohibition = 'Proibição',
  Emergency = 'Emergência',
  Traffic = 'Trânsito',
  Security = 'SEGURANÇA', 
  Fire = 'Combate a Incêndio',
  Info = 'Informativas'
}

export interface Sign {
  id: number;
  code?: string; // Novo campo para código de referência
  title: string;
  description: string;
  category: string; 
  imageUrl: string;
  isHidden?: boolean; 
}

export type MaterialType = 'Vinil Adesivo' | 'PVC 2mm' | 'PVC 3mm' | 'ACM 3mm';
export type SizeType = '24x34cm' | '30x44cm' | '40x60cm' | '60x80cm';

export interface CartItem {
  id: string; 
  sign: Sign;
  size: SizeType;
  quantity: number;
  customText?: string; 
  customImage?: string; 
  material: MaterialType;
  unitPrice: number;
}

export interface Subscriber {
  id: string;
  name: string;
  accessKey: string;
  isActive: boolean;
  createdAt: string;
  type: 'vip' | 'trial'; 
  credits: number; 
  validUntil?: string; 
  reseller?: string; 
  commission?: number;
  planType?: 'annual' | 'monthly';
}

export type OrderStatus = 'Pendente' | 'Pago' | 'Em Produção' | 'Enviado' | 'Concluído' | 'Cancelado';

export interface Order {
  id: string;
  shortId: string; 
  createdAt: string;
  customerName: string;
  customerPhone?: string; 
  customerDoc?: string;
  customerAddress?: string;
  paymentMethod: string;
  items: CartItem[];
  status: OrderStatus;
  reseller?: string; 
  total: number;
  commission?: number;
  observations?: string;
}
