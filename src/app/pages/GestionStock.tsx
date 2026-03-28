import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Search, 
  Filter, 
  QrCode, 
  Plus, 
  Eye,
  Package,
  MapPin,
  Calendar,
  FileText,
  X
} from 'lucide-react';
import { inventoryItems } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function GestionStock() {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<typeof inventoryItems[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const canModifyStock = hasPermission(['director_tecnico', 'operario_deposito', 'admin_it']);
  const canAudit = hasPermission(['director_tecnico', 'admin_it']);
  const isReadOnly = hasPermission(['auditor']);

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lote.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vacuna': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'blister': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'insumo': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock < 200) return { color: 'text-red-600', label: 'CRÍTICO' };
    if (stock < 500) return { color: 'text-yellow-600', label: 'BAJO' };
    return { color: 'text-green-600', label: 'NORMAL' };
  };

  const handleViewDetails = (item: typeof inventoryItems[0]) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Consulta y Gestión de Stock</h1>
          <p className="text-gray-500 mt-1">Control de Inventario en Tiempo Real</p>
        </div>
        {canModifyStock && (
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="size-4 mr-2" />
            Nuevo Ingreso
          </Button>
        )}
      </div>

      {/* Barra de Herramientas */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Buscar por código, nombre o lote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="size-4 mr-2" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="vacuna">Vacunas</SelectItem>
                <SelectItem value="blister">Blisters</SelectItem>
                <SelectItem value="insumo">Insumos</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <QrCode className="size-4 mr-2" />
              Escanear Código
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Inventario */}
      <Card>
        <CardHeader>
          <CardTitle>
            Inventario ({filteredItems.length} productos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Stock Actual</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => {
                    const stockStatus = getStockStatus(item.currentStock);
                    return (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-sm">{item.code}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(item.type)}>
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`font-semibold ${stockStatus.color}`}>
                            {item.currentStock}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({stockStatus.label})
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.lote}</TableCell>
                        <TableCell className="text-sm">{item.ubicacion}</TableCell>
                        <TableCell className="text-sm">{item.vencimiento}</TableCell>
                        <TableCell className="text-center">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleViewDetails(item)}
                          >
                            <Eye className="size-4 mr-1" />
                            Ver Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Panel Lateral (Drawer) - Ficha Técnica */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedItem && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <SheetTitle className="text-2xl">{selectedItem.name}</SheetTitle>
                    <SheetDescription className="mt-1">
                      Código: {selectedItem.code}
                    </SheetDescription>
                  </div>
                  <Badge className={getTypeColor(selectedItem.type)}>
                    {selectedItem.type}
                  </Badge>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Información General */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Package className="size-5" />
                    Información General
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Stock Actual</p>
                      <p className="text-xl font-bold text-green-600">{selectedItem.currentStock}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Lote</p>
                      <p className="font-mono font-medium">{selectedItem.lote}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="size-4" />
                      Ubicación
                    </p>
                    <p className="font-medium">{selectedItem.ubicacion}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="size-4" />
                      Fecha de Vencimiento
                    </p>
                    <p className="font-medium">{selectedItem.vencimiento}</p>
                  </div>
                </div>

                {/* Ficha Técnica */}
                {selectedItem.fichaTexnica && (
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <FileText className="size-5" />
                      Ficha Técnica
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Materiales del Envase</p>
                        <ul className="space-y-1">
                          {selectedItem.fichaTexnica.materiales.map((material, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Medidas</p>
                        <p className="text-sm text-gray-600">{selectedItem.fichaTexnica.medidas}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Proporción de Compuestos</p>
                        <p className="text-sm text-gray-600">{selectedItem.fichaTexnica.proporcionCompuestos}</p>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-yellow-800 mb-1">Instrucciones de Manejo</p>
                        <p className="text-sm text-yellow-700">{selectedItem.fichaTexnica.instruccionesManejo}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones */}
                {canModifyStock && !isReadOnly && (
                  <div className="border-t pt-6 space-y-3">
                    <Button className="w-full" variant="default">
                      Registrar Salida
                    </Button>
                    <Button className="w-full" variant="outline">
                      Modificar Stock
                    </Button>
                    {canAudit && (
                      <Button className="w-full" variant="outline">
                        Ver Historial de Movimientos
                      </Button>
                    )}
                  </div>
                )}

                {isReadOnly && (
                  <div className="border-t pt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        ℹ️ Acceso de solo lectura - No puedes modificar el inventario
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
