import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import CrisisBanner from '../components/CrisisBanner';
import ActionCard from '../components/ActionCard';

const CONCERNS = [
  { value: 'anxiety', label: '😰 Anxiety' },
  { value: 'stress', label: '😤 Stress' },
  { value: 'low-mood', label: '😔 Low mood' },
  { value: 'loneliness', label: '😶 Loneliness' },
  { value: 'relationships', label: '💔 Relationships' },
  { value: 'grief', label: '🕊️ Grief & loss' },
  { value: 'crisis', label: '🆘 Crisis' },
  { value: 'general', label: '❓ Not sure' },
];

const URGENCY = [
  { value: 'today', label: 'I need help today' },
  { value: 'days', label: 'In the next few days' },
  { value: 'prepared', label: 'I want to be prepared' },
];

export default function Triage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'default';
  const jumpToCrisis = searchParams.get('step') === 'crisis';
  const modeClass = mode === 'elder' ? 'mode-elder' : '';

  const [step, setStep] = useState(jumpToCrisis ? 3 : 1);
  const [forSelf, setForSelf] = useState(true);
  const [concerns, setConcerns] = useState([]);
  const [urgency, setUrgency] = useState(jumpToCrisis ? 'today' : '');
  const [ageGroup, setAgeGroup] = useState(
    mode === 'youth' ? 'youth' : mode === 'elder' ? 'elder' : 'adult'
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jumpToCrisis) {
      submitTriage(['crisis'], 'today');
    }
  }, []);

  const totalSteps = 3;

  async function submitTriage(overrideConcerns, overrideUrgency) {
    setLoading(true);
    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forSelf,
          concerns: overrideConcerns || (concerns.length ? concerns : ['general']),
          urgency: overrideUrgency || urgency,
          ageGroup,
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

  function toggleConcern(value) {
    setConcerns(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    );
  }

  function reset() {
    setStep(1);
    setForSelf(true);
    setConcerns([]);
    setUrgency('');
    setResult(null);
  }

  if (result) {
    return (
      <div className={`page ${modeClass}`}>
        <div className="container--narrow">
          {result.crisis && <CrisisBanner />}
          <ActionCard result={result} onReset={reset} />
        </div>
      </div>
    );
  }

  return (
    <div className={`page ${modeClass}`}>
      <div className="container--narrow">
        <Link to="/" className="text-muted" style={{ fontSize: 'var(--text-sm)', display: 'block', marginBottom: '1.5rem' }}>← Back</Link>

        <div className="steps">
          {[1, 2, 3].map(s => (
            <div key={s} className={`step ${s === step ? 'step--active' : s < step ? 'step--done' : ''}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '0.5rem' }}>Who is this for?</h2>
            <p className="text-muted mb-6">Your privacy is respected — no account needed.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                className={`concern-btn ${forSelf ? 'concern-btn--selected' : ''}`}
                style={{ fontSize: 'var(--text-lg)', padding: '1.25rem' }}
                onClick={() => { setForSelf(true); setStep(2); }}
              >
                🙋 For me
              </button>
              <button
                className={`concern-btn ${!forSelf ? 'concern-btn--selected' : ''}`}
                style={{ fontSize: 'var(--text-lg)', padding: '1.25rem' }}
                onClick={() => { setForSelf(false); setStep(2); }}
              >
                🤝 For someone I care about
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '0.5rem' }}>
              What's going on?
            </h2>
            <p className="text-muted mb-6">Select everything that applies.</p>
            <div className="concern-grid">
              {CONCERNS.map(c => (
                <button
                  key={c.value}
                  className={`concern-btn ${concerns.includes(c.value) ? 'concern-btn--selected' : ''}`}
                  onClick={() => toggleConcern(c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <button
              className="btn btn--primary btn--full"
              style={{ marginTop: '1.5rem', fontSize: 'var(--text-lg)', padding: '1rem' }}
              disabled={concerns.length === 0}
              onClick={() => setStep(3)}
            >
              Next →
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: '0.5rem' }}>How urgent does it feel?</h2>
            <p className="text-muted mb-6">There are no wrong answers.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {URGENCY.map(u => (
                <button
                  key={u.value}
                  className={`concern-btn ${urgency === u.value ? 'concern-btn--selected' : ''}`}
                  style={{ fontSize: 'var(--text-lg)', padding: '1.25rem' }}
                  onClick={() => { setUrgency(u.value); submitTriage(concerns, u.value); }}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center mt-8" style={{ color: 'var(--clr-text-muted)' }}>
            Finding the right support for you...
          </div>
        )}
      </div>
    </div>
  );
}
