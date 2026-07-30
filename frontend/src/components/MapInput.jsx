import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const MapInput = ({ lat, lng, onChange }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Default location (Central Kerala, India, change as needed)
    const initialLat = lat || 10.8505;
    const initialLng = lng || 76.2711;

    // Fix default marker icon issues in Leaflet with Vite bundling
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
      // Create Map
      mapRef.current = L.map(mapContainerRef.current).setView([initialLat, initialLng], 12);

      // Add OSM tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Create draggable Marker
      markerRef.current = L.marker([initialLat, initialLng], {
        draggable: true
      }).addTo(mapRef.current);

      // Bind drag end event
      markerRef.current.on('dragend', (e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        onChange(position.lat.toFixed(6), position.lng.toFixed(6));
      });

      // Bind click on map event to move marker
      mapRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        markerRef.current.setLatLng([lat, lng]);
        onChange(lat.toFixed(6), lng.toFixed(6));
      });
    }

    return () => {
      // Clean up map on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker position if props change externally
  useEffect(() => {
    if (mapRef.current && markerRef.current && lat && lng) {
      const currentLatLng = markerRef.current.getLatLng();
      const numLat = parseFloat(lat);
      const numLng = parseFloat(lng);
      
      if (!isNaN(numLat) && !isNaN(numLng)) {
        if (numLat.toFixed(4) !== currentLatLng.lat.toFixed(4) || 
            numLng.toFixed(4) !== currentLatLng.lng.toFixed(4)) {
          markerRef.current.setLatLng([numLat, numLng]);
          mapRef.current.panTo([numLat, numLng]);
        }
      }
    }
  }, [lat, lng]);

  return (
    <div style={{ position: 'relative' }}>
      <div 
        ref={mapContainerRef} 
        className="map-container"
        style={{ 
          height: '280px', 
          width: '100%', 
          borderRadius: '10px',
          boxShadow: 'var(--shadow-sm)',
          border: '1.5px solid var(--border-color)'
        }} 
      />
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: '700',
        zIndex: 1000,
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--primary-deep)',
        border: '1px solid rgba(45, 106, 79, 0.15)'
      }}>
        Drag marker or click map to locate farm
      </div>
    </div>
  );
};

export default MapInput;
