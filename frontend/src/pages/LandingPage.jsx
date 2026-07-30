import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Local Farm Connect</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
        Connecting local farmers directly to consumers for fresh, organic, and locally-grown produce.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/register" className="btn btn-primary">Join as Farmer</Link>
        <Link to="/login" className="btn btn-secondary">Farmer Login</Link>
      </div>
    </div>
  );
};

export default LandingPage;
