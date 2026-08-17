import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle, Truck, Package, MapPin, Store, ArrowLeft } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view your orders.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load order history.');
      }

      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return { bg: '#dbeafe', color: '#1e40af', icon: <CheckCircle size={14} />, text: 'Order Confirmed by Farmer' };
      case 'Out for Delivery':
        return { bg: '#f3e8ff', color: '#6b21a8', icon: <Truck size={14} />, text: 'Out for Delivery' };
      case 'Delivered':
        return { bg: '#dcfce7', color: '#166534', icon: <Package size={14} />, text: 'Delivered' };
      case 'Cancelled':
        return { bg: '#fee2e2', color: '#991b1b', icon: <Clock size={14} />, text: 'Cancelled' };
      default:
        return { bg: '#fef3c7', color: '#92400e', icon: <Clock size={14} />, text: 'Pending Farmer Confirmation' };
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 80px)', padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-deep)', marginBottom: '0.25rem' }}>
              My Orders
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Track order fulfillment and local farm deliveries.
            </p>
          </div>
          <Link to="/farms" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            <Store size={16} /> Explore Farms
          </Link>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.85rem 1.25rem', borderRadius: '8px', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <ShoppingBag size={56} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.4 }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Orders Found</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              You haven't placed any orders yet. Visit nearby farm storefronts to buy fresh produce!
            </p>
            <Link to="/farms" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem' }}>
              Browse Farms & Produce
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => {
              const badge = getStatusBadge(order.status);
              return (
                <div key={order._id} className="card" style={{ padding: '1.75rem' }}>
                  
                  {/* Order Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <Store size={18} style={{ color: 'var(--primary-medium)' }} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-deep)', margin: 0 }}>
                          {order.farmName}
                        </h3>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Order ID: <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>#{order._id}</span> • Placed: {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div style={{
                      background: badge.bg,
                      color: badge.color,
                      padding: '0.4rem 0.8rem',
                      borderRadius: '50px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      {badge.icon} {badge.text}
                    </div>
                  </div>

                  {/* Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span>
                          <strong style={{ color: 'var(--primary-deep)' }}>{item.title}</strong> x {item.quantity} {item.unit}s
                        </span>
                        <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery & Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '1rem', fontSize: '0.85rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={14} /> Deliver to: <strong style={{ color: 'var(--text-dark)' }}>{order.deliveryAddress}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', marginRight: '0.75rem' }}>Payment: {order.paymentMethod}</span>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--accent-clay)' }}>Total: ₹{order.totalAmount.toFixed(2)}</strong>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyOrders;
