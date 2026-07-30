import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Mail, ShieldCheck, ArrowRight, RefreshCw, KeyRound } from 'lucide-react';

const VerifyOtp = ({ login }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60); // 60-second cooldown for resend

  // Pull email from routing state (passed from Register page)
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  // Resend countdown timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('Please provide an email address.');
      setLoading(false);
      return;
    }

    if (otp.length !== 6 || isNaN(otp)) {
      setError('Please enter a valid 6-digit number code.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed. Please try again.');
      }

      setSuccess('Email verified successfully! Logging you in...');
      
      // Complete login flow and redirect to dashboard
      setTimeout(() => {
        login(data.user, data.token);
      }, 1500);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    setError('');
    setSuccess('');
    setResending(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend code.');
      }

      setSuccess('A new verification code has been logged to the terminal console.');
      setTimer(60); // Reset timer cooldown
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container" style={{ maxWidth: '500px', gridTemplateColumns: '1fr' }}>
        <div className="auth-form-side" style={{ padding: '3.5rem 3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              background: 'var(--primary-pale)',
              color: 'var(--primary-medium)',
              padding: '1rem',
              borderRadius: '50%',
              marginBottom: '1rem'
            }}>
              <ShieldCheck size={40} />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Verify Your Email</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              We have generated a 6-digit OTP verification code. Check your backend console logs.
            </p>
          </div>

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

          {success && (
            <div style={{
              background: '#e8f5e9',
              color: 'var(--primary-medium)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              border: '1px solid var(--primary-light)'
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={15} /> Email Address
              </label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!!location.state?.email}
                style={location.state?.email ? { backgroundColor: '#f1f5f9', cursor: 'not-allowed' } : {}}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <KeyRound size={15} /> 6-Digit Code
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                className="form-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // only digits
                style={{
                  textAlign: 'center',
                  fontSize: '2rem',
                  letterSpacing: '0.3em',
                  fontFamily: 'monospace',
                  fontWeight: '700',
                  padding: '0.5rem'
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || otp.length !== 6}
              style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Didn't receive the code?</span>
            <button
              onClick={handleResend}
              disabled={resending || timer > 0}
              className="btn btn-secondary"
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                cursor: timer > 0 ? 'not-allowed' : 'pointer'
              }}
            >
              <RefreshCw size={14} className={resending ? 'spin' : ''} />
              {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
            </button>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/register" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'underline' }}>
              Back to Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
