import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import L from 'leaflet';
import { MapPin, Phone, Mail, Store, Sprout, ShoppingCart, Check, Camera, ArrowLeft, Star, MessageSquare, Send } from 'lucide-react';

const FarmStorefront = () => {
  const { id } = useParams();
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedItems, setAddedItems] = useState({});

  // Reviews States
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    fetchFarmDetails();
    fetchReviews();
  }, [id]);

  const fetchFarmDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/farms/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Farm not found.');
      setFarm(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/farm/${id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Mount Leaflet Map
  useEffect(() => {
    if (!farm || !farm.latitude || !farm.longitude || !mapContainerRef.current) return;

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
      mapRef.current = L.map(mapContainerRef.current).setView([farm.latitude, farm.longitude], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);

      L.marker([farm.latitude, farm.longitude])
        .addTo(mapRef.current)
        .bindPopup(`<strong>${farm.farmName}</strong><br/>${farm.address}`)
        .openPopup();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [farm]);

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = existingCart.findIndex(item => item.product._id === product._id);

    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push({
        product,
        farm: {
          _id: farm._id,
          farmName: farm.farmName,
          address: farm.address,
          phone: farm.phone
        },
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    setAddedItems(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [product._id]: false })), 1500);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    setReviewLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setReviewError('Please log in to submit a review.');
      setReviewLoading(false);
      return;
    }

    if (!newComment.trim()) {
      setReviewError('Please write a review comment.');
      setReviewLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          farmId: id,
          rating: newRating,
          comment: newComment
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit review.');

      setReviewSuccess('Review posted successfully!');
      setNewComment('');
      fetchReviews();
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  // Average Rating math
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  if (loading) {
    return <div style={{ padding: '5rem', textAlign: 'center' }}><p style={{ color: 'var(--text-muted)' }}>Loading farm storefront...</p></div>;
  }

  if (error || !farm) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <Store size={48} style={{ color: '#dc2626', marginBottom: '1rem' }} />
          <h2>Farm Not Found</h2>
          <Link to="/farms" className="btn btn-primary" style={{ marginTop: '1rem' }}><ArrowLeft size={16} /> Return to Farm Directory</Link>
        </div>
      </div>
    );
  }

  // Clean phone number for WhatsApp
  const cleanPhone = farm.phone.replace(/[^0-9]/g, '');

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 80px)', padding: '2rem 0' }}>
      <div className="container">
        
        <Link to="/farms" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-medium)', fontWeight: '700', marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} /> Back to All Farms
        </Link>

        {/* Farm Hero Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-deep) 0%, var(--primary-medium) 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 3rem',
          color: 'white',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '2.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sprout size={14} style={{ color: 'var(--primary-light)' }} /> Direct Partner Storefront
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(245, 158, 11, 0.25)', color: '#fde047', padding: '0.3rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '800' }}>
                <Star size={14} fill="#fde047" /> {avgRating} ({reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'})
              </span>
            </div>

            <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>
              {farm.farmName}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', maxWidth: '650px' }}>
              {farm.farmDescription || 'Welcome to our farm! We grow fresh, sustainable, and pesticide-free produce for our local community.'}
            </p>

            {/* Direct Contact Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <a 
                href={`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(farm.farmName)},%20I%20saw%20your%20produce%20on%20Local%20Farm%20Connect!`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-accent" 
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <MessageSquare size={16} /> Contact via WhatsApp
              </a>
              <a 
                href={`tel:${farm.phone}`} 
                className="btn btn-secondary" 
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'white', borderColor: 'rgba(255,255,255,0.3)', background: 'transparent' }}
              >
                <Phone size={16} /> Call Farmer: {farm.phone}
              </a>
            </div>
          </div>

          <div style={{ height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)' }}>
            <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        {/* Harvest Catalog */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-deep)', marginBottom: '1.5rem' }}>
            Available Fresh Produce ({farm.products.length})
          </h2>

          {farm.products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <Store size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
              <h3>No Produce Currently Listed</h3>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {farm.products.map((product) => (
                <div key={product._id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ height: '180px', width: '100%', backgroundColor: '#f1f5f9', position: 'relative', display: 'flex', alignItems: 'center', justify: 'center', overflow: 'hidden' }}>
                      {product.image ? (
                        <img src={`http://localhost:5000${product.image}`} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ textAlign: 'center', color: '#94a3b8' }}><Camera size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} /><span style={{ fontSize: '0.8rem' }}>Fresh Produce</span></div>
                      )}
                      <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(27, 67, 50, 0.95)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>{product.category}</span>
                    </div>

                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--primary-deep)', marginBottom: '0.4rem' }}>{product.title}</h3>
                      {product.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</p>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                        <div><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PRICE</span><strong style={{ color: 'var(--accent-clay)', fontSize: '1.2rem' }}>₹{parseFloat(product.price).toFixed(2)}</strong><span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/{product.unit}</span></div>
                        <div style={{ textAlign: 'right' }}><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>STOCK</span><span style={{ fontSize: '0.85rem', fontWeight: '700', color: product.stock > 0 ? 'var(--primary-medium)' : '#dc2626' }}>{product.stock > 0 ? `${product.stock} ${product.unit}s` : 'Sold Out'}</span></div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '1rem 1.25rem', background: '#faf9f6', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={() => handleAddToCart(product)} disabled={product.stock <= 0} className="btn btn-primary" style={{ width: '100%', padding: '0.7rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', backgroundColor: addedItems[product._id] ? 'var(--primary-deep)' : 'var(--primary-medium)' }}>
                      {addedItems[product._id] ? <><Check size={16} /> Added to Cart!</> : <><ShoppingCart size={16} /> Add to Cart</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Reviews Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
          
          {/* Reviews List */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-deep)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} fill="var(--accent-gold)" color="var(--accent-gold)" /> Customer Reviews & Ratings ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No reviews yet. Be the first customer to leave a star rating for {farm.farmName}!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reviews.map((rev) => (
                  <div key={rev._id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-dark)' }}>{rev.consumerName}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Star icons */}
                    <div style={{ display: 'flex', gap: '2px', color: 'var(--accent-gold)', marginBottom: '0.4rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < rev.rating ? "var(--accent-gold)" : "none"} color={i < rev.rating ? "var(--accent-gold)" : "#cbd5e1"} />
                      ))}
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write a Review Box */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-deep)', marginBottom: '1rem' }}>
              Write a Customer Review
            </h3>

            {reviewError && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>{reviewError}</div>}
            {reviewSuccess && <div style={{ background: '#e8f5e9', color: 'var(--primary-medium)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>{reviewSuccess}</div>}

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Star Rating *</label>
                <div style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer', margin: '0.4rem 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <Star size={24} fill={star <= newRating ? "var(--accent-gold)" : "none"} color={star <= newRating ? "var(--accent-gold)" : "#cbd5e1"} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review / Feedback *</label>
                <textarea
                  className="form-input"
                  placeholder="Share details about fresh quality, produce taste, or farmer pickup..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows="4"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={reviewLoading} style={{ width: '100%', padding: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <Send size={16} /> {reviewLoading ? 'Posting...' : 'Submit Review'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FarmStorefront;
