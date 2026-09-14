import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, MapPin, Phone, Mail, User, Lock, Store, FileText, ArrowRight, Search, Loader2 } from 'lucide-react';
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
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef(null);
  const suggestionsContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === 'address') {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (value.trim().length >= 3) {
        searchTimeoutRef.current = setTimeout(() => {
          fetchAddressSuggestions(value.trim());
        }, 500);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const fetchAddressSuggestions = async (query) => {
    try {
      setSearchLoading(true);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
      const data = await res.json();
      setSuggestions(data || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Error fetching address suggestions:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    const lat = parseFloat(suggestion.lat).toFixed(6);
    const lon = parseFloat(suggestion.lon).toFixed(6);

    setFormData((prev) => ({
      ...prev,
      address: suggestion.display_name,
      latitude: lat,
      longitude: lon
    }));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleManualSearch = (e) => {
    if (e) e.preventDefault();
    if (formData.address.trim().length >= 2) {
      fetchAddressSuggestions(formData.address.trim());
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsContainerRef.current && !suggestionsContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              <h1 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800 }}>Farmley Connect</h1>
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

            <div className="form-group" style={{ position: 'relative' }} ref={suggestionsContainerRef}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} /> Farm Physical Address *
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                  Type to search & locate on map
                </span>
              </label>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="e.g. Aluva, Kochi, Kerala"
                  value={formData.address}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleManualSearch();
                    }
                  }}
                  required
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleManualSearch}
                  disabled={searchLoading || !formData.address.trim()}
                  className="btn btn-secondary"
                  style={{
                    padding: '0 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap'
                  }}
                  title="Search location and pin on map"
                >
                  {searchLoading ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
                  Find on Map
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <ul style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  listStyle: 'none',
                  padding: '0.4rem 0',
                  margin: '4px 0 0 0',
                  zIndex: 1100,
                  maxHeight: '220px',
                  overflowY: 'auto'
                }}>
                  {suggestions.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(item)}
                      style={{
                        padding: '0.65rem 1rem',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        borderBottom: index < suggestions.length - 1 ? '1px solid #f1f5f9' : 'none',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary-medium)' }} />
                      <span style={{ color: 'var(--text-main)', lineHeight: '1.4' }}>{item.display_name}</span>
                    </li>
                  ))}
                </ul>
              )}
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
