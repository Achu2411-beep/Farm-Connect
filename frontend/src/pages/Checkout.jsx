import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, MapPin, Phone, User, CheckCircle, ArrowRight, QrCode, CreditCard, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { cart, clearCart, totalAmount } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryAddress: '',
    paymentMethod: 'COD' // 'COD' or 'UPI'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Load user details if logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setFormData(prev => ({
        ...prev,
        name: u.username || '',
        phone: u.phone || '',
        deliveryAddress: u.address || ''
      }));
    }
  }, []);

  const deliveryFee = cart.length > 0 ? 30 : 0;
  const grandTotal = totalAmount + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in or sign up as a buyer to complete your order.');
      setLoading(false);
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          deliveryAddress: formData.deliveryAddress,
          phone: formData.phone,
          paymentMethod: formData.paymentMethod
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order.');
      }

      // Success! Clear cart and display confirmation
      clearCart();
      setOrderSuccess(data.orders);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 80px)', padding: '4rem 1rem' }}>
        <div className="container" style={{ maxWidth: '650px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2.5rem' }}>
            <div style={{
              display: 'inline-flex',
              background: 'var(--primary-pale)',
              color: 'var(--primary-medium)',
              padding: '1.25rem',
              borderRadius: '50%',
              marginBottom: '1.5rem'
            }}>
              <CheckCircle size={54} />
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-deep)', marginBottom: '0.75rem' }}>
              Order Placed Successfully!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
              Thank you for supporting local farmers. Your order has been dispatched directly to the farmer partner(s).
            </p>

            <div style={{ background: '#faf9f6', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'left', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--primary-deep)' }}>
                Generated Order(s):
              </h3>
              {orderSuccess.map((ord, idx) => (
                <div key={ord._id || idx} style={{ borderBottom: idx !== orderSuccess.length - 1 ? '1px dashed #cbd5e1' : 'none', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '700' }}>
                    <span>🌾 {ord.farmName}</span>
                    <span style={{ color: 'var(--accent-clay)' }}>₹{ord.totalAmount.toFixed(2)}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Status: <strong style={{ color: 'var(--primary-medium)' }}>{ord.status}</strong> • Payment: {ord.paymentMethod}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/my-orders" className="btn btn-primary" style={{ padding: '0.8rem 1.6rem' }}>
                Track Order Status <ArrowRight size={16} />
              </Link>
              <Link to="/farms" className="btn btn-secondary">
                Back to Directory
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 80px)', padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '950px' }}>
        
        <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-deep)', marginBottom: '0.5rem' }}>
          Checkout & Delivery Details
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
          Complete your delivery location and payment preference to send order to local growers.
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.85rem 1.25rem', borderRadius: '8px', marginBottom: '2rem', fontSize: '0.95rem', fontWeight: '600' }}>
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
            
            {/* Left Inputs Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Delivery Address Box */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--primary-deep)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={18} /> 1. Delivery Contact Details
                </h3>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={14} /> Full Name / Buyer Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={14} /> Phone Number for Delivery Driver *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} /> Full Delivery Address *
                  </label>
                  <textarea
                    name="deliveryAddress"
                    className="form-input"
                    placeholder="House/Apartment number, street name, neighborhood landmark, pin code..."
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
              </div>

              {/* Payment Method Box */}
              <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', color: 'var(--primary-deep)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CreditCard size={18} /> 2. Select Payment Method
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* COD Option */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: formData.paymentMethod === 'COD' ? '2px solid var(--primary-medium)' : '1px solid var(--border-color)',
                    background: formData.paymentMethod === 'COD' ? 'var(--primary-pale)' : 'white',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleInputChange}
                    />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--primary-deep)', fontSize: '0.95rem' }}>
                        Cash on Delivery (COD)
                      </strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Pay cash directly to the farmer/delivery person upon receipt.
                      </span>
                    </div>
                  </label>

                  {/* Direct Farmer UPI Simulation */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: formData.paymentMethod === 'UPI' ? '2px solid var(--primary-medium)' : '1px solid var(--border-color)',
                    background: formData.paymentMethod === 'UPI' ? 'var(--primary-pale)' : 'white',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={formData.paymentMethod === 'UPI'}
                      onChange={handleInputChange}
                    />
                    <div>
                      <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-deep)', fontSize: '0.95rem' }}>
                        <QrCode size={16} /> Direct Farmer UPI Pay (Simulated)
                      </strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Instant digital transfer straight to farmer's local GPay/PhonePe account.
                      </span>
                    </div>
                  </label>

                </div>
              </div>

            </div>

            {/* Right Summary & Action Box */}
            <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--primary-deep)' }}>
                Payload Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Items Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Direct Delivery Fee</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>₹{deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--primary-deep)' }}>
                <span>Grand Total</span>
                <span style={{ color: 'var(--accent-clay)' }}>₹{grandTotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || cart.length === 0}
                style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}
              >
                <ShieldCheck size={18} />
                {loading ? 'Processing Order...' : 'Confirm & Place Order'}
              </button>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};

export default Checkout;
