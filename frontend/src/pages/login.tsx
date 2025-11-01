import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/services/auth-context';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-slate-400">Sign in to access your TopVoice workspace.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium text-slate-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            required
          />
        </div>
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium text-slate-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            required
          />
        </div>
        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
