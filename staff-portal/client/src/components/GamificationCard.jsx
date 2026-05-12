export default function GamificationCard({ profile }) {
  const { points, level, nextLevel, badges, ticketCount } = profile;
  const progress = nextLevel
    ? Math.round(((points - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100)
    : 100;

  return (
    <div className="gamification-card">
      <div className="gamification-card__header">
        <div>
          <div className="gamification-card__level">
            <span className="level-icon">{level.icon}</span>
            <span className="level-name">{level.name}</span>
          </div>
          <p className="gamification-card__sub">{ticketCount} ticket{ticketCount !== 1 ? 's' : ''} submitted</p>
        </div>
        <div className="gamification-card__points">
          <span className="points-number">{points}</span>
          <span className="points-label">points</span>
        </div>
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>
        {nextLevel ? (
          <p className="progress-label">{nextLevel.minPoints - points} pts to {nextLevel.icon} {nextLevel.name}</p>
        ) : (
          <p className="progress-label">Max level reached! 🏅</p>
        )}
      </div>

      {badges.length > 0 && (
        <div className="badges-section">
          <p className="badges-title">Badges earned</p>
          <div className="badges-grid">
            {badges.map(b => (
              <div key={b.id} className="badge-chip" title={b.desc}>
                <span className="badge-chip__icon">{b.icon}</span>
                <span className="badge-chip__name">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {badges.length === 0 && (
        <p className="badges-empty">Submit your first ticket to earn your first badge 🌱</p>
      )}
    </div>
  );
}
