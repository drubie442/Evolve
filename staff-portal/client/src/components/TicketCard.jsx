import { useState } from 'react';
import StatusModal from './StatusModal';

const URGENCY_LABEL = { crisis: 'Crisis', high: 'High', medium: 'Medium', low: 'Low' };
const STATUS_LABEL  = { open: 'Open', 'in-progress': 'In Progress', closed: 'Closed' };

function fmtDate(iso) {
  return new Date(iso).toLocaleString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function TicketCard({ ticket, isStaffView, onUpdated }) {
  const [showModal, setShowModal]     = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const latest = ticket.statusHistory.at(-1);

  return (
    <>
      <div className={`ticket-card urgency-${ticket.urgency}`}>
        <div className="ticket-card__top">
          <div className="ticket-badges">
            <span className={`badge urgency-badge urgency-${ticket.urgency}`}>
              {URGENCY_LABEL[ticket.urgency]}
            </span>
            <span className={`badge status-badge status-${ticket.status}`}>
              {STATUS_LABEL[ticket.status]}
            </span>
          </div>
          <span className="ticket-id">#{ticket.id.slice(0, 8).toUpperCase()}</span>
        </div>

        <h3 className="ticket-patient">{ticket.patientName}</h3>

        <div className="ticket-contact">
          {ticket.patientPhone && <span>📞 {ticket.patientPhone}</span>}
          {ticket.patientEmail && <span>✉️ {ticket.patientEmail}</span>}
        </div>

        <div className="ticket-concern">
          <span className="ticket-concern__label">Concern</span>
          <p>{ticket.concern}</p>
        </div>

        <div className="ticket-meta">
          <span>Referred by <strong>{ticket.carerName}</strong> · {ticket.carerOrg}</span>
          <span>{fmtDate(ticket.createdAt)}</span>
        </div>

        {latest && (
          <div className="ticket-status-note">
            <span className={`status-dot status-${ticket.status}`} />
            <span>{latest.reason}</span>
            <span className="ticket-status-note__by">— {latest.changedBy}, {fmtDate(latest.changedAt)}</span>
          </div>
        )}

        <div className="ticket-card__footer">
          {ticket.statusHistory.length > 1 && (
            <button className="btn btn-ghost btn-sm" onClick={() => setShowHistory(h => !h)}>
              {showHistory ? 'Hide history' : `History (${ticket.statusHistory.length})`}
            </button>
          )}
          {isStaffView && ticket.status !== 'closed' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
              Update status
            </button>
          )}
        </div>

        {showHistory && (
          <ol className="status-history">
            {[...ticket.statusHistory].reverse().map((h, i) => (
              <li key={i} className="status-history__item">
                <span className={`status-dot status-${h.status}`} />
                <div>
                  <strong>{STATUS_LABEL[h.status]}</strong>
                  <span className="text-muted"> · {fmtDate(h.changedAt)} · {h.changedBy}</span>
                  <p>{h.reason}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {showModal && (
        <StatusModal
          ticket={ticket}
          onClose={() => setShowModal(false)}
          onUpdated={updated => { onUpdated(updated); setShowModal(false); }}
        />
      )}
    </>
  );
}
