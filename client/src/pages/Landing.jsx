import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const PARTNER_WELCOME = {
  default:
    "Mental health support is available to everyone in the Hunter region.",
};

export default function Landing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "default";
  const partner = searchParams.get("partner");
  const [partnerInfo, setPartnerInfo] = useState(null);

  useEffect(() => {
    if (partner) {
      fetch(`/api/partner/${partner}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) setPartnerInfo(data);
        })
        .catch(() => {});
    }
  }, [partner]);

  const recordPath = (path) => {
    if (partner) {
      fetch("/api/partner/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerCode: partner, path }),
      }).catch(() => {});
    }
  };

  const modeClass = mode === "elder" ? "mode-elder" : "";

  const tagline =
    mode === "youth"
      ? "It's OK to not be OK. Help is here."
      : mode === "elder"
        ? "Support is available. You are not alone."
        : "Free mental health support for every person in the Hunter region.";

  return (
    <div className={modeClass}>
      {partnerInfo && (
        <div className="partner-banner">
          {partnerInfo.name} — {partnerInfo.welcomeMessage}
        </div>
      )}
      <div className="page">
        <div className="container--narrow text-center">
          <h1
            style={{
              fontSize: mode === "elder" ? "2.8rem" : "2.2rem",
              fontWeight: 900,
              color: "var(--clr-primary-dark)",
              marginBottom: "0.75rem",
            }}
          >
            💚 Evolve Wellbeing Hub
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--clr-text-muted)",
              marginBottom: "2.5rem",
            }}
          >
            {tagline}
          </p>

          <p
            style={{
              fontWeight: 700,
              fontSize: "var(--text-xl)",
              marginBottom: "1.5rem",
            }}
          >
            How are you feeling right now?
          </p>

          <div className="landing-btns">
            <button
              className="landing-btn landing-btn--crisis"
              onClick={() => {
                recordPath("crisis");
                navigate(
                  `/triage?urgency=crisis&step=crisis&mode=${mode}${partner ? `&partner=${partner}` : ""}`,
                );
              }}
            >
              🆘 I'm in crisis
              <span className="sub">I need help right now</span>
            </button>
            <button
              className="landing-btn landing-btn--struggling"
              onClick={() => {
                recordPath("struggling");
                navigate(
                  `/triage?urgency=struggling&mode=${mode}${partner ? `&partner=${partner}` : ""}`,
                );
              }}
            >
              😔 I'm struggling
              <span className="sub">
                I need support but it's not an emergency
              </span>
            </button>
            <button
              className="landing-btn landing-btn--learn"
              onClick={() => {
                recordPath("learn");
                navigate(`/resources?mode=${mode}`);
              }}
            >
              📚 I want to learn more
              <span className="sub">Browse support resources</span>
            </button>
          </div>

          <div
            style={{
              marginTop: "2.5rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--clr-border)",
            }}
          >
            <Link
              to={`/for-a-friend?mode=${mode}`}
              style={{
                color: "var(--clr-text-muted)",
                fontSize: "var(--text-sm)",
              }}
            >
              Looking for support for a friend or family member? →
            </Link>
          </div>

          {mode === "elder" && (
            <div style={{ marginTop: "2rem" }}>
              <a
                className="btn btn--primary btn--large btn--full"
                href="tel:0240961100"
              >
                📞 Prefer to call? 02 4096 1100
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
