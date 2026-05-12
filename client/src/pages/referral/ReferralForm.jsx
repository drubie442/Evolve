import { useState } from 'react';

const SERVICES = [
  'Youth Support',
  'Mental Health Counselling',
  'Case Management',
  'Social Work',
  'Community Support',
  'Crisis Support',
  'Housing Support',
  'Employment Support',
  'Other',
];

const URGENCY_OPTIONS = [
  { value: 'crisis', label: 'I need help today (urgent)', color: 'var(--clr-crisis)' },
  { value: 'high', label: 'As soon as possible', color: '#c0752b' },
  { value: 'medium', label: 'Within the next few days', color: 'var(--clr-accent)' },
  { value: 'low', label: 'When available — no rush', color: 'var(--clr-primary)' },
];

export default function ReferralForm() {
  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceType: '',
    urgency: 'medium',
    concern: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.clientPhone && !form.clientEmail) {
      setError('Please provide at least a phone number or email so we can reach you.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/referral/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'client' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setTicketId(data.ticket.id.slice(0, 8).toUpperCase());
      setSubmitted(true);
    } catch {
      setError('Could not submit your referral. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="container--narrow">
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--clr-primary-dark)', marginBottom: '0.75rem' }}>
              Referral submitted!
            </h2>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>
              Your reference number is
            </p>
            <div className="referral-ticket-id">#{ticketId}</div>
            <p className="text-muted" style={{ marginTop: '1rem', fontSize: 'var(--text-sm)' }}>
              A support worker will review your referral and be in touch soon. If this is a crisis, please call <strong>000</strong> or Lifeline on <strong>13 11 14</strong>.
            </p>
            <button
              className="btn btn--secondary mt-6"
              onClick={() => { setSubmitted(false); setForm({ clientName: '', clientPhone: '', clientEmail: '', serviceType: '', urgency: 'medium', concern: '', notes: '' }); }}
            >
              Submit another referral
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container--narrow">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--clr-primary-dark)', marginBottom: '0.5rem' }}>
            Request Support
          </h1>
          <p className="text-muted">
            Fill in this short form and a support worker will be in touch. No referral letter needed.
          </p>
        </div>

        <div className="card">
          <form onSubmit={submit}>
            <div className="referral-field">
              <label htmlFor="clientName">Your name <span style={{ color: 'var(--clr-crisis)' }}>*</span></label>
              <input
                id="clientName"
                type="text"
                placeholder="First and last name"
                value={form.clientName}
                onChange={update('clientName')}
                required
              />
            </div>

            <div className="referral-field">
              <label htmlFor="clientPhone">Phone number</label>
              <input
                id="clientPhone"
                type="tel"
                placeholder="04XX XXX XXX"
                value={form.clientPhone}
                onChange={update('clientPhone')}
              />
            </div>

            <div className="referral-field">
              <label htmlFor="clientEmail">Email address</label>
              <input
                id="clientEmail"
                type="email"
                placeholder="your@email.com"
                value={form.clientEmail}
                onChange={update('clientEmail')}
              />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-muted)', marginTop: '0.25rem' }}>
                Provide at least one way to contact you.
              </p>
            </div>

            <div className="referral-field">
              <label htmlFor="serviceType">What kind of support are you looking for? <span style={{ color: 'var(--clr-crisis)' }}>*</span></label>
              <select id="serviceType" value={form.serviceType} onChange={update('serviceType')} required>
                <option value="">Choose a service…</option>
                {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="referral-field">
              <label>How urgent does this feel?</label>
              <div className="referral-urgency-grid">
                {URGENCY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`referral-urgency-btn ${form.urgency === opt.value ? 'referral-urgency-btn--selected' : ''}`}
                    style={form.urgency === opt.value ? { borderColor: opt.color, color: opt.color } : {}}
                    onClick={() => setForm(prev => ({ ...prev, urgency: opt.value }))}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="referral-field">
              <label htmlFor="notes">Anything else you want us to know? (optional)</label>
              <textarea
                id="notes"
                rows={4}
                placeholder="e.g. best time to call, what's going on, any other context…"
                value={form.notes}
                onChange={update('notes')}
              />
            </div>

            {error && (
              <p style={{ color: 'var(--clr-crisis)', fontWeight: 600, marginBottom: '1rem' }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn btn--primary btn--large btn--full"
              disabled={loading}
            >
              {loading ? 'Submitting…' : 'Submit referral'}
            </button>
          </form>
        </div>

        <p className="text-muted text-center mt-4" style={{ fontSize: 'var(--text-sm)' }}>
          In crisis right now? Call <strong>000</strong> or Lifeline <strong>13 11 14</strong> (24/7).
        </p>
      </div>
    </div>
  );
}
