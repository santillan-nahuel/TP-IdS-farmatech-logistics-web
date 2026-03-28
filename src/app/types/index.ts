export type UserRole = 
  | 'admin_it' 
  | 'director_tecnico' 
  | 'operario_deposito' 
  | 'auditor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface TemperatureReading {
  timestamp: string;
  temperature: number;
  location: string;
}

export interface StorageUnit {
  id: string;
  name: string;
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
  status: 'normal' | 'warning' | 'critical';
  aiAlert?: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  type: 'insumo' | 'vacuna' | 'blister';
  currentStock: number;
  lote: string;
  ubicacion: string;
  vencimiento: string;
  fichaTexnica?: {
    materiales: string[];
    medidas: string;
    proporcionCompuestos: string;
    instruccionesManejo: string;
  };
}

export interface Notification {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'critical';
}

export interface PurchaseSuggestion {
  id: string;
  producto: string;
  cantidad: number;
  razon: string;
  prioridad: 'alta' | 'media' | 'baja';
  fechaEstimada: string;
}

export interface Document {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'pendiente' | 'aprobado' | 'rechazado';
  extractedData?: {
    nroLote: string;
    fechaElaboracion: string;
    vencimiento: string;
    proveedor: string;
  };
}
