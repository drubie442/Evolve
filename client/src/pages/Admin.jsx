import { useState, useEffect } from 'react';

const DEMO_PARTNERS = [
  { code: 'john-hunter-hospital', label: 'John Hunter Hospital ED' },
  { code: 'anz-bank', label: 'ANZ Bank Hunter' },
  { code: 'medibank', label: 'Medibank' },
  { code: 'newcastle-high', label: 'Newcastle High School' },
  { code: 'aged-care-demo', label: 'Community Aged Care' },
  { code: 'evolve-hub', label: 'Evolve Hub (direct)' },
];

export default function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [handoffStats, setHandoffStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [partnerRes, handoffRes] = await Promise.all([
        fetch('/api/partner/admin/analytics'),
        fetch('/api/handoff/stats'),
      ]);
      const partnerData = await partnerRes.json();
      const hData = await handoffRes.json();
      setData(partnerData);
      setHandoffStats(hData);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const totalScans = data
    ? Object.values(data.analytics).reduce((sum, v) => sum + (v.scans || 0), 0)
    : 0;

  const totalHandoffs = handoffStats?.total || 0;

  const totalCrisis = data
    ? Object.values(data.analytics).reduce((sum, v) => sum + (v.triagePaths?.crisis || 0), 0)
    : 0;

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--clr-primary-dark)' }}>
            📊 Admin Dashboard
          </h1>
          <button className="btn btn--secondary" onClick={loadData} disabled={loading}>
            {loading ? 'Refreshing...' : '↻ Refresh'}
          </button>
        </div>

        <p className="text-muted mb-6" style={{ fontSize: 'var(--text-sm)' }}>
          All data is aggregate only. No personal information is stored or displayed.
        </p>

        {/* Summary stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card__number">{totalScans}</div>
            <div className="stat-card__label">Total QR scans</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__number">{totalHandoffs}</div>
            <div className="stat-card__label">Staff warm handoffs</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__number" style={{ color: totalCrisis > 0 ? 'var(--clr-crisis)' : undefined }}>
              {totalCrisis}
            </div>
            <div className="stat-card__label">Crisis path activations</div>
          </div>
        </div>

        {/* Partner breakdown */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: 'var(--text-xl)' }}>Scans by partner channel</h2>
          {data && Object.keys(data.analytics).length === 0 && (
            <p className="text-muted">No scan data yet. Scans are recorded when a partner QR code is used.</p>
          )}
          {data && Object.entries(data.analytics).map(([code, stats]) => (
            <div key={code} className="card" style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <strong>{data.partnerNames[code] || code}</strong>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-muted)' }}>
                  Crisis: {stats.triagePaths?.crisis || 0} &nbsp;|&nbsp;
                  Struggling: {stats.triagePaths?.struggling || 0} &nbsp;|&nbsp;
                  Learn more: {stats.triagePaths?.learn || 0}
                </div>
              </div>
              <div style={{ fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--clr-primary-dark)' }}>
                {stats.scans} scans
              </div>
            </div>
          ))}
        </div>

        {/* Handoff concern breakdown */}
        {handoffStats && Object.keys(handoffStats.byConcern || {}).length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: 'var(--text-xl)' }}>Handoff concerns (top categories)</h2>
            <div className="stats-grid">
              {Object.entries(handoffStats.byConcern)
                .sort((a, b) => b[1] - a[1])
                .map(([concern, count]) => (
                  <div key={concern} className="stat-card">
                    <div className="stat-card__number">{count}</div>
                    <div className="stat-card__label">{concern}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Demo QR codes */}
        <div>
          <h2 style={{ fontWeight: 800, marginBottom: '1rem', fontSize: 'var(--text-xl)' }}>Demo partner QR links</h2>
          <p className="text-muted mb-4" style={{ fontSize: 'var(--text-sm)' }}>
            Each partner has a unique URL. Scanning it records a scan against that partner and loads the appropriate mode.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {DEMO_PARTNERS.map(p => (
              <div key={p.code} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', padding: '0.75rem 1rem' }}>
                <span style={{ fontWeight: 600 }}>{p.label}</span>
                <a
                  href={`/?partner=${p.code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--secondary"
                  style={{ fontSize: 'var(--text-sm)', padding: '0.4rem 1rem' }}
                >
                  Open link →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
