import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EvolveCallPanel from "../components/EvolveCallPanel";
import ResourceCard from "../components/ResourceCard";
import ServiceCard from "../components/ServiceCard";
import { useServices } from "../context/ServicesContext";

const REGION_FILTERS = [
  { value: "all", label: "All regions" },
  { value: "region_newcastle", label: "📍 Newcastle" },
  { value: "region_lake_macquarie", label: "📍 Lake Macquarie" },
  { value: "region_maitland_cessnock", label: "📍 Maitland / Cessnock" },
];

const SV_AGE_FILTERS = [
  { value: "any", label: "All ages" },
  { value: "age_12_18", label: "Young people (12–18)" },
  { value: "age_adult", label: "Adults" },
  { value: "age_over_65", label: "Older adults (65+)" },
];

const CONCERN_FILTERS = [
  { value: "all", label: "All" },
  { value: "crisis", label: "🆘 Crisis" },
  { value: "anxiety", label: "😰 Anxiety" },
  { value: "stress", label: "😤 Stress" },
  { value: "low-mood", label: "😔 Low mood" },
  { value: "loneliness", label: "😶 Loneliness" },
  { value: "relationships", label: "💔 Relationships" },
  { value: "grief", label: "🕊️ Grief" },
];

const AGE_FILTERS = [
  { value: "any", label: "All ages" },
  { value: "youth", label: "Young people" },
  { value: "adult", label: "Adults" },
  { value: "elder", label: "Older adults" },
];

export default function Resources() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "default";
  const modeClass = mode === "elder" ? "mode-elder" : "";

  const [concern, setConcern] = useState("all");
  const [ageGroup, setAgeGroup] = useState(
    mode === "youth" ? "youth" : mode === "elder" ? "elder" : "any",
  );
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  // support-services from ServicesContext cache
  const { services, loading: servicesLoading } = useServices();
  const [svCategory, setSvCategory] = useState("all");
  const [svRegion, setSvRegion] = useState("all");
  const [svAge, setSvAge] = useState("any");

  const categories = useMemo(() => {
    if (!services) return [];
    return [
      "all",
      ...Array.from(
        new Set(services.map((s) => s.category).filter(Boolean)),
      ).sort(),
    ];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter((s) => {
      if (svCategory !== "all" && s.category !== svCategory) return false;
      if (svRegion !== "all" && !s[svRegion]) return false;
      if (svAge !== "any" && !s[svAge]) return false;
      return true;
    });
  }, [services, svCategory, svRegion, svAge]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (concern !== "all") params.set("concern", concern);
    if (ageGroup !== "any") params.set("ageGroup", ageGroup);
    fetch(`/api/resources?${params}`)
      .then((r) => r.json())
      .then((data) => setResources(data))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, [concern, ageGroup]);

  return (
    <div className={`page ${modeClass}`}>
      <div className="container">
        <h1
          style={{
            fontSize: "var(--text-3xl)",
            fontWeight: 900,
            color: "var(--clr-primary-dark)",
            marginBottom: "0.5rem",
          }}
        >
          Find Support
        </h1>
        <p className="text-muted mb-6">
          Free and low-cost mental health services available in the Hunter
          region.
        </p>

        <EvolveCallPanel />

        <div style={{ marginBottom: "1rem" }}>
          <p
            style={{
              fontWeight: 600,
              fontSize: "var(--text-sm)",
              marginBottom: "0.5rem",
              color: "var(--clr-text-muted)",
            }}
          >
            FILTER BY CONCERN
          </p>
          <div className="filter-tabs">
            {CONCERN_FILTERS.map((f) => (
              <button
                key={f.value}
                className={`filter-tab ${concern === f.value ? "filter-tab--active" : ""}`}
                onClick={() => setConcern(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontWeight: 600,
              fontSize: "var(--text-sm)",
              marginBottom: "0.5rem",
              color: "var(--clr-text-muted)",
            }}
          >
            FILTER BY AGE GROUP
          </p>
          <div className="filter-tabs">
            {AGE_FILTERS.map((f) => (
              <button
                key={f.value}
                className={`filter-tab ${ageGroup === f.value ? "filter-tab--active" : ""}`}
                onClick={() => setAgeGroup(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="text-muted">Loading resources...</p>}

        {!loading && resources.length === 0 && (
          <p className="text-muted">
            No resources found for this filter combination. Try widening your
            search.
          </p>
        )}

        <div className="resource-grid">
          {resources.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>

        {/* ── All support services from server ── */}
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "2px solid var(--clr-border)",
          }}
        >
          <h2
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 800,
              color: "var(--clr-primary-dark)",
              marginBottom: "0.25rem",
            }}
          >
            All Available Services
          </h2>
          <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
            Browse the full directory of Hunter region support services.
          </p>

          <div style={{ marginBottom: "1rem" }}>
            <p
              style={{
                fontWeight: 600,
                fontSize: "var(--text-sm)",
                marginBottom: "0.5rem",
                color: "var(--clr-text-muted)",
              }}
            >
              FILTER BY CATEGORY
            </p>
            <div className="filter-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-tab ${svCategory === cat ? "filter-tab--active" : ""}`}
                  onClick={() => setSvCategory(cat)}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <p
              style={{
                fontWeight: 600,
                fontSize: "var(--text-sm)",
                marginBottom: "0.5rem",
                color: "var(--clr-text-muted)",
              }}
            >
              FILTER BY REGION
            </p>
            <div className="filter-tabs">
              {REGION_FILTERS.map((f) => (
                <button
                  key={f.value}
                  className={`filter-tab ${svRegion === f.value ? "filter-tab--active" : ""}`}
                  onClick={() => setSvRegion(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <p
              style={{
                fontWeight: 600,
                fontSize: "var(--text-sm)",
                marginBottom: "0.5rem",
                color: "var(--clr-text-muted)",
              }}
            >
              FILTER BY AGE GROUP
            </p>
            <div className="filter-tabs">
              {SV_AGE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  className={`filter-tab ${svAge === f.value ? "filter-tab--active" : ""}`}
                  onClick={() => setSvAge(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {servicesLoading && <p className="text-muted">Loading services...</p>}
          {!servicesLoading && filteredServices.length === 0 && (
            <p className="text-muted">
              No services match these filters. Try a different combination.
            </p>
          )}
          <div className="resource-grid">
            {filteredServices.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--clr-border)",
            textAlign: "center",
          }}
        >
          <p className="text-muted" style={{ fontSize: "var(--text-sm)" }}>
            Need more personalised guidance?{" "}
            <a href="/triage">Answer 3 quick questions →</a>
          </p>
        </div>
      </div>
    </div>
  );
}
