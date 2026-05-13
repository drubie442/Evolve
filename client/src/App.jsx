import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Admin from "./pages/Admin";
import DemoQR from "./pages/DemoQR";
import ForAFriend from "./pages/ForAFriend";
import Handoff from "./pages/Handoff";
import Landing from "./pages/Landing";
import Resources from "./pages/Resources";
import ServiceResults from "./pages/ServiceResults";
import Triage from "./pages/Triage";

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/triage" element={<Triage />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/handoff" element={<Handoff />} />
        <Route path="/for-a-friend" element={<ForAFriend />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/services" element={<ServiceResults />} />
        <Route path="/demo-qr" element={<DemoQR />} />
      </Routes>
    </BrowserRouter>
  );
}
