import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card">
        <h2>Farmer Login</h2>
        <p style={{ margin: '1rem 0', color: 'var(--text-muted)' }}>
          Sign in to access your farmer dashboard.
        </p>
        <Link to="/register" style={{ color: 'var(--primary-medium)', fontWeight: '600' }}>Don't have an account? Register</Link>
      </div>
    </div>
  );
};

export default Login;
