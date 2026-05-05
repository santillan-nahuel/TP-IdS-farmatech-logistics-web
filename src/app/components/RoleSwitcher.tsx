import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'admin_it', label: 'Administrador IT' },
  { value: 'jefe_logistica', label: 'Jefe de Logística' },
  { value: 'operario_deposito', label: 'Operario de Depósito' },
  { value: 'auditor', label: 'Auditor' },
];

export function RoleSwitcher() {
  const { user, setUser } = useAuth();

  const handleRoleChange = (role: UserRole) => {
    if (user) {
      setUser({
        ...user,
        role,
      });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border p-4 min-w-64">
        <p className="text-xs font-medium text-gray-500 mb-2">MODO DEMO - Cambiar Rol:</p>
        <Select 
          value={user?.role} 
          onValueChange={(value) => handleRoleChange(value as UserRole)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-400 mt-2">
          Cambia el rol para ver diferentes permisos y funcionalidades
        </p>
      </div>
    </div>
  );
}
