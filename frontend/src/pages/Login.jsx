import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Sprout, Lock, ArrowRight, User, ShoppingBag, CheckCircle, ShieldCheck, Heart } from 'lucide-react';

const Login = ({ login, initialRole }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine role: prop > pathname > search query > default 'farmer'
  const determineRole = useCallback(() => {
    if (initialRole) return initialRole;
    if (location.pathname.includes('consumer')) return 'consumer';
    if (location.pathname.includes('farmer')) return 'farmer';
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'consumer' || roleParam === 'farmer') return roleParam;
    return 'farmer';
  }, [initialRole, location.pathname, location.search]);

  const [role, setRole] = useState(determineRole);
  const [identifier, setIdentifier] = useState(''); // email or username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync role if path or initialRole changes
  useEffect(() => {
    setRole(determineRole());
    setError('');
  }, [determineRole]);

  const isFarmer = role === 'farmer';

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!identifier || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier, password, expectedRole: role })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle unverified farmer redirect
        if (response.status === 403 && data.requiresVerification) {
          navigate('/verify-otp', { state: { email: data.email } });
          return;
        }
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Check user role match as frontend safeguard
      const userRole = data.user?.role || 'farmer';
      if (userRole !== role) {
        const userRoleName = userRole === 'farmer' ? 'Farmer' : 'Consumer';
        setError(`This account is registered as a ${userRoleName}. Please log in using the ${userRoleName} Login portal.`);
        setLoading(false);
        return;
      }

      // Success - Call the global login function (App.jsx)
      login(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ padding: '2.5rem 1rem' }}>
      <div className="auth-container" style={{ maxWidth: '920px', minHeight: '560px' }}>
        {/* Left Sidebar Panel - Dynamically themed */}
        <div
          className="auth-sidebar"
          style={{
            background: isFarmer
              ? 'linear-gradient(145deg, #1b4332 0%, #2d6a4f 100%)'
              : 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
            transition: 'background 0.4s ease'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
              {isFarmer ? (
                <Sprout size={32} style={{ color: '#52b788' }} />
              ) : (
                <ShoppingBag size={32} style={{ color: 'var(--accent-clay)' }} />
              )}
              <h1 style={{ color: 'white', fontSize: '1.45rem', fontWeight: 800 }}>Farmley Connect</h1>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.8rem',
              borderRadius: '50px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '1.2rem',
              background: isFarmer ? 'rgba(82, 183, 136, 0.2)' : 'rgba(198, 113, 67, 0.25)',
              color: isFarmer ? '#52b788' : '#fed7aa'
            }}>
              {isFarmer ? '🌾 Farmer Portal' : '🛒 Buyer Portal'}
            </div>

            <h2 style={{ fontSize: '1.85rem', marginBottom: '1rem', lineHeight: '1.25' }}>
              {isFarmer ? 'Welcome Back, Farmer!' : 'Fresh Local Harvest Awaits!'}
            </h2>

            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {isFarmer
                ? 'Sign in to manage your farm profile, adjust geolocation coordinates, list freshly harvested produce, and fulfill direct neighborhood orders.'
                : 'Sign in to explore nearby local farms, purchase farm-fresh produce directly with zero middlemen markups, and track your harvest basket.'}
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {isFarmer ? (
                <>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>
                    <CheckCircle size={16} style={{ color: '#52b788', flexShrink: 0 }} /> Real-time harvest catalog & stock control
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>
                    <CheckCircle size={16} style={{ color: '#52b788', flexShrink: 0 }} /> Interactive map pinning for easy customer pickup
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>
                    <CheckCircle size={16} style={{ color: '#52b788', flexShrink: 0 }} /> 100% direct revenue with zero commissions
                  </li>
                </>
              ) : (
                <>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>
                    <CheckCircle size={16} style={{ color: 'var(--accent-clay)', flexShrink: 0 }} /> Shop 100% authentic fresh local produce
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>
                    <CheckCircle size={16} style={{ color: 'var(--accent-clay)', flexShrink: 0 }} /> Direct farm-gate prices with zero middlemen
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>
                    <CheckCircle size={16} style={{ color: 'var(--accent-clay)', flexShrink: 0 }} /> Quick order tracking & direct farmer contact
                  </li>
                </>
              )}
            </ul>
          </div>

          <div style={{
            fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.65)',
            borderTop: '1px solid rgba(255,255,255,0.12)',
            paddingTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            {isFarmer ? (
              <>
                <ShieldCheck size={16} style={{ color: '#52b788' }} /> Verified local agricultural network
              </>
            ) : (
              <>
                <Heart size={16} style={{ color: 'var(--accent-clay)' }} /> Empowering farming communities across Kerala
              </>
            )}
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-side" style={{ padding: '2.5rem 2.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Role Switcher Tabs */}
            <div style={{
              display: 'flex',
              background: '#f1f5f9',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '1.75rem',
              gap: '4px'
            }}>
              <button
                type="button"
                onClick={() => handleRoleChange('farmer')}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.5rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: isFarmer ? '#ffffff' : 'transparent',
                  color: isFarmer ? 'var(--primary-deep)' : 'var(--text-muted)',
                  fontWeight: isFarmer ? 800 : 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: isFarmer ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Sprout size={16} style={{ color: isFarmer ? 'var(--primary-medium)' : 'inherit' }} />
                Farmer Login
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('consumer')}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.5rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: !isFarmer ? '#ffffff' : 'transparent',
                  color: !isFarmer ? 'var(--accent-clay)' : 'var(--text-muted)',
                  fontWeight: !isFarmer ? 800 : 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  boxShadow: !isFarmer ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <ShoppingBag size={16} style={{ color: !isFarmer ? 'var(--accent-clay)' : 'inherit' }} />
                Consumer Login
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem', color: 'var(--primary-deep)' }}>
                {isFarmer ? '🌾 Farmer Sign In' : '🛒 Consumer Sign In'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {isFarmer
                  ? 'Enter your farmer credentials to access your dashboard and produce listings.'
                  : 'Enter your consumer account credentials to start shopping and view your orders.'}
              </p>
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: '600',
                marginBottom: '1.25rem',
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={15} />
                  {isFarmer ? 'Farmer Email or Username' : 'Buyer Email or Username'}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={isFarmer ? 'e.g. greenvalley or farmer@example.com' : 'e.g. freshbuyer or buyer@example.com'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={15} /> Password
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className={isFarmer ? 'btn btn-primary' : 'btn btn-accent'}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.95rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.98rem',
                  fontWeight: 700
                }}
              >
                {loading
                  ? 'Verifying & Signing In...'
                  : isFarmer
                  ? 'Sign In to Farmer Dashboard'
                  : 'Sign In to Consumer Account'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </div>

          {/* Bottom Switch & Register Links */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              {isFarmer ? (
                <>
                  Don't have a farm registered?{' '}
                  <Link to="/register" style={{ color: 'var(--primary-medium)', fontWeight: '700' }}>
                    Register Your Farm Here
                  </Link>
                </>
              ) : (
                <>
                  Don't have a consumer account?{' '}
                  <Link to="/register-consumer" style={{ color: 'var(--accent-clay)', fontWeight: '700' }}>
                    Create a Free Buyer Account
                  </Link>
                </>
              )}
            </p>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {isFarmer ? (
                <>
                  Looking to buy fresh farm produce?{' '}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('consumer')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-clay)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline'
                    }}
                  >
                    Switch to Consumer Login
                  </button>
                </>
              ) : (
                <>
                  Are you a local producer/grower?{' '}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('farmer')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-medium)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline'
                    }}
                  >
                    Switch to Farmer Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
