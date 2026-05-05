import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';

// Usuarios mock para el prototipo
const mockUsers: { role: UserRole; name: string; email: string; avatar: string }[] = [
  { role: 'admin_it', name: 'Carlos Méndez', email: 'carlos.mendez@farmatech.com', avatar: 'CM' },
  { role: 'jefe_logistica', name: 'Laura Vega', email: 'laura.vega@farmatech.com', avatar: 'LV' },
  { role: 'operario_deposito', name: 'Martín López', email: 'martin.lopez@farmatech.com', avatar: 'ML' },
  { role: 'auditor', name: 'Ana Gutiérrez', email: 'ana.gutierrez@farmatech.com', avatar: 'AG' },
];

const roleLabels: Record<UserRole, string> = {
  admin_it: 'Administrador IT',
  jefe_logistica: 'Jefe de Logística',
  operario_deposito: 'Operario de Depósito',
  auditor: 'Auditor',
};

export function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Autocompletar email al seleccionar rol
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const mockUser = mockUsers.find(u => u.role === role);
    if (mockUser) {
      setEmail(mockUser.email);
      setPassword('••••••••');
    }
  };

  const handleLogin = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = mockUsers.find(u => u.role === selectedRole);
    if (mockUser) {
      setUser({
        id: Math.random().toString(36).substr(2, 9),
        name: mockUser.name,
        role: mockUser.role,
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0d3b4f 0%, #0a6e6e 30%, #14a3a3 60%, #2dd4bf 100%)',
        }}
      >
        {/* Patrón decorativo de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full border-2 border-white/30" />
          <div className="absolute top-40 right-20 w-96 h-96 rounded-full border border-white/20" />
          <div className="absolute bottom-20 left-1/3 w-64 h-64 rounded-full border-2 border-white/25" />
          <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full bg-white/5" />
        </div>
        
        {/* Contenido branding */}
        <div className="relative z-10 text-center px-12 max-w-lg">
          <div className="mb-8 flex justify-center">
            <div className="w-40 h-40 rounded-3xl flex items-center justify-center p-2 backdrop-blur-sm bg-white/10 shadow-2xl">
              <img 
                src="/assets/logo.png" 
                alt="FarmaTech Logo" 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            FarmaTech
          </h1>
          <p className="text-lg text-teal-100 font-light italic mb-8">
            "Transformando la vida a través de la ciencia de precisión"
          </p>
          
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Shield className="size-4 text-white" />
              </div>
              <span>Monitoreo inteligente de cadena de frío con IoT</span>
            </div>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Shield className="size-4 text-white" />
              </div>
              <span>Trazabilidad completa conforme a ANMAT</span>
            </div>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Shield className="size-4 text-white" />
              </div>
              <span>Predicciones de inventario con inteligencia artificial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo para mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center p-1"
              style={{
                background: 'linear-gradient(135deg, #0d3b4f 0%, #14a3a3 100%)',
              }}
            >
              <img 
                src="/assets/logo.png" 
                alt="FarmaTech Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FarmaTech</h1>
            <p className="text-sm text-gray-500 italic mt-1">
              "Transformando la vida a través de la ciencia de precisión"
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white">
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Ingresá al sistema de gestión inteligente
                </p>
              </div>

              {/* Selector de rol para demo */}
              <div className="mb-6 p-4 rounded-xl border-2 border-dashed border-teal-300 bg-teal-50/50">
                <p className="text-xs font-semibold text-teal-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  Modo Prototipo — Seleccioná un rol
                </p>
                <Select 
                  value={selectedRole} 
                  onValueChange={(value) => handleRoleChange(value as UserRole)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Elegí un rol para ingresar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.role} value={user.role}>
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{
                              background: 'linear-gradient(135deg, #0d3b4f, #14a3a3)',
                            }}
                          >
                            {user.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">{roleLabels[user.role]}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Campos de login */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-gray-700">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@farmatech.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm text-gray-700">
                      Contraseña
                    </Label>
                    <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón de login */}
              <Button
                onClick={handleLogin}
                disabled={!selectedRole || isLoading}
                className="w-full h-11 mt-6 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01]"
                style={{
                  background: selectedRole 
                    ? 'linear-gradient(135deg, #0d3b4f 0%, #0a6e6e 50%, #14a3a3 100%)' 
                    : undefined,
                }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Autenticando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="size-4" />
                    Ingresar al Sistema
                  </div>
                )}
              </Button>

              {/* Info de seguridad */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1.5">
                  <Shield className="size-3" />
                  Conexión segura con encriptación de extremo a extremo
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center mt-6">
            © 2026 FarmaTech S.A. — Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
