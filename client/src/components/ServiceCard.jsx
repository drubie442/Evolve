export default function ServiceCard({ service }) {
  return (
    <div className={`card ${service.key_service ? "card--crisis" : ""}`}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 700,
              color: "var(--clr-text)",
            }}
          >
            {service.name}
          </h3>
          {service.program_name && service.program_name !== service.name && (
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--clr-text-muted)",
              }}
            >
              {service.program_name}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {service.key_service && (
            <span className="badge badge--crisis">Key Service</span>
          )}
          {service.category && (
            <span className="badge badge--online">{service.category}</span>
          )}
        </div>
      </div>

      {service.description && (
        <p style={{ color: "var(--clr-text-muted)", marginBottom: "0.75rem" }}>
          {service.description}
        </p>
      )}

      {service.suburb && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--clr-text-muted)",
            marginBottom: "0.5rem",
          }}
        >
          📍 {service.suburb}
        </p>
      )}

      {service.availability && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--clr-text-muted)",
            marginBottom: "0.5rem",
          }}
        >
          🕐 {service.availability}
        </p>
      )}

      {service.wait_time && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--clr-text-muted)",
            marginBottom: "0.5rem",
          }}
        >
          ⏳ Wait time: {service.wait_time}
        </p>
      )}

      {service.fee_structure && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--clr-text-muted)",
            marginBottom: "0.75rem",
          }}
        >
          💲 {service.fee_structure}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginTop: "0.75rem",
        }}
      >
        {service.phone && (
          <a
            className="btn btn--primary"
            href={`tel:${service.phone.replace(/\s/g, "")}`}
          >
            📞 {service.phone}
          </a>
        )}
        {service.email && (
          <a className="btn btn--secondary" href={`mailto:${service.email}`}>
            ✉️ Email
          </a>
        )}
        {service.website && (
          <a
            className="btn btn--secondary"
            href={
              service.website.startsWith("http")
                ? service.website
                : `https://${service.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 Website
          </a>
        )}
      </div>
    </div>
  );
}
