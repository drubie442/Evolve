import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, authHeaders, getWorker } from './authUtil';

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
  { value: 'crisis', label: 'Crisis — needs help today' },
  { value: 'high', label: 'High — as soon as possible' },
  { value: 'medium', label: 'Medium — within a few days' },
  { value: 'low', label: 'Low — when available' },
];

export default function StaffIntake() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    serviceType: '',
    urgency: 'medium',
    concern: '',
    notes: '',
    assignedTo: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/referral/login');
      return;
    }
    fetch('/api/referral/tickets/workers', { headers: authHeaders() })
      .then(r => r.json())
      .then(setWorkers)
      .catch(() => {});
  }, [navigate]);

  function update(field) {
    return e => setForm(prev => ({ ...prev, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/referral/tickets', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ ...form, type: 'staff' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }
      setTicketId(data.ticket.id.slice(0, 8).toUpperCase());
      setSubmitted(true);
    } catch {
      setError('Could not submit. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const currentWorker = getWorker();

  if (submitted) {
    return (
      <div className="page">
        <div className="container--narrow">
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📋</div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--clr-primary-dark)', marginBottom: '0.5rem' }}>
              Referral created
            </h2>
            <p className="text-muted" style={{ marginBottom: '0.75rem' }}>Ticket reference</p>
            <div className="referral-ticket-id">#{ticketId}</div>
            <p className="text-muted mt-4" style={{ fontSize: 'var(--text-sm)' }}>
              This ticket is now visible on the referral board.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn--primary"
                onClick={() => navigate('/referral/board')}
              >
                Go to board
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => { setSubmitted(false); setForm({ clientName: '', clientPhone: '', clientEmail: '', serviceType: '', urgency: 'medium', concern: '', notes: '', assignedTo: '' }); }}
              >
                Add another
              </button>
            </div>
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
            Staff Intake
          </h1>
          <p className="text-muted">
            Create a referral ticket on behalf of a client.
            {currentWorker && <span> Logged in as <strong>{currentWorker.name}</strong>.</span>}
          </p>
        </div>

        <div className="card">
          <form onSubmit={submit}>
            <p style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--clr-primary-dark)' }}>Client details</p>

            <div className="referral-field">
              <label htmlFor="clientName">Client name <span style={{ color: 'var(--clr-crisis)' }}>*</span></label>
              <input
                id="clientName"
                type="text"
                placeholder="First and last name"
                value={form.clientName}
                onChange={update('clientName')}
                required
              />
            </div>

            <div className="referral-two-col">
              <div className="referral-field">
                <label htmlFor="clientPhone">Phone</label>
                <input
                  id="clientPhone"
                  type="tel"
                  placeholder="04XX XXX XXX"
                  value={form.clientPhone}
                  onChange={update('clientPhone')}
                />
              </div>
              <div className="referral-field">
                <label htmlFor="clientEmail">Email</label>
                <input
                  id="clientEmail"
                  type="email"
                  placeholder="client@email.com"
                  value={form.clientEmail}
                  onChange={update('clientEmail')}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--clr-border)', margin: '1.25rem 0', paddingTop: '1.25rem' }}>
              <p style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--clr-primary-dark)' }}>Service & urgency</p>
            </div>

            <div className="referral-two-col">
              <div className="referral-field">
                <label htmlFor="serviceType">Service needed <span style={{ color: 'var(--clr-crisis)' }}>*</span></label>
                <select id="serviceType" value={form.serviceType} onChange={update('serviceType')} required>
                  <option value="">Select…</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="referral-field">
                <label htmlFor="urgency">Urgency</label>
                <select id="urgency" value={form.urgency} onChange={update('urgency')}>
                  {URGENCY_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="referral-field">
              <label htmlFor="concern">Primary concern / presenting issue</label>
              <input
                id="concern"
                type="text"
                placeholder="e.g. housing instability, anxiety, recent discharge"
                value={form.concern}
                onChange={update('concern')}
              />
            </div>

            <div className="referral-field">
              <label htmlFor="notes">Staff notes</label>
              <textarea
                id="notes"
                rows={4}
                placeholder="Clinical context, background, what's already been tried…"
                value={form.notes}
                onChange={update('notes')}
              />
            </div>

            {workers.length > 0 && (
              <div className="referral-field">
                <label htmlFor="assignedTo">Assign to worker (optional)</label>
                <select id="assignedTo" value={form.assignedTo} onChange={update('assignedTo')}>
                  <option value="">Leave unassigned (open pool)</option>
                  {workers.map(w => (
                    <option key={w.id} value={w.id}>{w.name} — {w.specialty}</option>
                  ))}
                </select>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-muted)', marginTop: '0.25rem' }}>
                  If assigned, the ticket will go directly to In Progress.
                </p>
              </div>
            )}

            {error && (
              <p style={{ color: 'var(--clr-crisis)', fontWeight: 600, marginBottom: '1rem' }}>{error}</p>
            )}

            <button
              type="submit"
              className="btn btn--primary btn--large btn--full"
              disabled={loading}
            >
              {loading ? 'Creating ticket…' : 'Create referral ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
