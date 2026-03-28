import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, ShoppingCart, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { purchaseSuggestions, consumptionProjection, expirationHeatmap } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export function TendenciasInventario() {
  const { hasPermission } = useAuth();

  const canApproveOrders = hasPermission(['director_tecnico']);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-700 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getExpirationColor = (dias: number) => {
    if (dias <= 30) return 'bg-red-500';
    if (dias <= 60) return 'bg-orange-500';
    if (dias <= 90) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="size-8 text-purple-600" />
            Panel de Tendencias e Inventario Inteligente
          </h1>
          <p className="text-gray-500 mt-1">IA Predictiva y Análisis de Datos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proyección de Consumo */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-blue-600" />
              Proyección de Consumo - Próximos 3 Meses
            </CardTitle>
            <p className="text-sm text-gray-500">Predicción basada en análisis de patrones históricos</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={consumptionProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="paracetamol" fill="#3b82f6" name="Paracetamol" />
                <Bar dataKey="ibuprofeno" fill="#8b5cf6" name="Ibuprofeno" />
                <Bar dataKey="antibioticos" fill="#10b981" name="Antibióticos" />
                <Bar dataKey="insumos" fill="#f59e0b" name="Insumos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sugerencias de Compra IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5 text-green-600" />
              Sugerencias de Compra Inteligente
            </CardTitle>
            <p className="text-sm text-gray-500">Generadas por IA predictiva</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {purchaseSuggestions.map((suggestion) => (
                <div 
                  key={suggestion.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{suggestion.producto}</h3>
                        <Badge className={getPriorityColor(suggestion.prioridad)}>
                          {suggestion.prioridad.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Cantidad sugerida:</strong> {suggestion.cantidad} unidades
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Razón:</strong> {suggestion.razon}
                      </p>
                      <p className="text-xs text-gray-500">
                        Fecha estimada de compra: {suggestion.fechaEstimada}
                      </p>
                    </div>
                  </div>
                  {canApproveOrders && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="size-4 mr-1" />
                        Aprobar Orden
                      </Button>
                      <Button size="sm" variant="outline">
                        Modificar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mapa de Calor - Vencimientos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-orange-600" />
              Mapa de Calor - Próximos Vencimientos
            </CardTitle>
            <p className="text-sm text-gray-500">Lotes próximos a vencer</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expirationHeatmap.map((item, index) => {
                const urgencia = item.diasParaVencer;
                const width = Math.max((urgencia / 240) * 100, 10);
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.producto}</span>
                      <span className="text-gray-600">{item.diasParaVencer} días</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div 
                          className={`h-full ${getExpirationColor(urgencia)} flex items-center px-2 transition-all`}
                          style={{ width: `${width}%` }}
                        >
                          <span className="text-xs text-white font-medium">
                            {item.stock} uds
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.lote}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-gray-500 mb-2">Leyenda de urgencia:</p>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="size-3 bg-red-500 rounded"></div>
                  <span>≤ 30 días</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-3 bg-orange-500 rounded"></div>
                  <span>≤ 60 días</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-3 bg-yellow-500 rounded"></div>
                  <span>≤ 90 días</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="size-3 bg-green-500 rounded"></div>
                  <span>&gt; 90 días</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info de Permisos */}
      {canApproveOrders ? (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-sm text-green-700">
              ✓ Tienes permisos de <strong>Director Técnico</strong> - Puedes aprobar órdenes de compra y gestionar algoritmos de IA
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <p className="text-sm text-purple-700">
              ℹ️ Panel de análisis confidencial - Solo accesible para Directores Técnicos y Administradores IT
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
