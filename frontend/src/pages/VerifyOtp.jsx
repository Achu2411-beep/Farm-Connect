import React from 'react';
import { Link } from 'react-router-dom';

const VerifyOtp = () => {
  return (
    <div className="container" style={{ maxWidth: '450px' }}>
      <div className="card" style={{ textAlign: 'center' }}>
        <h2>Verify Email</h2>
        <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
          Enter the 6-digit OTP code sent to your email to activate your account.
        </p>
        <Link to="/register" style={{ color: 'var(--primary-medium)', fontWeight: '600' }}>Back to Registration</Link>
      </div>
    </div>
  );
};

export default VerifyOtp;
