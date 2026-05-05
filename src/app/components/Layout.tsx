import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { 
  Thermometer, 
  TrendingUp, 
  Package, 
  FileText, 
  Menu, 
  User,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const roleNames = {
  admin_it: 'Administrador IT',
  jefe_logistica: 'Jefe de Logística',
  operario_deposito: 'Operario de Depósito',
  auditor: 'Auditor'
};

export function Layout() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const navigation = [
    {
      name: 'Monitoreo Térmico',
      href: '/',
      icon: Thermometer,
      roles: ['admin_it', 'jefe_logistica', 'operario_deposito', 'auditor']
    },
    {
      name: 'Tendencias e IA',
      href: '/tendencias',
      icon: TrendingUp,
      roles: ['admin_it', 'jefe_logistica']
    },
    {
      name: 'Gestión de Stock',
      href: '/stock',
      icon: Package,
      roles: ['admin_it', 'jefe_logistica', 'operario_deposito', 'auditor']
    },
    {
      name: 'Documentación',
      href: '/documentacion',
      icon: FileText,
      roles: ['admin_it', 'jefe_logistica', 'operario_deposito', 'auditor']
    }
  ];

  const availableNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  );

  const NavigationContent = () => (
    <nav className="space-y-1">
      {availableNavigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
              ${isActive 
                ? 'text-white' 
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
            style={isActive ? {
              background: 'linear-gradient(135deg, #0d3b4f 0%, #0a6e6e 50%, #14a3a3 100%)',
            } : undefined}
          >
            <Icon className="size-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4">
                <div className="mb-6 flex items-center gap-3">
                  <img src="/assets/logo.png" alt="FarmaTech" className="w-10 h-10 object-contain" />
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: '#0a6e6e' }}>FarmaTech</h2>
                    <p className="text-xs text-gray-500">Sistema de Gestión Inteligente</p>
                  </div>
                </div>
                <NavigationContent />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-3">
              <img src="/assets/logo.png" alt="FarmaTech" className="w-9 h-9 object-contain hidden sm:block" />
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#0a6e6e' }}>FarmaTech</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Sistema de Gestión Inteligente</p>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #0d3b4f, #14a3a3)',
                  }}
                >
                  {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <span className="hidden sm:inline text-sm">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {user && roleNames[user.role]}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="size-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
          <div className="p-4">
            <NavigationContent />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}