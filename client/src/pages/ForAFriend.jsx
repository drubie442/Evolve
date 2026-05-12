import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CrisisBanner from '../components/CrisisBanner';
import ActionCard from '../components/ActionCard';

const OBSERVATIONS = [
  { value: 'withdrawn', label: '😶 They seem withdrawn' },
  { value: 'anxiety', label: '😰 They seem anxious or worried' },
  { value: 'low-mood', label: '😔 They seem down or sad' },
  { value: 'stress', label: '😤 They seem very stressed' },
  { value: 'crisis', label: '🆘 I\'m worried about their safety' },
  { value: 'grief', label: '🕊️ They\'ve experienced a loss' },
  { value: 'relationships', label: '💔 They\'re having relationship trouble' },
  { value: 'general', label: '❓ I\'m just not sure how they are' },
];

export default function ForAFriend() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'default';
  const modeClass = mode === 'elder' ? 'mode-elder' : '';
  const navigate = useNavigate();

  const [observations, setObservations] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function toggleObservation(value) {
    setObservations(prev =>
      prev.includes(value) ? prev.filter(o => o !== value) : [...prev, value]
    );
  }

  async function handleSubmit() {
    if (observations.length === 0) return;
    setLoading(true);
    const mappedConcerns = observations.map(v => v === 'withdrawn' ? 'loneliness' : v);
    const isCrisis = observations.includes('crisis');
    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forSelf: false,
          concerns: mappedConcerns,
          urgency: isCrisis ? 'today' : 'days',
          ageGroup: 'adult',
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setObservations([]);
    setResult(null);
  }

  return (
    <div className={`page ${modeClass}`}>
      <div className="container--narrow">
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--clr-primary-dark)', marginBottom: '0.5rem' }}>
          🤝 For a Friend or Family Member
        </h1>
        <p className="text-muted mb-6">
          You can help connect someone you care about with support — without them needing to do anything right now.
        </p>

        {!result && (
          <>
            <p style={{ fontWeight: 700, marginBottom: '1rem' }}>What have you noticed? Select all that apply.</p>
            <div className="concern-grid">
              {OBSERVATIONS.map(o => (
                <button
                  key={o.value}
                  className={`concern-btn ${observations.includes(o.value) ? 'concern-btn--selected' : ''}`}
                  onClick={() => toggleObservation(o.value)}
                  disabled={loading}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <button
              className="btn btn--primary btn--full"
              style={{ marginTop: '1.5rem', fontSize: 'var(--text-lg)', padding: '1rem' }}
              disabled={observations.length === 0 || loading}
              onClick={handleSubmit}
            >
              {loading ? 'Finding the right resource...' : 'Find support →'}
            </button>
          </>
        )}

        {result && (
          <>
            {result.crisis && <CrisisBanner />}
            <ActionCard result={result} onReset={reset} />
            <div style={{ marginTop: '1.5rem', background: 'var(--clr-bg)', borderRadius: 'var(--radius-md)', padding: '1rem', border: '1px solid var(--clr-border)' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>How to share this:</p>
              <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
                You can share this page link, screenshot this card, or simply show them this screen.
                The Evolve Hub also welcomes drop-ins — you can go together if that feels easier.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
