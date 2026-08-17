import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, LogOut, LayoutDashboard, LogIn, UserPlus, MapPin, ShoppingBag, ShoppingCart } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';

// Import Pages
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import RegisterConsumer from './pages/RegisterConsumer';
import ExploreFarms from './pages/ExploreFarms';
import FarmStorefront from './pages/FarmStorefront';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import VerifyOtp from './pages/VerifyOtp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function Navigation({ user, logout }) {
  const location = useLocation();
  const { totalCount } = useCart();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <Sprout size={28} />
        LocalFarm<span>Connect</span>
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/farms" className={`nav-link ${location.pathname === '/farms' ? 'active' : ''}`}>
            <MapPin size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Explore Farms
          </Link>
        </li>
        <li>
          <Link to="/cart" className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`} style={{ position: 'relative' }}>
            <ShoppingCart size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Cart
            {totalCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-12px',
                background: 'var(--accent-clay)',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '800',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {totalCount}
              </span>
            )}
          </Link>
        </li>

        {user ? (
          <>
            {user.role === 'farmer' ? (
              <li>
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                  <LayoutDashboard size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Farmer Dashboard
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/my-orders" className={`nav-link ${location.pathname === '/my-orders' ? 'active' : ''}`}>
                  <ShoppingBag size={18} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  My Orders
                </Link>
              </li>
            )}
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
              <Link to="/register-consumer" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                <ShoppingBag size={16} />
                Buyer Sign Up
              </Link>
            </li>
            <li>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.2rem' }}>
                <UserPlus size={18} />
                Join as Farmer
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
    if (userData.role === 'consumer') {
      navigate('/farms');
    } else {
      navigate('/dashboard');
    }
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
          <Route path="/farms" element={<ExploreFarms />} />
          <Route path="/farm/:id" element={<FarmStorefront />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-consumer" element={<RegisterConsumer login={login} />} />
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
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
}
