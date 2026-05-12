function typeBadgeClass(type) {
  const map = {
    'In-person': 'badge--in-person',
    'Phone': 'badge--phone',
    'Online': 'badge--online',
    'Community': 'badge--community',
  };
  return map[type] || 'badge--online';
}

export default function ResourceCard({ resource }) {
  return (
    <div className={`card ${resource.crisis ? 'card--crisis' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--clr-text)' }}>{resource.name}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {resource.crisis && <span className="badge badge--crisis">Crisis</span>}
          <span className={`badge ${typeBadgeClass(resource.type)}`}>{resource.type}</span>
        </div>
      </div>
      <p style={{ color: 'var(--clr-text-muted)', marginBottom: '0.75rem' }}>{resource.description}</p>
      {resource.availability && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-muted)', marginBottom: '0.75rem' }}>
          🕐 {resource.availability}
        </p>
      )}
      {resource.address && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-text-muted)', marginBottom: '0.75rem' }}>
          📍 {resource.address}
        </p>
      )}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {resource.phone && (
          <a className="btn btn--primary" href={`tel:${resource.phone.replace(/\s/g, '')}`}>
            📞 {resource.phone}
          </a>
        )}
        {resource.website && (
          <a className="btn btn--secondary" href={resource.website} target="_blank" rel="noopener noreferrer">
            🌐 Visit Website
          </a>
        )}
      </div>
    </div>
  );
}
