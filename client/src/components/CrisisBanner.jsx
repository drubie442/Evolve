import EvolveCallPanel from "./EvolveCallPanel";

export default function CrisisBanner() {
  return (
    <div className="crisis-banner" role="alert">
      <EvolveCallPanel />
      <div className="crisis-banner__title">⚠️ If you are in immediate danger, call 000 now</div>
      <div className="crisis-contacts">
        <a className="btn btn--crisis btn--full" href="tel:000">
          📞 Call 000 — Emergency Services
        </a>
        <a className="btn btn--crisis btn--full" href="tel:131114">
          📞 Call 13 11 14 — Lifeline (24/7 Crisis Line)
        </a>
        <a
          className="btn btn--full"
          style={{ background: '#2e7d6e', color: '#fff', borderRadius: '12px', padding: '1rem 2rem', fontWeight: 700, fontSize: '1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', textDecoration: 'none' }}
          href="https://maps.google.com/?q=22+Stewart+Avenue+Hamilton+East+NSW"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>🏥 Safe Haven — Walk In, No Appointment</span>
          <span style={{ fontWeight: 400, fontSize: '0.95rem', opacity: 0.9 }}>22 Stewart Avenue, Hamilton East NSW</span>
          <span style={{ fontWeight: 400, fontSize: '0.85rem', opacity: 0.75 }}>Fri, Sat &amp; Sun 4pm–9pm</span>
        </a>
        <a
          className="btn btn--full"
          style={{ background: '#1a5c7a', color: '#fff', borderRadius: '12px', padding: '1rem 2rem', fontWeight: 700, fontSize: '1.1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', textDecoration: 'none' }}
          href="https://maps.google.com/?q=3+Hilltop+Arcade+228+Pacific+Highway+Charlestown+NSW"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>🏥 Safe Space Charlestown — Walk In, No Appointment</span>
          <span style={{ fontWeight: 400, fontSize: '0.95rem', opacity: 0.9 }}>3 Hilltop Arcade, 228 Pacific Highway, Charlestown</span>
          <span style={{ fontWeight: 400, fontSize: '0.85rem', opacity: 0.75 }}>Mon &amp; Tue 5:30pm–9:30pm</span>
        </a>
      </div>
      <p className="mt-4 text-center" style={{ fontSize: 'var(--text-sm)', color: 'var(--clr-crisis)' }}>
        Both Safe Spaces are free, walk-in mental health spaces — open when you need it most.
      </p>
    </div>
  );
}
