import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  Search,
  Calendar,
  Building,
  Package as PackageIcon,
  Sparkles
} from 'lucide-react';
import { documents } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

export function Documentacion() {
  const { hasPermission, user } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(documents[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const canUpload = hasPermission(['operario_deposito', 'admin_it', 'director_tecnico']);
  const canApprove = hasPermission(['director_tecnico', 'admin_it']);
  const isAuditor = hasPermission(['auditor']);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Aquí iría la lógica de procesamiento del archivo
    alert('Archivo cargado - La IA comenzaría a procesar el documento');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprobado':
        return <CheckCircle className="size-5 text-green-600" />;
      case 'pendiente':
        return <Clock className="size-5 text-yellow-600" />;
      case 'rechazado':
        return <XCircle className="size-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprobado':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rechazado':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Centro de Documentación y Auditoría</h1>
        <p className="text-gray-500 mt-1">OCR e IA para Compliance Automático</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Izquierdo - Carga de Documentos */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="size-5" />
              Cargar Nuevo Documento
            </CardTitle>
            <p className="text-sm text-gray-500">Arrastra y suelta o haz clic para subir</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {canUpload ? (
              <>
                {/* Área de Drag & Drop */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`
                    border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
                    ${dragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }
                  `}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.pdf,.jpg,.jpeg,.png';
                    input.onchange = () => alert('Archivo cargado - La IA comenzaría a procesar el documento');
                    input.click();
                  }}
                >
                  <Upload className="size-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">
                    {dragActive ? 'Suelta el archivo aquí' : 'Arrastra tu documento aquí'}
                  </p>
                  <p className="text-sm text-gray-500">
                    o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Formatos admitidos: PDF, JPG, PNG
                  </p>
                </div>

                {/* Vista Previa del Documento */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="size-12 bg-red-600 rounded flex items-center justify-center">
                      <FileText className="size-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{selectedDocument.name}</p>
                      <p className="text-xs text-gray-500">
                        Subido por {selectedDocument.uploadedBy} - {selectedDocument.uploadedAt}
                      </p>
                    </div>
                    {getStatusIcon(selectedDocument.status)}
                  </div>
                  
                  <div className="bg-white rounded border p-8 text-center text-gray-400">
                    <FileText className="size-16 mx-auto mb-2" />
                    <p className="text-sm">Vista previa del documento PDF</p>
                  </div>
                </div>

                {isAuditor && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      ℹ️ Como auditor, tienes acceso de búsqueda especializada para rastrear trazabilidad
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="size-12 mx-auto mb-4 text-gray-400 opacity-50" />
                <p className="text-gray-500">No tienes permisos para subir documentos</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Panel Derecho - Extracción de Datos IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-purple-600" />
              Datos Extraídos por IA
            </CardTitle>
            <p className="text-sm text-gray-500">Validación automática del documento</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDocument.extractedData ? (
              <>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                      <PackageIcon className="size-3" />
                      Número de Lote
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        value={selectedDocument.extractedData.nroLote} 
                        readOnly 
                        className="font-mono"
                      />
                      <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="size-3" />
                      Fecha de Elaboración
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        value={selectedDocument.extractedData.fechaElaboracion} 
                        readOnly 
                      />
                      <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="size-3" />
                      Fecha de Vencimiento
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        value={selectedDocument.extractedData.vencimiento} 
                        readOnly 
                      />
                      <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                      <Building className="size-3" />
                      Proveedor
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        value={selectedDocument.extractedData.proveedor} 
                        readOnly 
                      />
                      <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                  <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Validación Exitosa</p>
                    <p className="text-xs text-green-700 mt-1">
                      Todos los campos han sido extraídos y validados correctamente por la IA
                    </p>
                  </div>
                </div>

                {canApprove && selectedDocument.status === 'pendiente' && (
                  <div className="pt-4 space-y-2">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <CheckCircle className="size-4 mr-2" />
                      Aprobar y Cargar en Base de Datos
                    </Button>
                    <Button className="w-full" variant="outline">
                      Solicitar Corrección
                    </Button>
                  </div>
                )}

                {selectedDocument.status === 'aprobado' && (
                  <div className="pt-4">
                    <Badge className="w-full justify-center py-2 bg-green-100 text-green-700 border-green-200">
                      ✓ Documento Aprobado y Cargado
                    </Badge>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Sparkles className="size-12 mx-auto mb-2" />
                <p className="text-sm">Esperando documento para procesar</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Historial de Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Documentos</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow 
                      key={doc.id}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedDocument.id === doc.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <FileText className="size-4 text-gray-400 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {doc.uploadedBy} - {doc.uploadedAt}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost">
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicador de Permisos */}
      <Card className={
        canApprove 
          ? 'bg-green-50 border-green-200' 
          : canUpload 
          ? 'bg-blue-50 border-blue-200'
          : 'bg-purple-50 border-purple-200'
      }>
        <CardContent className="pt-6">
          <p className="text-sm">
            {canApprove && (
              <span className="text-green-700">
                ✓ <strong>Director Técnico</strong> - Puedes revisar extracciones de IA y aprobar documentos
              </span>
            )}
            {canUpload && !canApprove && (
              <span className="text-blue-700">
                ✓ <strong>Operario de Depósito</strong> - Puedes escanear y subir documentos (pasan a estado "Pendiente")
              </span>
            )}
            {isAuditor && (
              <span className="text-purple-700">
                ℹ️ <strong>Auditor</strong> - Tienes búsqueda especial para rastrear trazabilidad de cualquier lote
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
