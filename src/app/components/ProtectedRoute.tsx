import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Card, CardContent } from './ui/card';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!hasPermission(allowedRoles)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <ShieldAlert className="size-16 mx-auto text-red-500" />
            <h2 className="text-2xl font-bold">Acceso Restringido</h2>
            <p className="text-gray-600">
              No tienes permisos para acceder a esta sección del sistema.
            </p>
            <p className="text-sm text-gray-500">
              Tu rol actual: <span className="font-semibold">{user.role}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
