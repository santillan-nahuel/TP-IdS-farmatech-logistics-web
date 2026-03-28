import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardMonitoreo } from './pages/DashboardMonitoreo';
import { TendenciasInventario } from './pages/TendenciasInventario';
import { GestionStock } from './pages/GestionStock';
import { Documentacion } from './pages/Documentacion';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: DashboardMonitoreo,
      },
      {
        path: 'tendencias',
        element: (
          <ProtectedRoute allowedRoles={['admin_it', 'director_tecnico']}>
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