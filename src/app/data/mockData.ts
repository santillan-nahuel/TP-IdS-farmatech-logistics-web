import { StorageUnit, TemperatureReading, Notification, InventoryItem, PurchaseSuggestion, Document } from '../types';

// Datos de unidades de almacenamiento
export const storageUnits: StorageUnit[] = [
  {
    id: '1',
    name: 'Cámara Fría A',
    currentTemp: 4.0,
    minTemp: 2,
    maxTemp: 8,
    status: 'normal'
  },
  {
    id: '2',
    name: 'Heladera Vacunas B',
    currentTemp: 7.5,
    minTemp: 2,
    maxTemp: 8,
    status: 'warning',
    aiAlert: 'Tendencia al alza detectada - Revisar motor'
  },
  {
    id: '3',
    name: 'Freezer Criogénico C',
    currentTemp: -18.5,
    minTemp: -20,
    maxTemp: -15,
    status: 'normal'
  },
  {
    id: '4',
    name: 'Heladera Insulinas D',
    currentTemp: 9.2,
    minTemp: 2,
    maxTemp: 8,
    status: 'critical',
    aiAlert: 'CRÍTICO - Temperatura fuera de rango'
  }
];

// Datos históricos de temperatura (últimas 24 horas)
export const temperatureHistory: TemperatureReading[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: `${String(23 - i).padStart(2, '0')}:00`,
  temperature: 4 + Math.random() * 3 + (i > 18 ? Math.random() * 2 : 0),
  location: 'Heladera Vacunas B'
})).reverse();

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

// Inventario
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

// Sugerencias de compra IA
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

// Documentos
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