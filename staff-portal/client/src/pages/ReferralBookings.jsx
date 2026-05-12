import { useCallback, useEffect, useState } from "react";
import { authHeaders } from "../utils/auth";

const STATUS_LABELS = {
  pending: { label: "Pending", cls: "badge--open" },
  confirmed: { label: "Confirmed", cls: "badge--in-progress" },
  cancelled: { label: "Cancelled", cls: "badge--closed" },
};

const TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BookingRow({ booking, onUpdated }) {
  const [busy, setBusy] = useState(false);
  const badge = STATUS_LABELS[booking.status] || {
    label: booking.status,
    cls: "",
  };

  async function setStatus(status) {
    setBusy(true);
    try {
      const res = await fetch(`/api/refer/bookings/${booking.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status }),
      });
      if (res.ok) onUpdated(await res.json());
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ticket-card">
      <div className="ticket-card__header">
        <div>
          <span className="ticket-card__patient">{booking.patientName}</span>
          <span className={`badge ${badge.cls}`}>{badge.label}</span>
        </div>
        <span className="ticket-card__time">
          {formatDate(booking.bookedAt)}
        </span>
      </div>

      <div className="ticket-card__meta">
        <span>📋 {booking.serviceCategory}</span>
        <span>🏥 {booking.serviceName}</span>
        {booking.servicePhone && <span>📞 {booking.servicePhone}</span>}
        {booking.serviceEmail && <span>✉ {booking.serviceEmail}</span>}
      </div>

      <div className="ticket-card__meta" style={{ marginTop: "0.25rem" }}>
        <span>🎂 DOB: {booking.patientDob}</span>
        {booking.patientPhone && <span>📱 {booking.patientPhone}</span>}
        {booking.patientEmail && <span>📧 {booking.patientEmail}</span>}
      </div>

      {booking.patientNotes && (
        <p className="ticket-card__concern">{booking.patientNotes}</p>
      )}

      {booking.status === "pending" && (
        <div className="ticket-card__actions">
          <button
            className="btn btn-primary btn-sm"
            disabled={busy}
            onClick={() => setStatus("confirmed")}
          >
            Confirm
          </button>
          <button
            className="btn btn-ghost btn-sm"
            disabled={busy}
            onClick={() => setStatus("cancelled")}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default function ReferralBookings() {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/refer/bookings", {
        headers: authHeaders(),
      });
      if (!res.ok) {
        setError("Failed to load bookings.");
        return;
      }
      setBookings(await res.json());
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleUpdated(updated) {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }

  const counts = TABS.reduce((acc, t) => {
    acc[t.value] =
      t.value === "all"
        ? bookings.length
        : bookings.filter((b) => b.status === t.value).length;
    return acc;
  }, {});

  const visible =
    tab === "all" ? bookings : bookings.filter((b) => b.status === tab);

  return (
    <div className="page">
      <div className="page-inner">
        <header className="dashboard-header">
          <div>
            <h1>Auto-Referral Bookings</h1>
            <p className="text-muted">
              Bookings created automatically from wearable devices and QR codes
            </p>
          </div>
          <button className="btn btn-ghost" onClick={load}>
            ↻ Refresh
          </button>
        </header>

        <div className="stats-row">
          {[
            { label: "Total", count: bookings.length, color: "" },
            { label: "Pending", count: counts.pending, color: "stat--open" },
            {
              label: "Confirmed",
              count: counts.confirmed,
              color: "stat--in-progress",
            },
            {
              label: "Cancelled",
              count: counts.cancelled,
              color: "stat--closed",
            },
          ].map((s) => (
            <div key={s.label} className={`stat-box ${s.color}`}>
              <span className="stat-box__number">{s.count}</span>
              <span className="stat-box__label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="filter-tabs">
          {TABS.map((t) => (
            <button
              key={t.value}
              className={`filter-tab ${tab === t.value ? "filter-tab--active" : ""}`}
              onClick={() => setTab(t.value)}
            >
              {t.label}
              <span className="filter-tab__count">{counts[t.value]}</span>
            </button>
          ))}
        </div>

        {loading && <p className="text-muted">Loading…</p>}
        {error && <p className="error-msg">{error}</p>}

        {!loading && !error && visible.length === 0 && (
          <p className="text-muted">No bookings in this category.</p>
        )}

        <div className="ticket-list">
          {visible.map((b) => (
            <BookingRow key={b.id} booking={b} onUpdated={handleUpdated} />
          ))}
        </div>
      </div>
    </div>
  );
}
