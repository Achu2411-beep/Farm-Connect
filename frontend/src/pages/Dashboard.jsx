import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User as UserIcon, ShoppingBag, MapPin, Phone, Mail, FileText, CheckCircle, Save, Sprout } from 'lucide-react';
import MapInput from '../components/MapInput';

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'profile', 'inventory'
  
  // Profile Form States
  const [profileData, setProfileData] = useState({
    farmName: '',
    phone: '',
    address: '',
    farmDescription: '',
    latitude: '',
    longitude: ''
  });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Redirect to login if user state doesn't exist
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Initialize profile form values
    setProfileData({
      farmName: user.farmName || '',
      phone: user.phone || '',
      address: user.address || '',
      farmDescription: user.farmDescription || '',
      latitude: user.latitude !== undefined ? user.latitude.toString() : '10.850500',
      longitude: user.longitude !== undefined ? user.longitude.toString() : '76.271100'
    });
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle coordinates changes on Map
  const handleCoordinatesChange = (lat, lng) => {
    setProfileData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  // Submit Profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setProfileError('Authentication token missing. Please login again.');
      setProfileLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          farmName: profileData.farmName,
          phone: profileData.phone,
          address: profileData.address,
          farmDescription: profileData.farmDescription,
          latitude: parseFloat(profileData.latitude),
          longitude: parseFloat(profileData.longitude)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      setProfileSuccess('Profile and coordinates updated successfully!');
      
      // Update global user state (localStorage and React context)
      const updatedUser = {
        ...user,
        farmName: data.user.farmName,
        phone: data.user.phone,
        address: data.user.address,
        farmDescription: data.user.farmDescription,
        latitude: data.user.latitude,
        longitude: data.user.longitude
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 150px)', padding: '2rem 0' }}>
      <div className="container">
        
        {/* Header Dashboard Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-deep) 0%, var(--primary-medium) 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 3rem',
          color: 'white',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Sprout size={24} style={{ color: 'var(--primary-light)' }} />
              <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', tracking: '0.1em', fontWeight: '700', color: 'rgba(255, 255, 255, 0.75)' }}>Farmer Account</span>
            </div>
            <h1 style={{ color: 'white', fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              {user.farmName}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={16} /> {user.address}
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Phone size={16} /> {user.phone}
              </span>
            </div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.8rem 1.5rem',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '0.95rem',
            fontWeight: '600'
          }}>
            Pin Coordinates: <span style={{ color: 'var(--primary-light)', fontFamily: 'monospace' }}>{parseFloat(user.latitude).toFixed(4)}, {parseFloat(user.longitude).toFixed(4)}</span>
          </div>
        </div>

        {/* Dashboard Sections grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
          
          {/* Sidebar Tabs Controls */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('overview')}
              className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '1rem 1.25rem' }}
            >
              <LayoutDashboard size={18} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '1rem 1.25rem' }}
            >
              <UserIcon size={18} />
              Farm Profile
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '1rem 1.25rem' }}
            >
              <ShoppingBag size={18} />
              Inventory Catalog
            </button>
          </aside>

          {/* Main Content Area */}
          <section className="card" style={{ padding: '2.5rem', minHeight: '450px' }}>
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Dashboard Overview</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  Welcome back! Here is a summary of your farm presence on Local Farm Connect.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', background: '#faf9f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-medium)', fontWeight: '700', marginBottom: '0.5rem' }}>
                      <CheckCircle size={18} /> Email Verified
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Your email <strong style={{ color: 'var(--text-dark)' }}>{user.email}</strong> is verified and your account is active on the map directory.
                    </p>
                  </div>
                  <div style={{ border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', background: '#faf9f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-medium)', fontWeight: '700', marginBottom: '0.5rem' }}>
                      <MapPin size={18} /> Map Pin Located
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Your farm stands are pinned at coordinates <strong style={{ color: 'var(--text-dark)' }}>{parseFloat(user.latitude).toFixed(4)}, {parseFloat(user.longitude).toFixed(4)}</strong>. Consumers can view your catalog based on this location.
                    </p>
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.75rem', background: 'white' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Farm Story & Description</h3>
                  <p style={{ color: user.farmDescription ? 'var(--text-dark)' : 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', fontStyle: user.farmDescription ? 'normal' : 'italic' }}>
                    {user.farmDescription || 'No description listed yet. Head over to the "Farm Profile" tab to write a description and tell your customers about your farming methods!'}
                  </p>
                </div>
              </div>
            )}

            {/* 2. FARM PROFILE TAB */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Manage Farm Details</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  Update your contact details, store information, and drag your pin to relocate your stand.
                </p>

                {profileError && (
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
                    {profileError}
                  </div>
                )}

                {profileSuccess && (
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
                    {profileSuccess}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit}>
                  
                  {/* General Profile fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Sprout size={14} /> Farm Name
                      </label>
                      <input
                        type="text"
                        name="farmName"
                        className="form-input"
                        value={profileData.farmName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Phone size={14} /> Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-input"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} /> Physical Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      className="form-input"
                      value={profileData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FileText size={14} /> Farm Description
                    </label>
                    <textarea
                      name="farmDescription"
                      className="form-input"
                      value={profileData.farmDescription}
                      onChange={handleInputChange}
                      placeholder="Share details about what you grow, organic certifications, and hours of operation..."
                      rows="4"
                    />
                  </div>

                  {/* Relocation Map */}
                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label className="form-label">
                      <strong>Adjust Location Pin</strong> (Move marker on map to relocate farm coordinates)
                    </label>
                    <div style={{ margin: '0.5rem 0 1rem' }}>
                      <MapInput
                        lat={parseFloat(profileData.latitude)}
                        lng={parseFloat(profileData.longitude)}
                        onChange={handleCoordinatesChange}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="form-group">
                      <label className="form-label">Current Latitude</label>
                      <input
                        type="text"
                        name="latitude"
                        className="form-input"
                        value={profileData.latitude}
                        readOnly
                        style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Current Longitude</label>
                      <input
                        type="text"
                        name="longitude"
                        className="form-input"
                        value={profileData.longitude}
                        readOnly
                        style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={profileLoading}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Save size={18} />
                    {profileLoading ? 'Saving changes...' : 'Save Profile Changes'}
                  </button>

                </form>
              </div>
            )}

            {/* 3. INVENTORY CATALOG PLACEHOLDER (Will be built fully in Milestone 7) */}
            {activeTab === 'inventory' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Product Catalog / Inventory</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  View, add, edit, and delete your listed products.
                </p>
                <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                  <h3>Inventory CRUD Modals Coming Soon</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    This section will be fully implemented in the next milestone (Milestone 7).
                  </p>
                </div>
              </div>
            )}

          </section>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
