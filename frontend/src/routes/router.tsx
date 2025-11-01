import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/layouts/app-layout';
import { AuthLayout } from '@/layouts/auth-layout';
import { DashboardPage } from '@/pages/dashboard';
import { KanbanPage } from '@/pages/kanban';
import { LeadsPage } from '@/pages/leads';
import { LoginPage } from '@/pages/login';
import { ThemesPage } from '@/pages/themes';
import { RequireAuth } from '@/features/auth/require-auth';

export const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />, 
    children: [
      { path: 'login', element: <LoginPage /> }
    ]
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'posts', element: <KanbanPage /> },
          { path: 'leads', element: <LeadsPage /> },
          { path: 'themes', element: <ThemesPage /> }
        ]
      }
    ]
  }
]);
