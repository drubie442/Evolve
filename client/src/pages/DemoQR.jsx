import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

const BASE_URL = window.location.origin;

export default function DemoQR() {
  const [patients, setPatients] = useState([]);
  const [selectedGuid, setSelectedGuid] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingResult, setBookingResult] = useState(null);
  const [triggering, setTriggering] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    fetch("/api/refer/demo-patients")
      .then((r) => r.json())
      .then((data) => {
        setPatients(data);
        if (data.length > 0) setSelectedGuid(data[0].guid);
      })
      .finally(() => setLoading(false));
  }, []);

  const selected = patients.find((p) => p.guid === selectedGuid);
  const referUrl = selectedGuid ? `${BASE_URL}/api/refer/${selectedGuid}` : "";

  async function triggerBooking() {
    if (!selectedGuid) return;
    setTriggering(true);
    setBookingResult(null);
    try {
      const res = await fetch(`/api/refer/${selectedGuid}`, { method: "POST" });
      const data = await res.json();
      setBookingResult({ ok: res.status === 201, data });
    } catch {
      setBookingResult({
        ok: false,
        data: { error: "Could not reach server." },
      });
    } finally {
      setTriggering(false);
    }
  }

  function downloadQR() {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) return;
    const serialized = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([serialized], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${selectedGuid}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--clr-bg)",
        padding: "2.5rem 1rem",
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "var(--text-3xl)",
            fontWeight: 800,
            color: "var(--clr-primary-dark)",
            marginBottom: "0.25rem",
          }}
        >
          Demo QR Referral
        </h1>
        <p style={{ color: "var(--clr-text-muted)", marginBottom: "2rem" }}>
          Select a patient to generate their pre-configured referral QR code.
          Scanning or clicking the code triggers an automatic booking to their
          assigned service.
        </p>

        {/* Patient selector */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "var(--clr-primary-dark)",
            }}
          >
            Select patient
          </label>
          {loading ? (
            <p style={{ color: "var(--clr-text-muted)" }}>Loading patients…</p>
          ) : (
            <select
              value={selectedGuid}
              onChange={(e) => {
                setSelectedGuid(e.target.value);
                setBookingResult(null);
              }}
              style={{
                width: "100%",
                padding: "0.6rem 0.9rem",
                borderRadius: "var(--radius-sm)",
                border: "2px solid var(--clr-border)",
                fontSize: "var(--text-base)",
                fontFamily: "inherit",
                background: "var(--clr-surface)",
                color: "var(--clr-text)",
                cursor: "pointer",
              }}
            >
              {patients.map((p) => (
                <option key={p.guid} value={p.guid}>
                  {p.name} — {p.serviceName}
                </option>
              ))}
            </select>
          )}

          {selected && (
            <div
              style={{
                marginTop: "0.75rem",
                fontSize: "var(--text-sm)",
                color: "var(--clr-text-muted)",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  background: "var(--clr-border)",
                  padding: "2px 10px",
                  borderRadius: "var(--radius-full)",
                }}
              >
                {selected.serviceCategory}
              </span>
              <span style={{ fontFamily: "monospace", wordBreak: "break-all" }}>
                {selected.guid}
              </span>
            </div>
          )}
        </div>

        {/* QR code */}
        {referUrl && (
          <div
            className="card"
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.25rem",
            }}
          >
            <div
              ref={svgRef}
              style={{
                padding: "1rem",
                background: "#fff",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <QRCodeSVG
                value={referUrl}
                size={220}
                level="M"
                includeMargin={false}
                fgColor="var(--clr-primary-dark)"
              />
            </div>

            <div style={{ textAlign: "center", width: "100%" }}>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--clr-text-muted)",
                  marginBottom: "0.25rem",
                }}
              >
                Encodes:
              </p>
              <code
                style={{
                  display: "block",
                  wordBreak: "break-all",
                  fontSize: "0.78rem",
                  background: "var(--clr-bg)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--clr-border)",
                }}
              >
                {referUrl}
              </code>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                className="btn btn--primary"
                onClick={triggerBooking}
                disabled={triggering}
              >
                {triggering ? "Booking…" : "▶ Simulate scan"}
              </button>
              <button className="btn btn--secondary" onClick={downloadQR}>
                ↓ Download SVG
              </button>
            </div>
          </div>
        )}

        {/* Booking result */}
        {bookingResult && (
          <div
            className="card"
            style={{
              borderColor: bookingResult.ok
                ? "var(--clr-primary)"
                : "var(--clr-crisis-border)",
              background: bookingResult.ok ? "#f0fdf9" : "var(--clr-crisis-bg)",
            }}
          >
            {bookingResult.ok ? (
              <>
                <p
                  style={{
                    fontWeight: 700,
                    color: "var(--clr-primary-dark)",
                    marginBottom: "0.75rem",
                  }}
                >
                  ✅ Booking created!
                </p>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "var(--text-sm)",
                  }}
                >
                  {[
                    ["Patient", bookingResult.data.booking?.patientName],
                    ["Service", bookingResult.data.booking?.serviceName],
                    ["Category", bookingResult.data.booking?.serviceCategory],
                    ["Status", bookingResult.data.booking?.status],
                    [
                      "Booked at",
                      new Date(
                        bookingResult.data.booking?.bookedAt,
                      ).toLocaleString("en-AU"),
                    ],
                  ].map(([k, v]) => (
                    <tr
                      key={k}
                      style={{ borderBottom: "1px solid var(--clr-border)" }}
                    >
                      <td
                        style={{
                          padding: "0.4rem 0.5rem",
                          fontWeight: 600,
                          color: "var(--clr-text-muted)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {k}
                      </td>
                      <td
                        style={{
                          padding: "0.4rem 0.5rem",
                          color: "var(--clr-text)",
                        }}
                      >
                        {v}
                      </td>
                    </tr>
                  ))}
                </table>
                <p
                  style={{
                    marginTop: "0.75rem",
                    fontSize: "var(--text-sm)",
                    color: "var(--clr-text-muted)",
                  }}
                >
                  View it in the staff portal under{" "}
                  <strong>Auto-Bookings</strong>.
                </p>
              </>
            ) : (
              <p style={{ color: "var(--clr-crisis)", fontWeight: 600 }}>
                ❌ {bookingResult.data?.error || "Something went wrong."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
