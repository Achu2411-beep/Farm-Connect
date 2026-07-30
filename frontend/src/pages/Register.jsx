import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card">
        <h2>Farmer Registration</h2>
        <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
          Create an account to start listing your fresh farm produce.
        </p>
        <Link to="/login" style={{ color: 'var(--primary-medium)', fontWeight: '600' }}>Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Register;
