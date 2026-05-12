export default function CrisisBanner() {
  return (
    <div className="crisis-banner" role="alert">
      <div className="crisis-banner__title">⚠️ If you are in immediate danger, call 000 now</div>
      <div className="crisis-contacts">
        <a className="btn btn--crisis btn--full" href="tel:000">
          📞 Call 000 — Emergency Services
        </a>
        <a className="btn btn--crisis btn--full" href="tel:131114">
          📞 Call 13 11 14 — Lifeline (24/7 Crisis Line)
        </a>
        <a className="btn btn--full" style={{ background: '#2e7d6e', color: '#fff', borderRadius: '9999px', padding: '1rem 2rem', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} href="tel:1300000000">
          📞 Call Evolve Hub — 1300 000 000
        </a>
      </div>
      <p className="mt-4 text-center" style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-crisis)' }}>
        You can also walk in to the Evolve Mental Health &amp; Wellbeing Hub — no appointment needed.
      </p>
    </div>
  );
}
