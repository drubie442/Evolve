import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Landing from './pages/Landing';
import Triage from './pages/Triage';
import Resources from './pages/Resources';
import Handoff from './pages/Handoff';
import ForAFriend from './pages/ForAFriend';
import Admin from './pages/Admin';

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
      </Routes>
    </BrowserRouter>
  );
}
