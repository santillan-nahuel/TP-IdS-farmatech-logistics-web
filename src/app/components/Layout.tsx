import { Link, Outlet, useLocation } from 'react-router';
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
import { RoleSwitcher } from './RoleSwitcher';

const roleNames = {
  admin_it: 'Administrador IT',
  director_tecnico: 'Director Técnico',
  operario_deposito: 'Operario de Depósito',
  auditor: 'Auditor'
};

export function Layout() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    {
      name: 'Monitoreo Térmico',
      href: '/',
      icon: Thermometer,
      roles: ['admin_it', 'director_tecnico', 'operario_deposito', 'auditor']
    },
    {
      name: 'Tendencias e IA',
      href: '/tendencias',
      icon: TrendingUp,
      roles: ['admin_it', 'director_tecnico']
    },
    {
      name: 'Gestión de Stock',
      href: '/stock',
      icon: Package,
      roles: ['admin_it', 'director_tecnico', 'operario_deposito', 'auditor']
    },
    {
      name: 'Documentación',
      href: '/documentacion',
      icon: FileText,
      roles: ['admin_it', 'director_tecnico', 'operario_deposito', 'auditor']
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
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
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
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-blue-600">FarmaControl</h2>
                  <p className="text-sm text-gray-500">Sistema de Gestión Inteligente</p>
                </div>
                <NavigationContent />
              </SheetContent>
            </Sheet>
            
            <div>
              <h1 className="text-xl font-bold text-blue-600">FarmaControl</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Sistema de Gestión Inteligente</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="size-4" />
                <span className="hidden sm:inline">{user?.name}</span>
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
              <DropdownMenuItem onClick={() => setUser(null)} className="text-red-600">
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

      {/* Role Switcher for Demo */}
      <RoleSwitcher />
    </div>
  );
}