import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { authHeaders, getUser, setAuth, getToken } from '../utils/auth';
import GamificationCard from '../components/GamificationCard';
import TicketCard from '../components/TicketCard';

const STATUS_LABEL = { open: 'Open', 'in-progress': 'In Progress', closed: 'Closed' };

export default function CarerDashboard() {
  const [profile, setProfile] = useState(getUser());
  const [tickets, setTickets] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [ticketsRes, meRes, lbRes] = await Promise.all([
        fetch('/api/tickets', { headers: authHeaders() }),
        fetch('/api/auth/me',  { headers: authHeaders() }),
        fetch('/api/orgs/leaderboard'),
      ]);
      if (ticketsRes.ok) setTickets(await ticketsRes.json());
      if (meRes.ok) {
        const me = await meRes.json();
        setProfile(me);
        setAuth(getToken(), me);
      }
      if (lbRes.ok) setLeaderboard(await lbRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const visible = tab === 'all' ? tickets : tickets.filter(t => t.status === tab);

  function handleUpdated(updated) {
    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
  }

  return (
    <div className="page">
      <div className="page-inner">
        <header className="dashboard-header">
          <div>
            <h1>Welcome back, {profile?.name}!</h1>
            <p className="text-muted">{profile?.specialty} · {profile?.orgName}</p>
          </div>
          <Link to="/carer/submit" className="btn btn-primary">
            + Submit Ticket
          </Link>
        </header>

        <div className="dashboard-grid">
          {/* Left column */}
          <div className="dashboard-main">
            <div className="section-header">
              <h2>My Referrals</h2>
              <div className="filter-tabs">
                {['all', 'open', 'in-progress', 'closed'].map(s => (
                  <button
                    key={s}
                    className={`filter-tab ${tab === s ? 'filter-tab--active' : ''}`}
                    onClick={() => setTab(s)}
                  >
                    {s === 'all' ? 'All' : STATUS_LABEL[s]}
                    <span className="tab-count">
                      {s === 'all' ? tickets.length : tickets.filter(t => t.status === s).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {loading && <p className="text-muted">Loading…</p>}

            {!loading && visible.length === 0 && (
              <div className="empty-state">
                <div className="empty-state__icon">📋</div>
                <p>
                  {tab === 'all'
                    ? <>No referrals yet. <Link to="/carer/submit">Submit your first ticket</Link> to get started!</>
                    : `No ${STATUS_LABEL[tab] || tab} tickets.`}
                </p>
              </div>
            )}

            <div className="ticket-list">
              {visible.map(t => (
                <TicketCard key={t.id} ticket={t} isStaffView={false} onUpdated={handleUpdated} />
              ))}
            </div>
          </div>

          {/* Right column */}
          <aside className="dashboard-sidebar">
            {profile && <GamificationCard profile={profile} />}

            {leaderboard.length > 0 && (
              <div className="leaderboard-card">
                <h3 className="leaderboard-card__title">🏆 Top Carers</h3>
                <ol className="leaderboard-list">
                  {leaderboard.map(entry => (
                    <li key={entry.rank} className={`leaderboard-item ${entry.name === profile?.name ? 'leaderboard-item--me' : ''}`}>
                      <span className="leaderboard-rank">
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                      </span>
                      <div className="leaderboard-info">
                        <span className="leaderboard-name">{entry.name}</span>
                        <span className="leaderboard-org text-muted">{entry.orgName}</span>
                      </div>
                      <span className="leaderboard-pts">{entry.points} pts</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
