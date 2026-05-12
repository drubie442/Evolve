import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuth } from '../utils/auth';

const SPECIALTIES = [
  'Nurse', 'Doctor / GP', 'Police Officer', 'Social Worker',
  'Aged Care Worker', 'Disability Support Worker', 'Mental Health Worker',
  'Community Health Worker', 'Paramedic', 'Other',
];

export default function Register() {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    orgId: '', specialty: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/orgs').then(r => r.json()).then(setOrgs).catch(() => {});
  }, []);

  function update(field) {
    return e => setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          orgId: form.orgId,
          specialty: form.specialty,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed.'); return; }
      setAuth(data.token, data.user);
      navigate('/carer', { replace: true });
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--wide">
        <div className="auth-card__logo">🤝</div>
        <h1 className="auth-card__title">Register as a carer</h1>
        <p className="auth-card__sub">Create your account to submit patient referrals</p>

        <form onSubmit={submit} className="auth-form">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name">Full name <span className="required">*</span></label>
              <input id="name" type="text" placeholder="Alex Smith"
                value={form.name} onChange={update('name')} required />
            </div>
            <div className="form-field">
              <label htmlFor="email">Work email <span className="required">*</span></label>
              <input id="email" type="email" placeholder="you@org.com"
                value={form.email} onChange={update('email')} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="orgId">Organisation <span className="required">*</span></label>
              <select id="orgId" value={form.orgId} onChange={update('orgId')} required>
                <option value="">Select your organisation…</option>
                {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="specialty">Your role <span className="required">*</span></label>
              <select id="specialty" value={form.specialty} onChange={update('specialty')} required>
                <option value="">Select your role…</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="password">Password <span className="required">*</span></label>
              <input id="password" type="password" placeholder="Min. 8 characters"
                value={form.password} onChange={update('password')} required minLength={8} />
            </div>
            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm password <span className="required">*</span></label>
              <input id="confirmPassword" type="password" placeholder="Repeat password"
                value={form.confirmPassword} onChange={update('confirmPassword')} required />
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
