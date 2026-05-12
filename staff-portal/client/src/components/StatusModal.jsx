import { useState } from 'react';
import { authHeaders } from '../utils/auth';

const STATUS_OPTIONS = [
  { value: 'in-progress', label: 'In Progress', desc: 'Evolve has contacted the patient and is working on this.' },
  { value: 'closed',      label: 'Closed',      desc: 'This referral has been resolved and closed.' },
];

export default function StatusModal({ ticket, onClose, onUpdated }) {
  const [status, setStatus]   = useState('in-progress');
  const [reason, setReason]   = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!reason.trim()) { setError('A reason is required.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status, reason }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Update failed.'); return; }
      onUpdated(data);
      onClose();
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Update ticket status</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="modal-sub">Patient: <strong>{ticket.patientName}</strong></p>

        <form onSubmit={submit}>
          <fieldset className="modal-status-group">
            {STATUS_OPTIONS.map(opt => (
              <label key={opt.value} className={`status-radio ${status === opt.value ? 'status-radio--selected' : ''}`}>
                <input
                  type="radio"
                  name="status"
                  value={opt.value}
                  checked={status === opt.value}
                  onChange={() => setStatus(opt.value)}
                />
                <span className="status-radio__label">{opt.label}</span>
                <span className="status-radio__desc">{opt.desc}</span>
              </label>
            ))}
          </fieldset>

          <div className="modal-field">
            <label htmlFor="reason">Reason for change <span className="required">*</span></label>
            <textarea
              id="reason"
              rows={3}
              placeholder="e.g. Patient contacted, appointment scheduled for 15 May…"
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
