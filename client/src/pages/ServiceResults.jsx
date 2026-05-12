import { Link } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import { useServices } from "../context/ServicesContext";
import { useTriageSelections } from "../context/TriageContext";

// Maps triage age value → support-services boolean field
const AGE_FIELD_MAP = {
  "young-child": "age_0_5",
  child: "age_6_11",
  "young-person": "age_12_18",
  adult: "age_adult",
  "older-adult": "age_over_65",
};

// Maps triage region value → support-services boolean field
const REGION_FIELD_MAP = {
  newcastle: "region_newcastle",
  "lake-macquarie": "region_lake_macquarie",
  "maitland-cessnock": "region_maitland_cessnock",
};

// Maps triage concern → support-services category string (null = show all categories)
const CONCERN_CATEGORY_MAP = {
  crisis: null,
  anxiety: "Mental Health",
  stress: "Mental Health",
  "low-mood": "Mental Health",
  loneliness: "Mental Health",
  relationships: "Mental Health",
  grief: "Mental Health",
  general: null,
};

// crisis     → wait_time_days === 0 (available now)
// struggling  → wait_time_days <= 2 (available within 1-2 days)
function meetsUrgency(service, urgency) {
  const days = service.wait_time_days;
  if (urgency === "crisis") return days === 0;
  if (urgency === "struggling") return days <= 2;
  return true;
}

function filterServices(services, selections) {
  if (!services) return [];
  if (!selections) return services;

  let filtered = [...services];

  // Age filter
  const ageField = AGE_FIELD_MAP[selections.ageGroup];
  if (ageField) {
    filtered = filtered.filter((s) => s[ageField] === true);
  }

  // Region filter
  const regionField = REGION_FIELD_MAP[selections.region];
  if (regionField) {
    filtered = filtered.filter((s) => s[regionField] === true);
  }

  // Category filter — only apply if every selected concern maps to a specific category
  if (selections.concerns && selections.concerns.length > 0) {
    const showAll = selections.concerns.some(
      (c) => !(c in CONCERN_CATEGORY_MAP) || CONCERN_CATEGORY_MAP[c] === null,
    );

    if (!showAll) {
      const categories = [
        ...new Set(
          selections.concerns
            .map((c) => CONCERN_CATEGORY_MAP[c])
            .filter(Boolean),
        ),
      ];
      if (categories.length > 0) {
        filtered = filtered.filter((s) => categories.includes(s.category));
      }
    }
  }

  // Sort: key services first, then alphabetically
  filtered.sort((a, b) => {
    if (b.key_service && !a.key_service) return 1;
    if (a.key_service && !b.key_service) return -1;
    return (a.name || "").localeCompare(b.name || "");
  });

  // Urgency / availability filter using the pre-computed wait_time_days field
  if (selections.urgency === "crisis" || selections.urgency === "struggling") {
    filtered = filtered.filter((s) => meetsUrgency(s, selections.urgency));
  }

  return filtered;
}

const LABEL_MAP = {
  ageGroup: {
    "young-child": "Young child (0–5)",
    child: "Child (6–11)",
    "young-person": "Young person (12–18)",
    adult: "Adult (19–64)",
    "older-adult": "Older adult (65+)",
  },
  region: {
    newcastle: "Newcastle",
    "lake-macquarie": "Lake Macquarie",
    "maitland-cessnock": "Maitland / Cessnock",
  },
};

export default function ServiceResults() {
  const { services, loading, error } = useServices();
  const { selections } = useTriageSelections();

  const filtered = filterServices(services, selections);

  const ageLabel = selections?.ageGroup
    ? LABEL_MAP.ageGroup[selections.ageGroup]
    : null;
  const regionLabel = selections?.region
    ? LABEL_MAP.region[selections.region]
    : null;

  return (
    <div className="page">
      <div className="container">
        <Link
          to="/triage"
          className="text-muted"
          style={{
            fontSize: "var(--text-sm)",
            display: "block",
            marginBottom: "1.5rem",
          }}
        >
          ← Back to triage
        </Link>

        <h1
          style={{
            fontSize: "var(--text-3xl)",
            fontWeight: 900,
            color: "var(--clr-primary-dark)",
            marginBottom: "0.5rem",
          }}
        >
          Matched Services
        </h1>

        {(ageLabel || regionLabel || selections?.urgency) && (
          <p className="text-muted mb-6">
            {selections?.urgency === "crisis" &&
              "Showing services available right now"}
            {selections?.urgency === "struggling" &&
              "Showing services available within 1–2 days"}
            {selections?.urgency === "planning" &&
              "Showing all matching services"}
            {(ageLabel || regionLabel) && (
              <>
                {" "}
                for{ageLabel ? ` ${ageLabel}` : ""}
                {regionLabel ? ` in ${regionLabel}` : ""}
              </>
            )}
            .
          </p>
        )}

        {loading && <p className="text-muted">Loading services...</p>}

        {error && (
          <p style={{ color: "var(--clr-danger, red)" }}>
            Could not load services. Please try again later.
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div>
            <p className="text-muted" style={{ marginBottom: "1rem" }}>
              No services found for your selections. Try widening your search.
            </p>
            <Link to="/triage" className="btn btn--primary">
              Start again
            </Link>
          </div>
        )}

        <div className="resource-grid">
          {filtered.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>

        {filtered.length > 0 && (
          <div
            style={{
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--clr-border)",
              textAlign: "center",
            }}
          >
            <Link to="/triage" className="btn btn--secondary">
              Start again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
