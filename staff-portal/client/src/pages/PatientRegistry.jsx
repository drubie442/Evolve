import { useCallback, useEffect, useState } from "react";
import { authHeaders } from "../utils/auth";

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  function handleClick() {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={handleClick}
      style={{ minWidth: "4.5rem" }}
    >
      {copied ? "✓ Copied" : label}
    </button>
  );
}

export default function PatientRegistry() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/refer/patients", {
        headers: authHeaders(),
      });
      if (!res.ok) {
        setError("Failed to load patients.");
        return;
      }
      setPatients(await res.json());
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const q = search.toLowerCase();
  const visible = patients.filter(
    (p) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.guid.toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q) ||
      (p.notes || "").toLowerCase().includes(q),
  );

  return (
    <div className="page">
      <div className="page-inner">
        <header className="dashboard-header">
          <div>
            <h1>Patient Registry</h1>
            <p className="text-muted">
              Patients pre-configured for wearable / QR-code auto-referral
            </p>
          </div>
          <button className="btn btn-ghost" onClick={load}>
            ↻ Refresh
          </button>
        </header>

        <div style={{ marginBottom: "1.25rem" }}>
          <input
            type="search"
            placeholder="Search by name, GUID or notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "28rem",
              padding: "0.55rem 1rem",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-full)",
              fontSize: "0.95rem",
              fontFamily: "inherit",
              background: "var(--surface)",
              color: "var(--text)",
              outline: "none",
            }}
          />
        </div>

        {loading && <p className="text-muted">Loading…</p>}
        {error && <p className="error-msg">{error}</p>}

        {!loading && !error && visible.length === 0 && (
          <p className="text-muted">No patients found.</p>
        )}

        {!loading && !error && visible.length > 0 && (
          <div className="ticket-list">
            {visible.map((p) => (
              <div key={p.guid} className="ticket-card">
                <div className="ticket-card__header">
                  <span className="ticket-card__patient">{p.name}</span>
                  <span className="ticket-card__time">DOB: {p.dob}</span>
                </div>

                <div className="ticket-card__meta">
                  {p.phone && <span>📱 {p.phone}</span>}
                  {p.email && <span>📧 {p.email}</span>}
                </div>

                <div
                  className="ticket-card__meta"
                  style={{ marginTop: "0.4rem" }}
                >
                  <span>🏥 {p.serviceName || p.serviceId}</span>
                </div>

                {p.notes && <p className="ticket-card__concern">{p.notes}</p>}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginTop: "0.75rem",
                    background: "var(--color-bg, #f8f9fa)",
                    border: "1px solid var(--color-border, #dee2e6)",
                    borderRadius: "0.375rem",
                    padding: "0.5rem 0.75rem",
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    wordBreak: "break-all",
                  }}
                >
                  <span style={{ flex: 1 }}>{p.guid}</span>
                  <CopyButton text={p.guid} />
                  <CopyButton
                    text={`http://localhost:3001/api/refer/${p.guid}`}
                    label="Copy Full URL"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
