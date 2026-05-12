import { useState } from 'react';
import ResourceCard from '../components/ResourceCard';

const CONCERN_OPTIONS = [
  { value: 'crisis', label: '🆘 Crisis / Safety concern' },
  { value: 'anxiety', label: '😰 Anxiety' },
  { value: 'stress', label: '😤 Stress' },
  { value: 'low-mood', label: '😔 Low mood / Depression' },
  { value: 'loneliness', label: '😶 Loneliness / Isolation' },
  { value: 'relationships', label: '💔 Relationships / Family' },
  { value: 'grief', label: '🕊️ Grief & Loss' },
  { value: 'general', label: '❓ General wellbeing' },
];

export default function Handoff() {
  const [selected, setSelected] = useState([]);
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function toggleConcern(value) {
    setSelected(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (selected.length === 0) { setError('Please select at least one concern.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concerns: selected, mobile: mobile || undefined, location: location || 'ED' }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSelected([]);
    setMobile('');
    setLocation('');
    setResult(null);
    setError('');
  }

  if (result) {
    return (
      <div className="page">
        <div className="container--narrow">
          <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
            <h2 style={{ fontWeight: 800, color: 'var(--clr-primary-dark)', marginBottom: '0.5rem' }}>
              {result.smsSent ? 'Resource card sent!' : 'Resource card ready'}
            </h2>
            <p className="text-muted">{result.message}</p>
          </div>

          <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Resources included:</p>
          <div className="resource-grid">
            {result.resources.map(r => <ResourceCard key={r.id} resource={r} />)}
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button className="btn btn--primary btn--large" onClick={reset}>
              New patient handoff
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
            🏥 Staff Warm Handoff
          </h1>
          <p className="text-muted">
            Select the patient's concerns and optionally enter their mobile number. A personalised resource card will be prepared — or sent by SMS if a number is provided.
          </p>
        </div>

        <form onSubmit={submit}>
          <p style={{ fontWeight: 700, marginBottom: '1rem' }}>What concerns apply to this patient?</p>
          <div className="handoff-concerns">
            {CONCERN_OPTIONS.map(c => (
              <button
                type="button"
                key={c.value}
                className={`concern-btn ${selected.includes(c.value) ? 'concern-btn--selected' : ''}`}
                onClick={() => toggleConcern(c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="location">Ward / Location (optional)</label>
            <input
              id="location"
              type="text"
              placeholder="e.g. ED, Ward 5"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="mobile">Patient mobile number (optional)</label>
            <input
              id="mobile"
              type="tel"
              placeholder="04XX XXX XXX"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              pattern="[0-9 +()-]{8,15}"
            />
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--clr-text-muted)', marginTop: '0.25rem' }}>
              If provided, a resource card will be sent by SMS. No other data is stored.
            </p>
          </div>

          {error && <p style={{ color: 'var(--clr-crisis)', marginBottom: '1rem' }}>{error}</p>}

          <button
            type="submit"
            className="btn btn--primary btn--large btn--full"
            disabled={loading}
          >
            {loading ? 'Preparing...' : '📤 Send resource card'}
          </button>
        </form>
      </div>
    </div>
  );
}
