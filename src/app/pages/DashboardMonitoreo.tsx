import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { AlertCircle, ThermometerSnowflake, Activity, CheckCircle2, Zap, ZapOff, Wrench, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { storageUnits, temperatureHistory, notifications, generatorStatus, temperatureHistoryByUnit, outOfRangeRecords, storageEvents, maintenanceRequests } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '../components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { StorageUnit } from '../types';

export function DashboardMonitoreo() {
  const { user, hasPermission } = useAuth();
  const [selectedUnit, setSelectedUnit] = useState<StorageUnit | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const canExportReports = hasPermission(['jefe_logistica', 'admin_it', 'auditor']);
  const canRequestMaintenance = hasPermission(['admin_it', 'jefe_logistica', 'operario_deposito']);
  const isReadOnly = hasPermission(['auditor']) && !hasPermission(['admin_it']);

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
      case 'normal': return <CheckCircle2 className="size-6" />;
      case 'warning': return <AlertCircle className="size-6" />;
      case 'critical': return <ThermometerSnowflake className="size-6" />;
      default: return <Activity className="size-6" />;
    }
  };

  const getGeneratorConfig = () => {
    switch (generatorStatus.state) {
      case 'standby': return { label: 'En Espera', color: 'text-gray-600 bg-gray-50 border-gray-200', icon: <Zap className="size-5 text-gray-500" />, dot: 'bg-gray-400' };
      case 'active': return { label: 'Activo', color: 'text-green-600 bg-green-50 border-green-200', icon: <Zap className="size-5 text-green-600" />, dot: 'bg-green-500 animate-pulse' };
      case 'testing': return { label: 'En Prueba', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: <Zap className="size-5 text-yellow-600" />, dot: 'bg-yellow-500 animate-pulse' };
      case 'offline': return { label: 'Fuera de Servicio', color: 'text-red-600 bg-red-50 border-red-200', icon: <ZapOff className="size-5 text-red-600" />, dot: 'bg-red-500' };
    }
  };

  const getSensorStatusDot = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'faulty': return 'bg-red-500 animate-pulse';
      default: return 'bg-gray-400';
    }
  };

  const handleUnitClick = (unit: StorageUnit) => {
    setSelectedUnit(unit);
    setDrawerOpen(true);
  };

  const genConfig = getGeneratorConfig();
  const unitEvents = selectedUnit ? storageEvents.filter(e => e.unitId === selectedUnit.id) : [];
  const unitOOR = selectedUnit ? outOfRangeRecords.find(r => r.unitId === selectedUnit.id) : null;
  const unitHistory = selectedUnit ? temperatureHistoryByUnit[selectedUnit.id] || [] : [];
  const unitMaintenance = selectedUnit ? maintenanceRequests.filter(m => m.unitId === selectedUnit.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Monitoreo Térmico</h1>
          <p className="text-gray-500 mt-1">Control Operativo en Tiempo Real</p>
        </div>
        {canExportReports && (
          <button className="px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90" style={{ background: 'linear-gradient(135deg, #0d3b4f, #14a3a3)' }}>
            Exportar Reporte
          </button>
        )}
      </div>

      {/* Banner auditor */}
      {isReadOnly && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
          <ShieldCheck className="size-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            <strong>Modo Auditoría</strong> — Acceso de solo lectura. Puedes exportar reportes para documentación ANMAT.
          </p>
        </div>
      )}

      {/* Generador de Reserva */}
      <Card className={`border-2 ${genConfig.color}`}>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {genConfig.icon}
              <div>
                <p className="text-sm font-semibold">Generador de Reserva</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${genConfig.dot}`} />
                  <span className="text-sm">{genConfig.label}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-xs text-gray-500">Combustible</p>
                <p className="font-semibold">{generatorStatus.fuelLevel}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Horas acum.</p>
                <p className="font-semibold">{generatorStatus.runtime}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Última prueba</p>
                <p className="font-semibold text-xs">{generatorStatus.lastTest}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjetas de Heladeras con Triple Sensor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {storageUnits.map((unit) => (
          <Card
            key={unit.id}
            className={`border-2 ${getStatusColor(unit.status)} cursor-pointer hover:shadow-lg transition-shadow`}
            onClick={() => handleUnitClick(unit)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{unit.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold">{unit.averageTemp}°C</span>
                    <span className="text-xs text-gray-500">prom.</span>
                  </div>
                  <p className="text-xs mt-0.5">Rango: {unit.minTemp}°C a {unit.maxTemp}°C</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusIcon(unit.status)}
                  <ChevronRight className="size-4 text-gray-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {/* Mini sensores */}
              <div className="flex gap-2">
                {unit.sensors.map((s) => (
                  <div key={s.id} className="flex-1 bg-white/60 rounded px-2 py-1 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${getSensorStatusDot(s.status)}`} />
                      <span className="text-[10px] text-gray-500">{s.label}</span>
                    </div>
                    <p className="text-sm font-semibold">{s.temperature}°C</p>
                  </div>
                ))}
              </div>
              {unit.sensorAlert && (
                <Badge variant="outline" className="text-[10px] w-full justify-center bg-red-100 text-red-700 border-red-300">
                  ⚠ {unit.sensorAlert.split('(')[0].trim()}
                </Badge>
              )}
              {unit.aiAlert && !unit.sensorAlert && (
                <Badge variant="outline" className="text-[10px] w-full justify-center">
                  IA: {unit.aiAlert}
                </Badge>
              )}
            </CardContent>
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
                <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} interval={3} />
                <YAxis domain={[0, 12]} tick={{ fontSize: 12 }} label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <ReferenceLine y={8} stroke="red" strokeDasharray="5 5" label={{ value: "Máx", position: "top" }} strokeWidth={2} />
                <ReferenceLine y={2} stroke="blue" strokeDasharray="5 5" label={{ value: "Mín", position: "bottom" }} strokeWidth={2} />
                <Line type="monotone" dataKey="temperature" stroke="#0a6e6e" strokeWidth={2} dot={{ fill: '#0a6e6e', r: 3 }} name="Temperatura" isAnimationActive={false} />
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
                    <div key={notification.id} className={`p-3 rounded-lg border ${typeColors[notification.type]}`}>
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

      {/* Drawer de Detalle de Heladera */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedUnit && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <SheetTitle className="text-2xl">{selectedUnit.name}</SheetTitle>
                    <SheetDescription>Detalle completo de la unidad de almacenamiento</SheetDescription>
                  </div>
                  <Badge className={getStatusColor(selectedUnit.status)}>
                    {selectedUnit.status.toUpperCase()}
                  </Badge>
                </div>
              </SheetHeader>

              <Tabs defaultValue="sensors" className="mt-6">
                <TabsList className="w-full">
                  <TabsTrigger value="sensors" className="flex-1 text-xs">Sensores</TabsTrigger>
                  <TabsTrigger value="history" className="flex-1 text-xs">Historial</TabsTrigger>
                  <TabsTrigger value="events" className="flex-1 text-xs">Trazabilidad</TabsTrigger>
                  <TabsTrigger value="maintenance" className="flex-1 text-xs">Mantenimiento</TabsTrigger>
                </TabsList>

                {/* Tab: Sensores */}
                <TabsContent value="sensors" className="mt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {selectedUnit.sensors.map((sensor) => (
                      <Card key={sensor.id} className={`${sensor.status === 'faulty' ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                        <CardContent className="pt-4 text-center">
                          <div className="flex items-center justify-center gap-1 mb-2">
                            <span className={`w-2 h-2 rounded-full ${getSensorStatusDot(sensor.status)}`} />
                            <span className="text-xs text-gray-500">{sensor.label}</span>
                          </div>
                          <p className="text-2xl font-bold">{sensor.temperature}°C</p>
                          <p className="text-xs mt-1 capitalize">{sensor.status === 'faulty' ? '⚠ Posible falla' : sensor.status}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-gray-50">
                    <CardContent className="pt-4 text-center">
                      <p className="text-xs text-gray-500">Temperatura Promedio</p>
                      <p className="text-4xl font-bold" style={{ color: '#0a6e6e' }}>{selectedUnit.averageTemp}°C</p>
                      <p className="text-xs text-gray-500 mt-1">Rango permitido: {selectedUnit.minTemp}°C a {selectedUnit.maxTemp}°C</p>
                    </CardContent>
                  </Card>

                  {selectedUnit.sensorAlert && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700 font-medium">⚠ Alerta de Sensor</p>
                      <p className="text-sm text-red-600 mt-1">{selectedUnit.sensorAlert}</p>
                    </div>
                  )}

                  {unitOOR && unitOOR.totalMinutes > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-orange-800 flex items-center gap-1">
                        <Clock className="size-4" />
                        Tiempo fuera de rango (últimos 7 días)
                      </p>
                      <div className="flex gap-6 mt-2 text-sm">
                        <div><span className="font-bold text-orange-700">{Math.floor(unitOOR.totalMinutes / 60)}h {unitOOR.totalMinutes % 60}min</span> total</div>
                        <div><span className="font-bold text-orange-700">{unitOOR.incidents}</span> incidentes</div>
                      </div>
                      <p className="text-xs text-orange-600 mt-1">Último: {unitOOR.lastIncident}</p>
                    </div>
                  )}
                </TabsContent>

                {/* Tab: Historial */}
                <TabsContent value="history" className="mt-4">
                  <p className="text-sm text-gray-500 mb-3">Últimas 48 horas — Las zonas rojas indican temperatura fuera de rango</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={unitHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} interval={7} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <ReferenceLine y={selectedUnit.maxTemp} stroke="red" strokeDasharray="3 3" />
                      <ReferenceLine y={selectedUnit.minTemp} stroke="blue" strokeDasharray="3 3" />
                      <Area type="monotone" dataKey="temp" stroke="#0a6e6e" fill="#0a6e6e" fillOpacity={0.15} strokeWidth={2} name="Temperatura" isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>

                {/* Tab: Trazabilidad */}
                <TabsContent value="events" className="mt-4">
                  <p className="text-sm text-gray-500 mb-3">Registro completo de eventos</p>
                  {unitEvents.length > 0 ? (
                    <div className="space-y-2">
                      {unitEvents.map((event) => {
                        const sevColors = {
                          info: 'border-l-blue-500 bg-blue-50/50',
                          warning: 'border-l-yellow-500 bg-yellow-50/50',
                          critical: 'border-l-red-500 bg-red-50/50',
                        };
                        return (
                          <div key={event.id} className={`p-3 rounded-r-lg border-l-4 ${sevColors[event.severity]}`}>
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium">{event.description}</p>
                              <Badge variant="outline" className="text-[10px] ml-2 flex-shrink-0">{event.type}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{event.timestamp}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-8 text-sm">Sin eventos registrados</p>
                  )}
                </TabsContent>

                {/* Tab: Mantenimiento */}
                <TabsContent value="maintenance" className="mt-4 space-y-4">
                  {canRequestMaintenance && (
                    <Button className="w-full" style={{ background: 'linear-gradient(135deg, #0d3b4f, #14a3a3)' }}>
                      <Wrench className="size-4 mr-2" />
                      Solicitar Mantenimiento
                    </Button>
                  )}

                  {unitMaintenance.length > 0 ? (
                    <div className="space-y-3">
                      {unitMaintenance.map((req) => {
                        const statusColors = {
                          pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                          en_progreso: 'bg-blue-100 text-blue-700 border-blue-200',
                          resuelto: 'bg-green-100 text-green-700 border-green-200',
                        };
                        return (
                          <Card key={req.id}>
                            <CardContent className="pt-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <Badge className={statusColors[req.status]}>{req.status.replace('_', ' ')}</Badge>
                                <Badge variant="outline" className="text-xs">{req.type}</Badge>
                              </div>
                              <p className="text-sm">{req.reason}</p>
                              <div className="text-xs text-gray-500 space-y-0.5">
                                <p>Solicitado por: {req.requestedBy}</p>
                                <p>Fecha: {req.requestedAt}</p>
                                {req.resolvedAt && <p>Resuelto: {req.resolvedAt}</p>}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-8 text-sm">Sin solicitudes de mantenimiento</p>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}