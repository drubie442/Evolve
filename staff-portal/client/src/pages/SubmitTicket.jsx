import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authHeaders, setAuth, getToken } from '../utils/auth';
import GamificationCard from '../components/GamificationCard';

const URGENCY = [
  { value: 'crisis', label: '🚨 Crisis',  desc: 'Immediate risk — needs help today',    color: '#dc2626' },
  { value: 'high',   label: '🔴 High',    desc: 'Urgent — as soon as possible',         color: '#ea580c' },
  { value: 'medium', label: '🟡 Medium',  desc: 'Important — within the next few days', color: '#d97706' },
  { value: 'low',    label: '🟢 Low',     desc: 'Non-urgent — when available',           color: '#16a34a' },
];

export default function SubmitTicket() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientName: '', patientPhone: '', patientEmail: '',
    concern: '', urgency: 'medium',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field) {
    return e => setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.patientPhone && !form.patientEmail) {
      setError('Please provide at least a phone number or email for the patient.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/staff/tickets', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Submission failed.'); return; }
      // Update stored profile with new points/badges
      if (data.carerProfile) setAuth(getToken(), data.carerProfile);
      setResult(data);
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const { gamification, carerProfile } = result;
    return (
      <div className="page">
        <div className="page-inner page-inner--narrow">
          <div className="success-card">
            <div className="success-card__icon">✅</div>
            <h2>Ticket submitted!</h2>
            <p className="text-muted">
              Patient <strong>{result.ticket.patientName}</strong> has been referred to Evolve.
              A staff member will be in touch shortly.
            </p>

            {gamification && (
              <div className="points-earned">
                <div className="points-earned__amount">+{gamification.pointsEarned} pts</div>
                <div className="points-earned__label">earned for this referral</div>
              </div>
            )}

            {gamification?.newBadges?.length > 0 && (
              <div className="new-badges">
                <p className="new-badges__title">🎉 New badges unlocked!</p>
                {gamification.newBadges.map(b => (
                  <div key={b.id} className="new-badge">
                    <span className="new-badge__icon">{b.icon}</span>
                    <div>
                      <strong>{b.name}</strong>
                      <p className="text-muted">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {carerProfile && (
              <div style={{ marginTop: '1.5rem' }}>
                <GamificationCard profile={carerProfile} />
              </div>
            )}

            <div className="success-card__actions">
              <button className="btn btn-primary" onClick={() => { setResult(null); setForm({ patientName: '', patientPhone: '', patientEmail: '', concern: '', urgency: 'medium' }); }}>
                Submit another
              </button>
              <Link to="/carer" className="btn btn-ghost">Back to dashboard</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-inner page-inner--narrow">
        <Link to="/carer" className="back-link">← Back to dashboard</Link>

        <h1 className="page-title">Submit patient referral</h1>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>
          Fill in the patient details below. Evolve staff will review and contact the patient.
        </p>

        <div className="form-card">
          <form onSubmit={submit}>
            <section className="form-section">
              <h3 className="form-section__title">Patient details</h3>

              <div className="form-field">
                <label htmlFor="patientName">Patient name <span className="required">*</span></label>
                <input id="patientName" type="text" placeholder="First and last name"
                  value={form.patientName} onChange={update('patientName')} required />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="patientPhone">Phone number</label>
                  <input id="patientPhone" type="tel" placeholder="04XX XXX XXX"
                    value={form.patientPhone} onChange={update('patientPhone')} />
                </div>
                <div className="form-field">
                  <label htmlFor="patientEmail">Email address</label>
                  <input id="patientEmail" type="email" placeholder="patient@email.com"
                    value={form.patientEmail} onChange={update('patientEmail')} />
                </div>
              </div>
              <p className="form-hint">Provide at least one contact method.</p>
            </section>

            <section className="form-section">
              <h3 className="form-section__title">Referral details</h3>

              <div className="form-field">
                <label>Urgency level <span className="required">*</span></label>
                <div className="urgency-grid">
                  {URGENCY.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`urgency-btn ${form.urgency === opt.value ? 'urgency-btn--selected' : ''}`}
                      style={form.urgency === opt.value ? { borderColor: opt.color, color: opt.color } : {}}
                      onClick={() => setForm(p => ({ ...p, urgency: opt.value }))}
                    >
                      <span className="urgency-btn__label">{opt.label}</span>
                      <span className="urgency-btn__desc">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="concern">Presenting concern <span className="required">*</span></label>
                <textarea
                  id="concern"
                  rows={5}
                  placeholder="Describe the patient's situation, what support they need, any relevant background information…"
                  value={form.concern}
                  onChange={update('concern')}
                  required
                />
              </div>
            </section>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit referral'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
