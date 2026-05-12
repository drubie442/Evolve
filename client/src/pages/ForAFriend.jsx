import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTriageSelections } from '../context/TriageContext';
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
  const navigate = useNavigate();
  const { saveSelections } = useTriageSelections();
  const mode = searchParams.get('mode') || 'default';
  const modeClass = mode === 'elder' ? 'mode-elder' : '';

  const [observations, setObservations] = useState([]);

  function toggleObservation(value) {
    setObservations(prev =>
      prev.includes(value) ? prev.filter(o => o !== value) : [...prev, value]
    );
  }

  function handleSubmit() {
    if (observations.length === 0) return;
    const mappedConcerns = observations.map(v => v === 'withdrawn' ? 'loneliness' : v);
    const isCrisis = observations.includes('crisis');
    saveSelections({
      forSelf: false,
      concerns: mappedConcerns,
      urgency: isCrisis ? 'crisis' : 'struggling',
      ageGroup: 'adult',
      region: '',
    });
    navigate('/services');
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

        <>
            <p style={{ fontWeight: 700, marginBottom: '1rem' }}>What have you noticed? Select all that apply.</p>
            <div className="concern-grid">
              {OBSERVATIONS.map(o => (
                <button
                  key={o.value}
                  className={`concern-btn ${observations.includes(o.value) ? 'concern-btn--selected' : ''}`}
                  onClick={() => toggleObservation(o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <button
              className="btn btn--primary btn--full"
              style={{ marginTop: '1.5rem', fontSize: 'var(--text-lg)', padding: '1rem' }}
              disabled={observations.length === 0}
              onClick={handleSubmit}
            >
              Find support →
            </button>
          </>


      </div>
    </div>
  );
}
