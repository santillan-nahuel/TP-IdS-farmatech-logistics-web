import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthGuard } from './components/AuthGuard';
import { DashboardMonitoreo } from './pages/DashboardMonitoreo';
import { TendenciasInventario } from './pages/TendenciasInventario';
import { GestionStock } from './pages/GestionStock';
import { Documentacion } from './pages/Documentacion';
import { Login } from './pages/Login';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        Component: DashboardMonitoreo,
      },
      {
        path: 'tendencias',
        element: (
          <ProtectedRoute allowedRoles={['admin_it', 'jefe_logistica']}>
            <TendenciasInventario />
          </ProtectedRoute>
        ),
      },
      {
        path: 'stock',
        Component: GestionStock,
      },
      {
        path: 'documentacion',
        Component: Documentacion,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);