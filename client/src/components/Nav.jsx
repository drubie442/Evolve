import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const mode = params.get("mode");

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link className="nav__logo" to={mode ? `/?mode=${mode}` : "/"}>
          💚 Evolve Wellbeing
        </Link>
        <div className="nav__links">
          <Link to="/resources">Find Support</Link>
          <Link to="/for-a-friend">For a Friend</Link>
          <Link to="/handoff">Staff Handoff</Link>
          <a href="/staff/carer/login">Carer Portal</a>
          <Link to="/admin">Admin</Link>
          <Link to="/demo-qr">Demo QR</Link>
        </div>
      </div>
    </nav>
  );
}
