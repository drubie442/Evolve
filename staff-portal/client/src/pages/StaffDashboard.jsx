import { useState, useEffect, useCallback } from 'react';
import { authHeaders } from '../utils/auth';
import TicketCard from '../components/TicketCard';

const TABS = [
  { value: 'all',         label: 'All'         },
  { value: 'open',        label: 'Open'        },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'closed',      label: 'Closed'      },
];

const URGENCY_ORDER = { crisis: 0, high: 1, medium: 2, low: 3 };

export default function StaffDashboard() {
  const [tickets, setTickets] = useState([]);
  const [tab, setTab] = useState('open');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const res = await fetch('/api/tickets', { headers: authHeaders() });
      if (!res.ok) { setError('Failed to load tickets.'); return; }
      setTickets(await res.json());
    } catch {
      setError('Could not connect to server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleUpdated(updated) {
    setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
  }

  const counts = TABS.reduce((acc, t) => {
    acc[t.value] = t.value === 'all'
      ? tickets.length
      : tickets.filter(tk => tk.status === t.value).length;
    return acc;
  }, {});

  const visible = (tab === 'all' ? tickets : tickets.filter(t => t.status === tab))
    .slice()
    .sort((a, b) => {
      if (a.status === 'closed' && b.status !== 'closed') return 1;
      if (b.status === 'closed' && a.status !== 'closed') return -1;
      return (URGENCY_ORDER[a.urgency] ?? 9) - (URGENCY_ORDER[b.urgency] ?? 9);
    });

  return (
    <div className="page">
      <div className="page-inner">
        <header className="dashboard-header">
          <div>
            <h1>Referral Ticket Queue</h1>
            <p className="text-muted">Review and process patient referrals submitted by carers</p>
          </div>
          <button className="btn btn-ghost" onClick={load}>↻ Refresh</button>
        </header>

        <div className="stats-row">
          {[
            { label: 'Total', count: tickets.length, color: '' },
            { label: 'Open',        count: counts.open,         color: 'stat--open'        },
            { label: 'In Progress', count: counts['in-progress'], color: 'stat--in-progress' },
            { label: 'Closed',      count: counts.closed,        color: 'stat--closed'       },
          ].map(s => (
            <div key={s.label} className={`stat-box ${s.color}`}>
              <span className="stat-box__number">{s.count}</span>
              <span className="stat-box__label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="filter-tabs">
          {TABS.map(t => (
            <button
              key={t.value}
              className={`filter-tab ${tab === t.value ? 'filter-tab--active' : ''}`}
              onClick={() => setTab(t.value)}
            >
              {t.label}
              {counts[t.value] > 0 && <span className="tab-count">{counts[t.value]}</span>}
            </button>
          ))}
        </div>

        {loading && <p className="text-muted">Loading tickets…</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && visible.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon">{tab === 'open' ? '🎉' : '📭'}</div>
            <p>{tab === 'open' ? 'No open tickets — all caught up!' : 'No tickets in this category.'}</p>
          </div>
        )}

        <div className="ticket-list">
          {visible.map(t => (
            <TicketCard key={t.id} ticket={t} isStaffView={true} onUpdated={handleUpdated} />
          ))}
        </div>
      </div>
    </div>
  );
}
