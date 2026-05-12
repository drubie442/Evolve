import { Link } from 'react-router-dom';

export default function ActionCard({ result, onReset }) {
  if (!result) return null;
  const { primary, secondary, message, crisis } = result;

  if (crisis) {
    return (
      <div className="action-card" style={{ borderColor: 'var(--clr-crisis-border)', background: 'var(--clr-crisis-bg)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <div className="action-card__name" style={{ color: 'var(--clr-crisis)' }}>Help is available right now</div>
        <p className="action-card__desc">{message}</p>
        <div className="action-card__contacts">
          {primary?.phone && (
            <a className="btn btn--crisis btn--full" href={`tel:${primary.phone.replace(/\s/g, '')}`}>
              📞 {primary.phone} — {primary.name}
            </a>
          )}
          {secondary?.phone && (
            <a className="btn btn--crisis btn--full" href={`tel:${secondary.phone.replace(/\s/g, '')}`}>
              📞 {secondary.phone} — {secondary.name}
            </a>
          )}
        </div>
        <button className="btn btn--secondary" onClick={onReset}>← Start again</button>
      </div>
    );
  }

  return (
    <div className="action-card">
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
      <p className="text-muted mb-4">{message}</p>
      <div className="action-card__name">{primary.name}</div>
      <p className="action-card__desc">{primary.description}</p>
      {primary.availability && (
        <p className="text-muted mb-4" style={{ fontSize: 'var(--text-sm)' }}>🕐 {primary.availability}</p>
      )}
      <div className="action-card__contacts">
        <a className="btn btn--primary btn--full btn--large" href="tel:0240961100">
          📞 Call Evolve Hub — 02 4096 1100
        </a>
        {primary.phone && (
          <a className="btn btn--primary btn--full" href={`tel:${primary.phone.replace(/\s/g, '')}`}>
            📞 Call {primary.phone}
          </a>
        )}
        {!primary.phone && primary.address && (
          <a className="btn btn--secondary btn--full" href={`https://maps.google.com/?q=${encodeURIComponent(primary.address)}`} target="_blank" rel="noopener noreferrer">
            📍 Get Directions — {primary.address}
          </a>
        )}
        {primary.website && (
          <a className="btn btn--secondary btn--full" href={primary.website} target="_blank" rel="noopener noreferrer">
            🌐 Visit Website
          </a>
        )}
      </div>
      {secondary && (
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--clr-border)' }}>
          <p className="text-muted" style={{ fontSize: 'var(--text-sm)', marginBottom: '0.75rem' }}>Also available:</p>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{secondary.name}</div>
          <p className="text-muted" style={{ fontSize: 'var(--text-sm)', marginBottom: '0.75rem' }}>{secondary.description}</p>
          {secondary.phone && (
            <a className="btn btn--secondary" href={`tel:${secondary.phone.replace(/\s/g, '')}`}>
              📞 {secondary.phone}
            </a>
          )}
        </div>
      )}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn--secondary" onClick={onReset}>← Start again</button>
        <Link className="btn btn--secondary" to="/resources">Browse all resources</Link>
      </div>
    </div>
  );
}
