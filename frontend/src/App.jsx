import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, LogOut, LayoutDashboard, User as UserIcon, LogIn, UserPlus } from 'lucide-react';

// Import Pages
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function Navigation({ user, logout }) {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/verify-otp'].includes(location.pathname);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <Sprout size={28} />
        LocalFarm<span>Connect</span>
      </Link>
      <ul className="nav-links">
        {user ? (
          <>
            <li>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                <LayoutDashboard size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Dashboard
              </Link>
            </li>
            <li>
              <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <LogOut size={16} />
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                <LogIn size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem' }}>
                <UserPlus size={18} />
                Join
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation user={user} logout={logout} />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp login={login} />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />
        </Routes>
      </main>
      <footer style={{ background: 'var(--primary-deep)', color: 'white', padding: '2rem 1rem', textAlign: 'center', fontSize: '0.9rem' }}>
        <div className="container" style={{ padding: 0 }}>
          <p>&copy; {new Date().getFullYear()} Local Farm Connect. Cultivating direct community relationships.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
