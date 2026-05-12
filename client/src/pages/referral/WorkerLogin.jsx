import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuth } from './authUtil';

const SPECIALTIES = [
  'Youth Support Worker',
  'Mental Health Counsellor',
  'Case Manager',
  'Social Worker',
  'Community Support Worker',
  'Crisis Worker',
  'Housing Support Worker',
  'Employment Support Worker',
  'Other',
];

export default function WorkerLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', specialty: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, specialty: form.specialty };

      const res = await fetch(`/api/referral/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }
      setAuth(data.token, data.worker);
      navigate('/referral/board');
    } catch {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container--narrow">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--clr-primary-dark)' }}>
            Worker Portal
          </h1>
          <p className="text-muted">Internal referral board — Evolve Wellbeing staff only</p>
        </div>

        <div className="card">
          <div className="referral-mode-toggle">
            <button
              type="button"
              className={`referral-tab ${mode === 'login' ? 'referral-tab--active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`referral-tab ${mode === 'register' ? 'referral-tab--active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={submit} style={{ marginTop: '1.5rem' }}>
            {mode === 'register' && (
              <>
                <div className="referral-field">
                  <label htmlFor="name">Full name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. Alex Smith"
                    value={form.name}
                    onChange={update('name')}
                    required
                  />
                </div>
                <div className="referral-field">
                  <label htmlFor="specialty">Role / Specialty</label>
                  <select id="specialty" value={form.specialty} onChange={update('specialty')} required>
                    <option value="">Select your role…</option>
                    {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </>
            )}

            <div className="referral-field">
              <label htmlFor="email">Work email</label>
              <input
                id="email"
                type="email"
                placeholder="you@evolve.org.au"
                value={form.email}
                onChange={update('email')}
                required
              />
            </div>

            <div className="referral-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={update('password')}
                required
                minLength={6}
              />
            </div>

            {error && (
              <p style={{ color: 'var(--clr-crisis)', marginBottom: '1rem', fontWeight: 600 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn--primary btn--full"
              style={{ marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-muted text-center mt-4" style={{ fontSize: 'var(--text-sm)' }}>
          Having trouble? Contact your Evolve hub coordinator.
        </p>
      </div>
    </div>
  );
}
