import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertCircle, ThermometerSnowflake, Activity, CheckCircle2 } from 'lucide-react';
import { storageUnits, temperatureHistory, notifications } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';

export function DashboardMonitoreo() {
  const { user, hasPermission } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle2 className="size-8" />;
      case 'warning': return <AlertCircle className="size-8" />;
      case 'critical': return <ThermometerSnowflake className="size-8" />;
      default: return <Activity className="size-8" />;
    }
  };

  const canExportReports = hasPermission(['director_tecnico', 'admin_it']);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Monitoreo Térmico</h1>
          <p className="text-gray-500 mt-1">Control Operativo en Tiempo Real</p>
        </div>
        {canExportReports && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Exportar Reporte
          </button>
        )}
      </div>

      {/* Tarjetas de Estado de Almacenamiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {storageUnits.map((unit) => (
          <Card key={unit.id} className={`border-2 ${getStatusColor(unit.status)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{unit.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold">{unit.currentTemp}°C</span>
                  </div>
                  <p className="text-xs mt-1">
                    Rango: {unit.minTemp}°C - {unit.maxTemp}°C
                  </p>
                </div>
                <div className={getStatusColor(unit.status)}>
                  {getStatusIcon(unit.status)}
                </div>
              </div>
            </CardHeader>
            {unit.aiAlert && (
              <CardContent className="pt-0">
                <Badge variant="outline" className="text-xs">
                  IA: {unit.aiAlert}
                </Badge>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Temperatura */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fluctuación de Temperatura - Últimas 24 Horas</CardTitle>
            <p className="text-sm text-gray-500">Heladera Vacunas B</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={temperatureHistory.map((item, idx) => ({ ...item, id: idx }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }}
                  interval={3}
                />
                <YAxis 
                  domain={[0, 12]}
                  tick={{ fontSize: 12 }}
                  label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                <ReferenceLine 
                  y={8} 
                  stroke="red" 
                  strokeDasharray="5 5" 
                  label={{ value: "Límite Máximo", position: "top" }}
                  strokeWidth={2}
                />
                <ReferenceLine 
                  y={2} 
                  stroke="blue" 
                  strokeDasharray="5 5" 
                  label={{ value: "Límite Mínimo", position: "bottom" }}
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 3 }}
                  name="Temperatura"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Panel de Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5" />
              Notificaciones en Vivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const typeColors = {
                    info: 'bg-blue-50 border-blue-200 text-blue-700',
                    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
                    critical: 'bg-red-50 border-red-200 text-red-700'
                  };

                  return (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-lg border ${typeColors[notification.type]}`}
                    >
                      <div className="flex items-start gap-2">
                        {notification.type === 'critical' && <AlertCircle className="size-5 flex-shrink-0 mt-0.5" />}
                        {notification.type === 'warning' && <AlertCircle className="size-5 flex-shrink-0 mt-0.5" />}
                        {notification.type === 'info' && <CheckCircle2 className="size-5 flex-shrink-0 mt-0.5" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium break-words">{notification.message}</p>
                          <p className="text-xs mt-1 opacity-70">{notification.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Indicador de Rol y Permisos */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">
                Conectado como: <span className="text-blue-600">{user?.name}</span>
              </p>
              <p className="text-xs text-gray-600">
                {hasPermission(['operario_deposito']) && 'Puedes ver alertas y actuar rápidamente'}
                {hasPermission(['director_tecnico']) && 'Acceso completo a históricos y reportes'}
                {hasPermission(['auditor']) && 'Acceso de solo lectura para auditoría'}
                {hasPermission(['admin_it']) && 'Acceso total al sistema'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}