import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/services/auth-context';

export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
