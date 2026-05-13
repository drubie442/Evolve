import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const mode = params.get("mode");
  const [open, setOpen] = useState(false);

  const links = (
    <>
      <Link to="/resources" onClick={() => setOpen(false)}>Find Support</Link>
      <Link to="/for-a-friend" onClick={() => setOpen(false)}>For a Friend</Link>
      <Link to="/handoff" onClick={() => setOpen(false)}>Staff Handoff</Link>
      <a href="/staff/carer/login">Carer Portal</a>
      <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>
      <Link to="/demo-qr" onClick={() => setOpen(false)}>Demo QR</Link>
    </>
  );

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link className="nav__logo" to={mode ? `/?mode=${mode}` : "/"}>
          💚 Evolve Wellbeing
        </Link>
        <div className="nav__links">{links}</div>
        <button
          className="nav__hamburger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && <div className="nav__mobile-menu">{links}</div>}
    </nav>
  );
}
