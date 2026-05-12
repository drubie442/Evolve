import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import CarerDashboard from "./pages/CarerDashboard";
import CarerLogin from "./pages/CarerLogin";
import Login from "./pages/Login";
import PatientRegistry from "./pages/PatientRegistry";
import ReferralBookings from "./pages/ReferralBookings";
import Register from "./pages/Register";
import StaffDashboard from "./pages/StaffDashboard";
import SubmitTicket from "./pages/SubmitTicket";
import { isCarer, isLoggedIn, isStaff } from "./utils/auth";

function RootRedirect() {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (isStaff()) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/carer" replace />;
}

function CarerRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (!isCarer()) return <Navigate to="/dashboard" replace />;
  return children;
}

function StaffRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (!isStaff()) return <Navigate to="/carer" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter basename="/staff">
      <Nav />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carer/login" element={<CarerLogin />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/carer"
          element={
            <CarerRoute>
              <CarerDashboard />
            </CarerRoute>
          }
        />
        <Route
          path="/carer/submit"
          element={
            <CarerRoute>
              <SubmitTicket />
            </CarerRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <StaffRoute>
              <StaffDashboard />
            </StaffRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <StaffRoute>
              <ReferralBookings />
            </StaffRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <StaffRoute>
              <PatientRegistry />
            </StaffRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
