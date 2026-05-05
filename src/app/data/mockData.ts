import { StorageUnit, TemperatureReading, Notification, InventoryItem, PurchaseSuggestion, Document, GeneratorStatus, StorageEvent, MaintenanceRequest, OutOfRangeRecord, OperationLog } from '../types';

// ============================================================
// MONITOREO TÉRMICO
// ============================================================

// Datos de unidades de almacenamiento con triple sensor
export const storageUnits: StorageUnit[] = [
  {
    id: '1',
    name: 'Cámara Fría A',
    sensors: [
      { id: 's1-1', label: 'Sensor 1', temperature: 4.1, status: 'normal' },
      { id: 's1-2', label: 'Sensor 2', temperature: 3.9, status: 'normal' },
      { id: 's1-3', label: 'Sensor 3', temperature: 4.0, status: 'normal' },
    ],
    averageTemp: 4.0,
    minTemp: 2,
    maxTemp: 8,
    status: 'normal'
  },
  {
    id: '2',
    name: 'Heladera Vacunas B',
    sensors: [
      { id: 's2-1', label: 'Sensor 1', temperature: 7.4, status: 'warning' },
      { id: 's2-2', label: 'Sensor 2', temperature: 7.6, status: 'warning' },
      { id: 's2-3', label: 'Sensor 3', temperature: 7.5, status: 'warning' },
    ],
    averageTemp: 7.5,
    minTemp: 2,
    maxTemp: 8,
    status: 'warning',
    aiAlert: 'Tendencia al alza detectada - Revisar motor'
  },
  {
    id: '3',
    name: 'Freezer Criogénico C',
    sensors: [
      { id: 's3-1', label: 'Sensor 1', temperature: -18.4, status: 'normal' },
      { id: 's3-2', label: 'Sensor 2', temperature: -18.6, status: 'normal' },
      { id: 's3-3', label: 'Sensor 3', temperature: -18.5, status: 'normal' },
    ],
    averageTemp: -18.5,
    minTemp: -20,
    maxTemp: -15,
    status: 'normal'
  },
  {
    id: '4',
    name: 'Heladera Insulinas D',
    sensors: [
      { id: 's4-1', label: 'Sensor 1', temperature: 9.1, status: 'normal' },
      { id: 's4-2', label: 'Sensor 2', temperature: 9.3, status: 'normal' },
      { id: 's4-3', label: 'Sensor 3', temperature: 15.2, status: 'faulty' },
    ],
    averageTemp: 9.2,
    minTemp: 2,
    maxTemp: 8,
    status: 'critical',
    aiAlert: 'CRÍTICO - Temperatura fuera de rango',
    sensorAlert: 'Sensor 3 posiblemente defectuoso (diverge 6°C del promedio)'
  }
];

// Estado del generador de reserva
export const generatorStatus: GeneratorStatus = {
  state: 'standby',
  lastTest: '2026-04-28 08:00',
  fuelLevel: 85,
  runtime: '1,240 hs',
};

// Datos históricos de temperatura (últimas 24 horas)
export const temperatureHistory: TemperatureReading[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: `${String(23 - i).padStart(2, '0')}:00`,
  temperature: 4 + Math.random() * 3 + (i > 18 ? Math.random() * 2 : 0),
  location: 'Heladera Vacunas B'
})).reverse();

// Historial de temperatura por heladera (para vista detalle)
export const temperatureHistoryByUnit: Record<string, { timestamp: string; temp: number; inRange: boolean }[]> = {
  '1': Array.from({ length: 48 }, (_, i) => {
    const temp = 4 + (Math.random() - 0.5) * 2;
    return { timestamp: `${48 - i}h`, temp: parseFloat(temp.toFixed(1)), inRange: temp >= 2 && temp <= 8 };
  }).reverse(),
  '2': Array.from({ length: 48 }, (_, i) => {
    const base = i > 30 ? 6.5 : 5;
    const temp = base + (Math.random() - 0.3) * 3;
    return { timestamp: `${48 - i}h`, temp: parseFloat(temp.toFixed(1)), inRange: temp >= 2 && temp <= 8 };
  }).reverse(),
  '3': Array.from({ length: 48 }, (_, i) => {
    const temp = -18 + (Math.random() - 0.5) * 2;
    return { timestamp: `${48 - i}h`, temp: parseFloat(temp.toFixed(1)), inRange: temp >= -20 && temp <= -15 };
  }).reverse(),
  '4': Array.from({ length: 48 }, (_, i) => {
    const base = i > 36 ? 8.5 : 5;
    const temp = base + Math.random() * 2;
    return { timestamp: `${48 - i}h`, temp: parseFloat(temp.toFixed(1)), inRange: temp >= 2 && temp <= 8 };
  }).reverse(),
};

// Tiempo fuera de rango por unidad
export const outOfRangeRecords: OutOfRangeRecord[] = [
  { unitId: '1', totalMinutes: 0, incidents: 0, lastIncident: 'N/A' },
  { unitId: '2', totalMinutes: 45, incidents: 2, lastIncident: '2026-05-04 14:30' },
  { unitId: '3', totalMinutes: 0, incidents: 0, lastIncident: 'N/A' },
  { unitId: '4', totalMinutes: 135, incidents: 5, lastIncident: '2026-05-04 16:45' },
];

// Eventos de trazabilidad por heladera
export const storageEvents: StorageEvent[] = [
  { id: 'e1', unitId: '4', timestamp: '2026-05-04 16:45', type: 'temp_alert', description: 'Temperatura superó 9°C - Fuera de rango', severity: 'critical' },
  { id: 'e2', unitId: '4', timestamp: '2026-05-04 15:30', type: 'sensor_change', description: 'Sensor 3 presenta lecturas inconsistentes', severity: 'warning' },
  { id: 'e3', unitId: '2', timestamp: '2026-05-04 14:30', type: 'temp_alert', description: 'Temperatura alcanzó 7.8°C - Próxima al límite', severity: 'warning' },
  { id: 'e4', unitId: '2', timestamp: '2026-05-04 10:00', type: 'maintenance', description: 'Mantenimiento preventivo programado completado', severity: 'info' },
  { id: 'e5', unitId: '1', timestamp: '2026-05-04 08:00', type: 'inspection', description: 'Inspección diaria realizada - Sin novedades', severity: 'info' },
  { id: 'e6', unitId: '3', timestamp: '2026-05-04 08:00', type: 'inspection', description: 'Inspección diaria realizada - Sin novedades', severity: 'info' },
  { id: 'e7', unitId: '4', timestamp: '2026-05-03 22:00', type: 'power', description: 'Micro-corte eléctrico detectado - Generador no activado (< 30s)', severity: 'warning' },
  { id: 'e8', unitId: '2', timestamp: '2026-05-03 09:15', type: 'maintenance', description: 'Revisión de motor del compresor solicitada', severity: 'info' },
  { id: 'e9', unitId: '1', timestamp: '2026-05-02 14:00', type: 'inspection', description: 'Calibración de sensores verificada', severity: 'info' },
  { id: 'e10', unitId: '4', timestamp: '2026-05-02 11:00', type: 'temp_alert', description: 'Temperatura alcanzó 8.5°C brevemente', severity: 'warning' },
];

// Solicitudes de mantenimiento
export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'm1',
    unitId: '4',
    unitName: 'Heladera Insulinas D',
    requestedBy: 'Sistema (IA)',
    requestedAt: '2026-05-04 16:50',
    type: 'emergencia',
    reason: 'Temperatura fuera de rango sostenida + Sensor 3 posiblemente defectuoso',
    priority: 'alta',
    status: 'pendiente',
  },
  {
    id: 'm2',
    unitId: '2',
    unitName: 'Heladera Vacunas B',
    requestedBy: 'Martín López',
    requestedAt: '2026-05-03 09:15',
    type: 'preventivo',
    reason: 'Ruido inusual en motor del compresor',
    priority: 'media',
    status: 'en_progreso',
  },
  {
    id: 'm3',
    unitId: '3',
    unitName: 'Freezer Criogénico C',
    requestedBy: 'Laura Vega',
    requestedAt: '2026-04-25 10:00',
    type: 'preventivo',
    reason: 'Mantenimiento trimestral programado',
    priority: 'baja',
    status: 'resuelto',
    resolvedAt: '2026-04-26 14:30',
  },
];

// Notificaciones
export const notifications: Notification[] = [
  {
    id: '1',
    timestamp: '10:45',
    message: 'Alerta: Anomalía detectada en motor de Heladera C',
    type: 'critical'
  },
  {
    id: '2',
    timestamp: '09:30',
    message: 'Ingreso de nuevo lote L-2024-0892 registrado',
    type: 'info'
  },
  {
    id: '3',
    timestamp: '08:15',
    message: 'Stock crítico: Paracetamol 500mg - Solo quedan 120 unidades',
    type: 'warning'
  },
  {
    id: '4',
    timestamp: '07:00',
    message: 'Sistema de backup completado exitosamente',
    type: 'info'
  }
];

// ============================================================
// INVENTARIO
// ============================================================

export const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    code: 'VAC-001',
    name: 'Vacuna COVID-19 Pfizer',
    type: 'vacuna',
    currentStock: 450,
    lote: 'L-2024-0892',
    ubicacion: 'Heladera Vacunas B - Pasillo 1',
    vencimiento: '2026-08-15',
    fichaTexnica: {
      materiales: ['Vial de vidrio tipo I', 'Tapón de goma butílica', 'Sello de aluminio'],
      medidas: '2ml por vial',
      proporcionCompuestos: 'ARNm 30μg, Lípidos, Sales buffer',
      instruccionesManejo: 'Mantener entre 2-8°C. No congelar después de descongelar.'
    }
  },
  {
    id: '2',
    code: 'INS-042',
    name: 'Paracetamol 500mg',
    type: 'blister',
    currentStock: 120,
    lote: 'L-2024-0756',
    ubicacion: 'Depósito General - Estante 3A',
    vencimiento: '2026-04-20',
    fichaTexnica: {
      materiales: ['PVC/PVDC', 'Aluminio'],
      medidas: '10 comprimidos por blister',
      proporcionCompuestos: 'Paracetamol 500mg, Excipientes c.s.p.',
      instruccionesManejo: 'Almacenar a temperatura ambiente (15-25°C). Proteger de la humedad.'
    }
  },
  {
    id: '3',
    code: 'INS-089',
    name: 'Guantes de Nitrilo Talla M',
    type: 'insumo',
    currentStock: 2500,
    lote: 'L-2024-1023',
    ubicacion: 'Depósito General - Pasillo 2',
    vencimiento: '2027-12-31',
    fichaTexnica: {
      materiales: ['Nitrilo 100%'],
      medidas: 'Talla M - 240mm largo',
      proporcionCompuestos: 'Sin látex, sin polvo',
      instruccionesManejo: 'Mantener en lugar seco y fresco. Evitar exposición solar directa.'
    }
  },
  {
    id: '4',
    code: 'VAC-015',
    name: 'Vacuna Triple Viral',
    type: 'vacuna',
    currentStock: 280,
    lote: 'L-2024-0634',
    ubicacion: 'Cámara Fría A - Sector 2',
    vencimiento: '2026-03-10',
    fichaTexnica: {
      materiales: ['Vial de vidrio', 'Tapón estéril'],
      medidas: '0.5ml por dosis',
      proporcionCompuestos: 'Virus atenuados sarampión, rubéola, parotiditis',
      instruccionesManejo: 'Conservar entre 2-8°C. Proteger de la luz.'
    }
  },
  {
    id: '5',
    code: 'INS-103',
    name: 'Jeringa descartable 5ml',
    type: 'insumo',
    currentStock: 850,
    lote: 'L-2024-0891',
    ubicacion: 'Depósito General - Estante 5B',
    vencimiento: '2028-01-15',
    fichaTexnica: {
      materiales: ['Polipropileno', 'Goma sintética'],
      medidas: '5ml - Graduación 0.2ml',
      proporcionCompuestos: 'Material médico grado USP',
      instruccionesManejo: 'Mantener en envase original. No esterilizar.'
    }
  }
];

// Log de operaciones de stock
export const operationLogs: OperationLog[] = [
  {
    id: 'op1',
    timestamp: '2026-05-04 16:30',
    user: 'Martín López',
    role: 'operario_deposito',
    action: 'egreso',
    itemCode: 'VAC-001',
    itemName: 'Vacuna COVID-19 Pfizer',
    quantity: -50,
    previousStock: 500,
    newStock: 450,
    reason: 'Despacho a Centro de Salud Norte'
  },
  {
    id: 'op2',
    timestamp: '2026-05-04 14:15',
    user: 'Martín López',
    role: 'operario_deposito',
    action: 'ingreso',
    itemCode: 'INS-089',
    itemName: 'Guantes de Nitrilo Talla M',
    quantity: 500,
    previousStock: 2000,
    newStock: 2500,
    reason: 'Recepción de pedido #P-2024-089'
  },
  {
    id: 'op3',
    timestamp: '2026-05-04 10:00',
    user: 'Laura Vega',
    role: 'jefe_logistica',
    action: 'ajuste',
    itemCode: 'INS-042',
    itemName: 'Paracetamol 500mg',
    quantity: -30,
    previousStock: 150,
    newStock: 120,
    reason: 'Ajuste por vencimiento - Lote L-2024-0756 parcialmente vencido'
  },
  {
    id: 'op4',
    timestamp: '2026-05-03 09:45',
    user: 'Carlos Méndez',
    role: 'admin_it',
    action: 'modificacion',
    itemCode: 'VAC-015',
    itemName: 'Vacuna Triple Viral',
    quantity: 0,
    previousStock: 280,
    newStock: 280,
    reason: 'Corrección de ubicación en sistema (migración de datos)'
  },
  {
    id: 'op5',
    timestamp: '2026-05-02 15:20',
    user: 'Martín López',
    role: 'operario_deposito',
    action: 'ingreso',
    itemCode: 'INS-103',
    itemName: 'Jeringa descartable 5ml',
    quantity: 200,
    previousStock: 650,
    newStock: 850,
    reason: 'Recepción de pedido #P-2024-103'
  }
];

// ============================================================
// TENDENCIAS E IA
// ============================================================

export const purchaseSuggestions: PurchaseSuggestion[] = [
  {
    id: '1',
    producto: 'Paracetamol 500mg',
    cantidad: 500,
    razon: 'Pico de demanda proyectado en 15 días (temporada de gripe)',
    prioridad: 'alta',
    fechaEstimada: '2026-04-12'
  },
  {
    id: '2',
    producto: 'Guantes de Nitrilo Talla L',
    cantidad: 1000,
    razon: 'Tendencia de consumo indica agotamiento en 45 días',
    prioridad: 'media',
    fechaEstimada: '2026-05-10'
  },
  {
    id: '3',
    producto: 'Vacuna Antigripal 2027',
    cantidad: 800,
    razon: 'Preparación campaña de vacunación invernal',
    prioridad: 'alta',
    fechaEstimada: '2026-05-01'
  },
  {
    id: '4',
    producto: 'Alcohol en gel 500ml',
    cantidad: 250,
    razon: 'Reposición de stock de seguridad',
    prioridad: 'baja',
    fechaEstimada: '2026-06-15'
  }
];

// Datos para el heatmap de vencimientos
export const expirationHeatmap = [
  { producto: 'Vacuna Triple Viral', diasParaVencer: 15, stock: 280, lote: 'L-2024-0634' },
  { producto: 'Ibuprofeno 400mg', diasParaVencer: 30, stock: 450, lote: 'L-2023-1205' },
  { producto: 'Paracetamol 500mg', diasParaVencer: 60, stock: 120, lote: 'L-2024-0756' },
  { producto: 'Amoxicilina 500mg', diasParaVencer: 90, stock: 320, lote: 'L-2024-0512' },
  { producto: 'Alcohol 70%', diasParaVencer: 180, stock: 680, lote: 'L-2024-0823' },
  { producto: 'Gasas estériles', diasParaVencer: 240, stock: 1200, lote: 'L-2024-0934' },
];

// Proyección de consumo para los próximos 3 meses
export const consumptionProjection = [
  { mes: 'Abril', paracetamol: 450, ibuprofeno: 320, antibioticos: 280, insumos: 890 },
  { mes: 'Mayo', paracetamol: 520, ibuprofeno: 380, antibioticos: 310, insumos: 950 },
  { mes: 'Junio', paracetamol: 680, ibuprofeno: 450, antibioticos: 340, insumos: 1020 },
];

// ============================================================
// DOCUMENTACIÓN
// ============================================================

export const documents: Document[] = [
  {
    id: '1',
    name: 'Remito_Drogueria_Central_20240315.pdf',
    uploadedBy: 'Juan Pérez',
    uploadedAt: '2024-03-15 14:30',
    status: 'aprobado',
    extractedData: {
      nroLote: 'L-2024-0892',
      fechaElaboracion: '2024-02-10',
      vencimiento: '2026-08-15',
      proveedor: 'Droguería Central S.A.'
    }
  },
  {
    id: '2',
    name: 'Certificado_Lab_Paracetamol.pdf',
    uploadedBy: 'María González',
    uploadedAt: '2024-03-20 09:15',
    status: 'pendiente',
    extractedData: {
      nroLote: 'L-2024-0756',
      fechaElaboracion: '2024-01-20',
      vencimiento: '2026-04-20',
      proveedor: 'Laboratorios Roemmers'
    }
  },
  {
    id: '3',
    name: 'Remito_Guantes_Nitrilo.pdf',
    uploadedBy: 'Carlos Ramírez',
    uploadedAt: '2024-03-25 16:45',
    status: 'aprobado',
    extractedData: {
      nroLote: 'L-2024-1023',
      fechaElaboracion: '2024-03-01',
      vencimiento: '2027-12-31',
      proveedor: 'MedSupply Inc.'
    }
  }
];