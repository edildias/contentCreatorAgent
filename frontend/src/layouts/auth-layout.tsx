import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
        <Outlet />
      </div>
    </div>
  );
}
