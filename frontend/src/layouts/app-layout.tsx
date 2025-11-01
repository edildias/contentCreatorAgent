import { Outlet, NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '@/services/auth-context';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/posts', label: 'Posts' },
  { to: '/leads', label: 'Leads' },
  { to: '/themes', label: 'Themes' }
];

export function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="text-xl font-semibold text-primary">
              TopVoice
            </NavLink>
            <nav className="flex items-center gap-4 text-sm font-medium">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded px-3 py-2 transition hover:bg-slate-800 ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300'}`
                  }
                  end={item.to === '/'}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-300">{user?.name}</span>
            <button
              onClick={() => {
                logout();
                navigate('/auth/login');
              }}
              className="rounded border border-slate-700 px-3 py-1 text-slate-200 hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
