import { useState } from 'react';
import { authHeaders } from '../pages/referral/authUtil';

const URGENCY_LABELS = { crisis: 'Crisis', high: 'High', medium: 'Medium', low: 'Low' };
const STATUS_LABELS = { open: 'Open', 'in-progress': 'In Progress', awaiting: 'Awaiting', closed: 'Closed' };

function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-AU', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export default function TicketCard({ ticket, currentWorker, onUpdate }) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [draftNotes, setDraftNotes] = useState(ticket.workerNotes || '');
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const isMyTicket = ticket.assignedTo === currentWorker?.id;

  async function apiPatch(path, body) {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/referral/tickets/${ticket.id}/${path}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) onUpdate(data);
    } finally {
      setActionLoading(false);
    }
  }

  async function saveNotes() {
    setSaving(true);
    try {
      const res = await fetch(`/api/referral/tickets/${ticket.id}/notes`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ workerNotes: draftNotes }),
      });
      const data = await res.json();
      if (res.ok) onUpdate(data);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={`ticket-card ticket-card--${ticket.urgency}`}>
      <div className="ticket-card__header">
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span className={`badge ticket-badge--urgency-${ticket.urgency}`}>
            {URGENCY_LABELS[ticket.urgency]}
          </span>
          <span className={`badge ticket-badge--status-${ticket.status}`}>
            {STATUS_LABELS[ticket.status]}
          </span>
          <span className="badge" style={{ background: '#f0f4f8', color: '#4a6b7a' }}>
            {ticket.type === 'staff' ? 'Staff intake' : 'Self-referral'}
          </span>
        </div>
        <span className="ticket-card__id">#{ticket.id.slice(0, 8).toUpperCase()}</span>
      </div>

      <h3 className="ticket-card__name">{ticket.clientName}</h3>
      <p className="ticket-card__service">{ticket.serviceType}</p>

      {(ticket.clientPhone || ticket.clientEmail) && (
        <div className="ticket-card__contact">
          {ticket.clientPhone && <span>📞 {ticket.clientPhone}</span>}
          {ticket.clientEmail && <span>✉️ {ticket.clientEmail}</span>}
        </div>
      )}

      {ticket.concern && (
        <p className="ticket-card__concern"><strong>Concern:</strong> {ticket.concern}</p>
      )}

      {ticket.notes && (
        <p className="ticket-card__notes">{ticket.notes}</p>
      )}

      {ticket.assignedTo && (
        <p className="ticket-card__assigned">
          Assigned to <strong>{ticket.assignedWorkerName}</strong>
          {ticket.claimedAt && <span className="text-muted"> · {fmtDate(ticket.claimedAt)}</span>}
        </p>
      )}

      <p className="ticket-card__meta text-muted">
        Created {fmtDate(ticket.createdAt)}
        {ticket.closedAt && <span> · Closed {fmtDate(ticket.closedAt)}</span>}
      </p>

      {ticket.status !== 'closed' && (
        <div className="ticket-card__actions">
          {ticket.status === 'open' && !ticket.assignedTo && (
            <button
              className="btn btn--primary"
              onClick={() => apiPatch('claim', {})}
              disabled={actionLoading}
            >
              Take this job
            </button>
          )}

          {ticket.status === 'in-progress' && isMyTicket && (
            <>
              <button
                className="btn btn--secondary"
                onClick={() => apiPatch('status', { status: 'awaiting' })}
                disabled={actionLoading}
              >
                Awaiting client
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => apiPatch('status', { status: 'closed' })}
                disabled={actionLoading}
              >
                Close
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => apiPatch('unclaim', {})}
                disabled={actionLoading}
              >
                Release
              </button>
            </>
          )}

          {ticket.status === 'awaiting' && isMyTicket && (
            <>
              <button
                className="btn btn--primary"
                onClick={() => apiPatch('status', { status: 'in-progress' })}
                disabled={actionLoading}
              >
                Resume
              </button>
              <button
                className="btn btn--secondary"
                onClick={() => apiPatch('status', { status: 'closed' })}
                disabled={actionLoading}
              >
                Close
              </button>
            </>
          )}

          {(isMyTicket || ticket.status === 'in-progress') && isMyTicket && (
            <button
              className="btn btn--secondary"
              onClick={() => setNotesOpen(o => !o)}
            >
              {notesOpen ? 'Hide notes' : 'Add notes'}
            </button>
          )}
        </div>
      )}

      {notesOpen && (
        <div className="ticket-card__note-editor">
          <textarea
            rows={3}
            placeholder="Worker notes (internal only)…"
            value={draftNotes}
            onChange={e => setDraftNotes(e.target.value)}
          />
          <button
            className="btn btn--primary"
            onClick={saveNotes}
            disabled={saving}
            style={{ marginTop: '0.5rem' }}
          >
            {saving ? 'Saving…' : 'Save notes'}
          </button>
        </div>
      )}

      {ticket.workerNotes && !notesOpen && (
        <div className="ticket-card__saved-notes">
          <strong>Worker notes:</strong> {ticket.workerNotes}
        </div>
      )}
    </div>
  );
}
