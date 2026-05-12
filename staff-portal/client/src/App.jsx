import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isLoggedIn, isStaff, isCarer } from './utils/auth';
import Nav from './components/Nav';
import Login from './pages/Login';
import CarerLogin from './pages/CarerLogin';
import Register from './pages/Register';
import CarerDashboard from './pages/CarerDashboard';
import SubmitTicket from './pages/SubmitTicket';
import StaffDashboard from './pages/StaffDashboard';

function RootRedirect() {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (isStaff()) return <Navigate to="/staff" replace />;
  return <Navigate to="/carer" replace />;
}

function CarerRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (!isCarer()) return <Navigate to="/staff" replace />;
  return children;
}

function StaffRoute({ children }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  if (!isStaff()) return <Navigate to="/carer" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/"              element={<RootRedirect />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/carer/login"   element={<CarerLogin />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/carer"         element={<CarerRoute><CarerDashboard /></CarerRoute>} />
        <Route path="/carer/submit"  element={<CarerRoute><SubmitTicket /></CarerRoute>} />
        <Route path="/staff"         element={<StaffRoute><StaffDashboard /></StaffRoute>} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
