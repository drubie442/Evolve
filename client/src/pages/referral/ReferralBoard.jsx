import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isLoggedIn, getWorker, clearAuth, authHeaders } from './authUtil';
import TicketCard from '../../components/TicketCard';

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'awaiting', label: 'Awaiting' },
  { value: 'closed', label: 'Closed' },
];

export default function ReferralBoard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentWorker = getWorker();

  const loadTickets = useCallback(async () => {
    if (!isLoggedIn()) {
      navigate('/referral/login');
      return;
    }
    setError('');
    try {
      const res = await fetch('/api/referral/tickets', { headers: authHeaders() });
      if (res.status === 401) {
        clearAuth();
        navigate('/referral/login');
        return;
      }
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch {
      setError('Could not load tickets. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/referral/login');
      return;
    }
    loadTickets();
  }, [navigate, loadTickets]);

  function handleUpdate(updatedTicket) {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  }

  function logout() {
    clearAuth();
    navigate('/referral/login');
  }

  const counts = TABS.reduce((acc, t) => {
    acc[t.value] = t.value === 'all'
      ? tickets.length
      : tickets.filter(tk => tk.status === t.value).length;
    return acc;
  }, {});

  const visible = tab === 'all' ? tickets : tickets.filter(t => t.status === tab);

  const urgencyOrder = { crisis: 0, high: 1, medium: 2, low: 3 };
  const sorted = [...visible].sort((a, b) => {
    if (a.status === 'closed' && b.status !== 'closed') return 1;
    if (b.status === 'closed' && a.status !== 'closed') return -1;
    return (urgencyOrder[a.urgency] ?? 9) - (urgencyOrder[b.urgency] ?? 9);
  });

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="ticket-board__header">
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--clr-primary-dark)' }}>
              Referral Board
            </h1>
            {currentWorker && (
              <p className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>
                Signed in as <strong>{currentWorker.name}</strong>
                {currentWorker.specialty && <span> · {currentWorker.specialty}</span>}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/referral/staff" className="btn btn--primary">
              + Staff intake
            </Link>
            <button className="btn btn--secondary" onClick={loadTickets}>
              Refresh
            </button>
            <button className="btn btn--secondary" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>

        <div className="filter-tabs" style={{ marginBottom: '1.5rem' }}>
          {TABS.map(t => (
            <button
              key={t.value}
              className={`filter-tab ${tab === t.value ? 'filter-tab--active' : ''}`}
              onClick={() => setTab(t.value)}
            >
              {t.label}
              {counts[t.value] > 0 && (
                <span className="ticket-tab-count">{counts[t.value]}</span>
              )}
            </button>
          ))}
        </div>

        {loading && (
          <p className="text-muted text-center" style={{ padding: '3rem 0' }}>Loading tickets…</p>
        )}

        {error && (
          <p style={{ color: 'var(--clr-crisis)', fontWeight: 600, marginBottom: '1rem' }}>{error}</p>
        )}

        {!loading && sorted.length === 0 && (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
              {tab === 'open' ? '🎉' : '📭'}
            </div>
            <p className="text-muted">
              {tab === 'open' ? 'No open tickets — all caught up!' : `No ${tab === 'all' ? '' : tab + ' '}tickets.`}
            </p>
          </div>
        )}

        <div className="ticket-grid">
          {sorted.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              currentWorker={currentWorker}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
