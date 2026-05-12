import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuth, isLoggedIn, isStaff } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isLoggedIn()) {
    navigate(isStaff() ? '/staff' : '/carer', { replace: true });
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/staff/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed.'); return; }
      setAuth(data.token, data.user);
      navigate(data.user.role === 'staff' ? '/staff' : '/carer', { replace: true });
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">🏥</div>
        <h1 className="auth-card__title">Evolve Staff Portal</h1>
        <p className="auth-card__sub">Sign in to your account</p>

        <form onSubmit={submit} className="auth-form">
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email" type="email" placeholder="you@organisation.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required autoComplete="email"
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password" type="password" placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required autoComplete="current-password"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-card__footer">
          New carer? <Link to="/register">Create an account</Link>
        </p>

        <div className="auth-hint">
          <p><strong>Evolve staff login:</strong></p>
          <p>staff@evolve.org.au · evolve2024</p>
        </div>
      </div>
    </div>
  );
}
