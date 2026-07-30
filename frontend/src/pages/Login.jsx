import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Mail, Lock, ArrowRight, User } from 'lucide-react';

const Login = ({ login }) => {
  const [identifier, setIdentifier] = useState(''); // can be username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle unverified user redirect
        if (response.status === 403 && data.requiresVerification) {
          navigate('/verify-otp', { state: { email: data.email } });
          return;
        }
        throw new Error(data.message || 'Login failed. Please check your credentials.');
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
    <div className="auth-wrapper">
      <div className="auth-container" style={{ maxWidth: '850px' }}>
        {/* Left Sidebar Panel */}
        <div className="auth-sidebar">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <Sprout size={32} />
              <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800 }}>Local Farm Connect</h1>
            </div>
            <h2>Welcome Back!</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Sign in to manage your local farm profile, relocation coordinates, and update your product catalog.
            </p>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
            Helping you connect directly with local consumers since 2026.
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="auth-form-side">
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Farmer Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Enter your email/username and password to access your dashboard.
          </p>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              border: '1px solid #fca5a5'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} /> Username or Email
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter email or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={15} /> Password
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
              {loading ? 'Logging in...' : 'Sign In'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            New to the platform? <Link to="/register" style={{ color: 'var(--primary-medium)', fontWeight: '700' }}>Register your Farm</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
