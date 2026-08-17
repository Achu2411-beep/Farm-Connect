import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { MapPin, Search, Store, Phone, ArrowRight, Sprout } from 'lucide-react';

const ExploreFarms = () => {
  const [farms, setFarms] = useState([]);
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/farms');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load farm directory.');
      }

      setFarms(data);
      setFilteredFarms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter farms by search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFarms(farms);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredFarms(
        farms.filter(
          f =>
            f.farmName.toLowerCase().includes(query) ||
            f.address.toLowerCase().includes(query) ||
            (f.farmDescription && f.farmDescription.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, farms]);

  // Mount Leaflet Map with multi-farm markers
  useEffect(() => {
    if (loading || farms.length === 0 || !mapContainerRef.current) return;

    // Default center (average of all farms or initial coordinate)
    const defaultLat = farms[0]?.latitude || 10.8505;
    const defaultLng = farms[0]?.longitude || 76.2711;

    // Leaflet marker icon configuration
    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for filtered farms
    filteredFarms.forEach(farm => {
      if (farm.latitude && farm.longitude) {
        const marker = L.marker([farm.latitude, farm.longitude]).addTo(mapRef.current);
        
        const popupContent = `
          <div style="padding: 4px; min-width: 180px;">
            <h4 style="margin: 0 0 6px 0; color: #1b4332; font-size: 1rem; font-weight: 700;">${farm.farmName}</h4>
            <p style="margin: 0 0 8px 0; color: #64748b; font-size: 0.8rem; line-height: 1.3;">📍 ${farm.address}</p>
            <a href="/farm/${farm._id}" style="display: inline-block; background: #2d6a4f; color: white; text-decoration: none; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 700;">Visit Farm Store &rarr;</a>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
      }
    });

    return () => {
      // Clean up map on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, [filteredFarms, loading]);

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 80px)', padding: '2rem 0' }}>
      <div className="container">
        
        {/* Banner Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'var(--primary-pale)',
            borderRadius: '50px',
            color: 'var(--primary-medium)',
            fontWeight: '700',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            <Sprout size={16} /> Interactive Local Directory
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-deep)', marginBottom: '0.5rem' }}>
            Discover Local Farms Near You
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            Locate verified neighborhood stands on the map, explore fresh harvests, and buy direct from local growers.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '600px', margin: '0 auto 2rem', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search farm name, location, or produce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.8rem', borderRadius: '50px', fontSize: '1rem', boxShadow: 'var(--shadow-sm)' }}
          />
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Interactive Map Display */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-deep)' }}>
              Interactive Farm Map ({filteredFarms.length} {filteredFarms.length === 1 ? 'Farm' : 'Farms'} Located)
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click map pins to view storefront links</span>
          </div>
          
          <div 
            ref={mapContainerRef} 
            style={{ 
              height: '400px', 
              width: '100%', 
              borderRadius: 'var(--radius-md)', 
              boxShadow: 'var(--shadow-md)',
              border: '1.5px solid var(--border-color)',
              overflow: 'hidden'
            }} 
          />
        </div>

        {/* Farm Cards Directory Grid */}
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--primary-deep)' }}>
            All Verified Partner Farms
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>Loading farm map directory...</p>
            </div>
          ) : filteredFarms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <Store size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
              <h3>No Farms Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Try adjusting your search query or zoom out on the map.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem'
            }}>
              {filteredFarms.map((farm) => (
                <div key={farm._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{
                        background: 'var(--primary-pale)',
                        color: 'var(--primary-medium)',
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Store size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary-deep)', margin: 0 }}>
                          {farm.farmName}
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-medium)', fontWeight: '600' }}>
                          Verified Direct Partner
                        </span>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <MapPin size={16} style={{ flexShrink: 0, marginTop: '3px', color: 'var(--primary-medium)' }} />
                      {farm.address}
                    </p>

                    {farm.farmDescription && (
                      <p style={{ color: 'var(--text-dark)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {farm.farmDescription}
                      </p>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Phone size={14} /> {farm.phone}
                    </span>
                    <Link to={`/farm/${farm._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.3rem' }}>
                      Visit Storefront <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ExploreFarms;
