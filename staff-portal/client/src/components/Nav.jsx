import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  clearAuth,
  getUser,
  isCarer,
  isLoggedIn,
  isStaff,
} from "../utils/auth";

function navClass({ isActive }) {
  return isActive ? "nav-link nav-link--active" : "nav-link";
}

export default function Nav() {
  const navigate = useNavigate();
  const user = getUser();
  const loggedIn = isLoggedIn();

  function logout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="nav-logo__icon">🏥</span>
          <span>Evolve Staff Portal</span>
        </Link>

        <div className="nav-links">
          {!loggedIn && (
            <>
              <NavLink to="/carer/login" className={navClass}>
                Carer sign in
              </NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">
                Register as carer
              </NavLink>
              <NavLink to="/login" className="btn btn-ghost btn-sm">
                Staff
              </NavLink>
            </>
          )}

          {loggedIn && isCarer() && (
            <>
              <NavLink to="/carer" end className={navClass}>
                My Dashboard
              </NavLink>
              <NavLink to="/carer/submit" className="btn btn-primary btn-sm">
                + Submit Ticket
              </NavLink>
            </>
          )}

          {loggedIn && isStaff() && (
            <>
              <NavLink to="/dashboard" className={navClass}>
                Ticket Queue
              </NavLink>
              <NavLink to="/bookings" className={navClass}>
                Auto-Bookings
              </NavLink>
              <NavLink to="/patients" className={navClass}>
                Patients
              </NavLink>
            </>
          )}

          {loggedIn && (
            <div className="nav-user">
              <span className="nav-user__name">
                {user?.level?.icon} {user?.name}
                {user?.role === "carer" && (
                  <span className="nav-user__points">
                    {user?.points ?? 0} pts
                  </span>
                )}
              </span>
              <button onClick={logout} className="btn btn-ghost btn-sm">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
