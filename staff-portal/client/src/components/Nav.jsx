import { Link, useNavigate } from "react-router-dom";
import {
  clearAuth,
  getUser,
  isCarer,
  isLoggedIn,
  isStaff,
} from "../utils/auth";

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
              <Link to="/carer/login">Carer sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register as carer
              </Link>
            </>
          )}

          {loggedIn && isCarer() && (
            <>
              <Link to="/carer">My Dashboard</Link>
              <Link to="/carer/submit" className="btn btn-primary btn-sm">
                + Submit Ticket
              </Link>
            </>
          )}

          {loggedIn && isStaff() && (
            <>
              <Link to="/dashboard">Ticket Queue</Link>
              <Link to="/bookings">Auto-Bookings</Link>
              <Link to="/patients">Patients</Link>
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
