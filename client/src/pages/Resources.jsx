import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ResourceCard from '../components/ResourceCard';

const CONCERN_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'crisis', label: '🆘 Crisis' },
  { value: 'anxiety', label: '😰 Anxiety' },
  { value: 'stress', label: '😤 Stress' },
  { value: 'low-mood', label: '😔 Low mood' },
  { value: 'loneliness', label: '😶 Loneliness' },
  { value: 'relationships', label: '💔 Relationships' },
  { value: 'grief', label: '🕊️ Grief' },
];

const AGE_FILTERS = [
  { value: 'any', label: 'All ages' },
  { value: 'youth', label: 'Young people' },
  { value: 'adult', label: 'Adults' },
  { value: 'elder', label: 'Older adults' },
];

export default function Resources() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'default';
  const modeClass = mode === 'elder' ? 'mode-elder' : '';

  const [concern, setConcern] = useState('all');
  const [ageGroup, setAgeGroup] = useState(
    mode === 'youth' ? 'youth' : mode === 'elder' ? 'elder' : 'any'
  );
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (concern !== 'all') params.set('concern', concern);
    if (ageGroup !== 'any') params.set('ageGroup', ageGroup);
    fetch(`/api/resources?${params}`)
      .then(r => r.json())
      .then(data => setResources(data))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, [concern, ageGroup]);

  return (
    <div className={`page ${modeClass}`}>
      <div className="container">
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--clr-primary-dark)', marginBottom: '0.5rem' }}>
          Find Support
        </h1>
        <p className="text-muted mb-6">Free and low-cost mental health services available in the Hunter region.</p>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '0.5rem', color: 'var(--clr-text-muted)' }}>FILTER BY CONCERN</p>
          <div className="filter-tabs">
            {CONCERN_FILTERS.map(f => (
              <button
                key={f.value}
                className={`filter-tab ${concern === f.value ? 'filter-tab--active' : ''}`}
                onClick={() => setConcern(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '0.5rem', color: 'var(--clr-text-muted)' }}>FILTER BY AGE GROUP</p>
          <div className="filter-tabs">
            {AGE_FILTERS.map(f => (
              <button
                key={f.value}
                className={`filter-tab ${ageGroup === f.value ? 'filter-tab--active' : ''}`}
                onClick={() => setAgeGroup(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="text-muted">Loading resources...</p>}

        {!loading && resources.length === 0 && (
          <p className="text-muted">No resources found for this filter combination. Try widening your search.</p>
        )}

        <div className="resource-grid">
          {resources.map(r => <ResourceCard key={r.id} resource={r} />)}
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--clr-border)', textAlign: 'center' }}>
          <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
            Need more personalised guidance?{' '}
            <a href="/triage">Answer 3 quick questions →</a>
          </p>
        </div>
      </div>
    </div>
  );
}
