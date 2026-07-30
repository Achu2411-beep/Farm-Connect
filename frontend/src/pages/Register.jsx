import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, MapPin, Phone, Mail, User, Lock, Store, FileText, ArrowRight } from 'lucide-react';
import MapInput from '../components/MapInput';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    farmName: '',
    farmDescription: '',
    latitude: '10.850500',
    longitude: '76.271100'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCoordinatesChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { username, email, password, phone, address, farmName, latitude, longitude } = formData;

    if (!username || !email || !password || !phone || !address || !farmName || !latitude || !longitude) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      // Success - Redirect to OTP verification, passing the email via router state
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container" style={{ maxWidth: '1000px', gridTemplateColumns: '40% 60%' }}>
        {/* Left Side Info Panel */}
        <div className="auth-sidebar">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <Sprout size={32} />
              <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800 }}>Local Farm Connect</h1>
            </div>
            <h2>Register as a Farmer Partner</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              List your fresh harvest, locate your farm on our map, and connect directly with thousands of nearby buyers.
            </p>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
            Verify your email next to unlock your dashboard and start uploading products.
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="auth-form-side" style={{ padding: '2.5rem 3rem', maxHeight: '90vh', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Provide your details and locate your farm on the map.
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
            {/* Account Details */}
            <h3 style={{ fontSize: '1.1rem', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '0.4rem', marginBottom: '1rem', color: 'var(--primary-deep)' }}>
              1. Account Settings
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={15} /> Username *
                </label>
                <input
                  type="text"
                  name="username"
                  className="form-input"
                  placeholder="e.g. greenfarms"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={15} /> Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={15} /> Password *
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={15} /> Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Farm Details */}
            <h3 style={{ fontSize: '1.1rem', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '0.4rem', marginBottom: '1rem', marginTop: '1.5rem', color: 'var(--primary-deep)' }}>
              2. Farm Information
            </h3>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Store size={15} /> Farm Name *
              </label>
              <input
                type="text"
                name="farmName"
                className="form-input"
                placeholder="e.g. Organic Meadows Farm"
                value={formData.farmName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={15} /> Farm Description
              </label>
              <textarea
                name="farmDescription"
                className="form-input"
                placeholder="Describe your farming methods, products, and story..."
                value={formData.farmDescription}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} /> Farm Physical Address *
              </label>
              <input
                type="text"
                name="address"
                className="form-input"
                placeholder="e.g. 12 High Street, Greenfield"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Map Pinning */}
            <h3 style={{ fontSize: '1.1rem', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '0.4rem', marginBottom: '1rem', marginTop: '1.5rem', color: 'var(--primary-deep)' }}>
              3. Pin Farm Coordinates *
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <MapInput 
                lat={parseFloat(formData.latitude)} 
                lng={parseFloat(formData.longitude)} 
                onChange={handleCoordinatesChange} 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  className="form-input"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  readOnly
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  className="form-input"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  readOnly
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading} 
              style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
              {loading ? 'Submitting Registration...' : 'Register & Send OTP'}
              {!loading && <ArrowRight size={18} />}
            </button>
            
            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Already registered? <Link to="/login" style={{ color: 'var(--primary-medium)', fontWeight: '700' }}>Farmer Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
