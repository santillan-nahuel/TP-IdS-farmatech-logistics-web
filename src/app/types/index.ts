export type UserRole = 
  | 'admin_it' 
  | 'jefe_logistica' 
  | 'operario_deposito' 
  | 'auditor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

// === Monitoreo Térmico ===

export interface SensorReading {
  id: string;
  label: string;
  temperature: number;
  status: 'normal' | 'warning' | 'faulty';
}

export interface StorageUnit {
  id: string;
  name: string;
  sensors: SensorReading[];
  averageTemp: number;
  minTemp: number;
  maxTemp: number;
  status: 'normal' | 'warning' | 'critical';
  aiAlert?: string;
  sensorAlert?: string;
}

export interface TemperatureReading {
  timestamp: string;
  temperature: number;
  location: string;
}

export type GeneratorState = 'standby' | 'active' | 'testing' | 'offline';

export interface GeneratorStatus {
  state: GeneratorState;
  lastTest: string;
  fuelLevel: number; // porcentaje 0-100
  runtime: string; // horas de funcionamiento acumuladas
}

export interface StorageEvent {
  id: string;
  unitId: string;
  timestamp: string;
  type: 'temp_alert' | 'maintenance' | 'power' | 'sensor_change' | 'inspection';
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface MaintenanceRequest {
  id: string;
  unitId: string;
  unitName: string;
  requestedBy: string;
  requestedAt: string;
  type: 'preventivo' | 'correctivo' | 'emergencia';
  reason: string;
  priority: 'alta' | 'media' | 'baja';
  status: 'pendiente' | 'en_progreso' | 'resuelto';
  resolvedAt?: string;
}

export interface OutOfRangeRecord {
  unitId: string;
  totalMinutes: number;
  incidents: number;
  lastIncident: string;
}

// === Inventario ===

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

export interface OperationLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: 'ingreso' | 'egreso' | 'modificacion' | 'ajuste';
  itemCode: string;
  itemName: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
}

// === Notificaciones ===

export interface Notification {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'critical';
}

// === Tendencias ===

export interface PurchaseSuggestion {
  id: string;
  producto: string;
  cantidad: number;
  razon: string;
  prioridad: 'alta' | 'media' | 'baja';
  fechaEstimada: string;
}

// === Documentación ===

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
