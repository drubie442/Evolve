import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTriageSelections } from "../context/TriageContext";
import CrisisBanner from "../components/CrisisBanner";

const CONCERNS = [
  { value: "anxiety", label: "😰 Anxiety" },
  { value: "stress", label: "😤 Stress" },
  { value: "low-mood", label: "😔 Low mood" },
  { value: "loneliness", label: "😶 Loneliness" },
  { value: "relationships", label: "💔 Relationships" },
  { value: "grief", label: "🕊️ Grief & loss" },
  { value: "crisis", label: "🆘 Crisis" },
  { value: "general", label: "❓ Not sure" },
];

const AGE_OPTIONS = [
  { value: "young-child", label: "👶 Young child (0–5)" },
  { value: "child", label: "🧒 Child (6–11)" },
  { value: "young-person", label: "🧑 Young person (12–18)" },
  { value: "adult", label: "🙋 Adult (19–64)" },
  { value: "older-adult", label: "👴 Older adult (65+)" },
];

const REGION_OPTIONS = [
  { value: "newcastle", label: "📍 Newcastle" },
  { value: "lake-macquarie", label: "📍 Lake Macquarie" },
  { value: "maitland-cessnock", label: "📍 Maitland / Cessnock" },
];

export default function Triage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { saveSelections } = useTriageSelections();
  const mode = searchParams.get("mode") || "default";
  const jumpToCrisis = searchParams.get("step") === "crisis";
  const modeClass = mode === "elder" ? "mode-elder" : "";

  const urgency = searchParams.get("urgency") || "planning";

  const [step, setStep] = useState(jumpToCrisis ? 2 : 1);
  const [forSelf, setForSelf] = useState(true);
  const [concerns, setConcerns] = useState(jumpToCrisis ? ["crisis"] : []);
  const [ageGroup, setAgeGroup] = useState("");
  const [region, setRegion] = useState("");

  const totalSteps = 4;

  function finish(selectedRegion) {
    saveSelections({
      forSelf,
      urgency,
      concerns: concerns.length ? concerns : ["general"],
      ageGroup,
      region: selectedRegion,
    });
    navigate("/services");
  }

  function toggleConcern(value) {
    setConcerns((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );
  }

  function reset() {
    setStep(1);
    setForSelf(true);
    setConcerns([]);
    setAgeGroup("");
    setRegion("");
  }

  return (
    <div className={`page ${modeClass}`}>
      <div className="container--narrow">
        <Link
          to="/"
          className="text-muted"
          style={{
            fontSize: "var(--text-sm)",
            display: "block",
            marginBottom: "1.5rem",
          }}
        >
          ← Back
        </Link>

        <div className="steps">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`step ${s === step ? "step--active" : s < step ? "step--done" : ""}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2
              style={{
                fontSize: "var(--text-2xl)",
                fontWeight: 800,
                marginBottom: "0.5rem",
              }}
            >
              Who is this for?
            </h2>
            <p className="text-muted mb-6">
              Your privacy is respected — no account needed.
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <button
                className={`concern-btn ${forSelf ? "concern-btn--selected" : ""}`}
                style={{ fontSize: "var(--text-lg)", padding: "1.25rem" }}
                onClick={() => {
                  setForSelf(true);
                  setStep(2);
                }}
              >
                🙋 For me
              </button>
              <button
                className={`concern-btn ${!forSelf ? "concern-btn--selected" : ""}`}
                style={{ fontSize: "var(--text-lg)", padding: "1.25rem" }}
                onClick={() => {
                  setForSelf(false);
                  setStep(2);
                }}
              >
                🤝 For someone I care about
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {jumpToCrisis && <CrisisBanner />}
            <h2
              style={{
                fontSize: "var(--text-2xl)",
                fontWeight: 800,
                marginBottom: "0.5rem",
              }}
            >
              What's going on?
            </h2>
            <p className="text-muted mb-6">Select everything that applies.</p>
            <div className="concern-grid">
              {CONCERNS.map((c) => (
                <button
                  key={c.value}
                  className={`concern-btn ${concerns.includes(c.value) ? "concern-btn--selected" : ""}`}
                  onClick={() => toggleConcern(c.value)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <button
              className="btn btn--primary btn--full"
              style={{
                marginTop: "1.5rem",
                fontSize: "var(--text-lg)",
                padding: "1rem",
              }}
              disabled={concerns.length === 0}
              onClick={() => setStep(3)}
            >
              Next →
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2
              style={{
                fontSize: "var(--text-2xl)",
                fontWeight: 800,
                marginBottom: "0.5rem",
              }}
            >
              How old are they?
            </h2>
            <p className="text-muted mb-6">
              This helps us match services by age group.
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {AGE_OPTIONS.map((a) => (
                <button
                  key={a.value}
                  className={`concern-btn ${ageGroup === a.value ? "concern-btn--selected" : ""}`}
                  style={{ fontSize: "var(--text-lg)", padding: "1.25rem" }}
                  onClick={() => {
                    setAgeGroup(a.value);
                    setStep(4);
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2
              style={{
                fontSize: "var(--text-2xl)",
                fontWeight: 800,
                marginBottom: "0.5rem",
              }}
            >
              Where are they located?
            </h2>
            <p className="text-muted mb-6">
              Services are region-specific — select the closest area.
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {REGION_OPTIONS.map((r) => (
                <button
                  key={r.value}
                  className={`concern-btn ${region === r.value ? "concern-btn--selected" : ""}`}
                  style={{ fontSize: "var(--text-lg)", padding: "1.25rem" }}
                  onClick={() => {
                    setRegion(r.value);
                    finish(r.value);
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
