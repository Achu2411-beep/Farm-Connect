import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Store, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const navigate = useNavigate();

  // Group items by farmName
  const groupedByFarm = cart.reduce((groups, item) => {
    const farmName = item.farm?.farmName || 'Direct Local Farm';
    if (!groups[farmName]) {
      groups[farmName] = {
        farm: item.farm,
        items: []
      };
    }
    groups[farmName].items.push(item);
    return groups;
  }, {});

  const deliveryFee = cart.length > 0 ? 30 : 0; // Flat nominal delivery / local farm trip fee
  const grandTotal = totalAmount + deliveryFee;

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 80px)', padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--primary-deep)', marginBottom: '0.25rem' }}>
              Your Produce Cart
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Review items sourced directly from local neighborhood farms.
            </p>
          </div>

          {cart.length > 0 && (
            <button onClick={clearCart} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#dc2626' }}>
              <Trash2 size={15} /> Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <ShoppingBag size={56} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.4 }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Explore nearby farm stands on our interactive map and add fresh harvest to your cart!
            </p>
            <Link to="/farms" className="btn btn-primary" style={{ padding: '0.8rem 1.8rem' }}>
              <Store size={18} /> Explore Local Farms
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
            
            {/* Left Items Column (Grouped by Farm) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Object.keys(groupedByFarm).map((farmName) => (
                <div key={farmName} className="card" style={{ padding: '1.5rem' }}>
                  
                  {/* Farm Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                    <Store size={20} style={{ color: 'var(--primary-medium)' }} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--primary-deep)', margin: 0 }}>
                      {farmName}
                    </h3>
                  </div>

                  {/* Items list for this farm */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {groupedByFarm[farmName].items.map(({ product, quantity }) => (
                      <div key={product._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px dashed #e2e8f0', paddingBottom: '1rem' }}>
                        
                        {/* Thumbnail */}
                        <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                          {product.image ? (
                            <img src={`http://localhost:5000${product.image}`} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                              <ShoppingBag size={24} />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 0.2rem 0', color: 'var(--text-dark)' }}>
                            {product.title}
                          </h4>
                          <span style={{ fontSize: '0.85rem', color: 'var(--accent-clay)', fontWeight: '700' }}>
                            ₹{parseFloat(product.price).toFixed(2)} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/{product.unit}</span>
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '8px' }}>
                          <button
                            onClick={() => updateQuantity(product._id, -1)}
                            style={{ border: 'none', background: 'white', borderRadius: '4px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontWeight: '700', fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product._id, 1)}
                            style={{ border: 'none', background: 'white', borderRadius: '4px', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Subtotal & Delete */}
                        <div style={{ textAlign: 'right', minWidth: '80px' }}>
                          <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--primary-deep)' }}>
                            ₹{(product.price * quantity).toFixed(2)}
                          </strong>
                          <button
                            onClick={() => removeFromCart(product._id)}
                            style={{ border: 'none', background: 'none', color: '#dc2626', fontSize: '0.75rem', cursor: 'pointer', marginTop: '0.2rem' }}
                          >
                            Remove
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>

            {/* Right Summary Order Box */}
            <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--primary-deep)' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Produce Items Subtotal</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Local Direct Delivery</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>₹{deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--primary-deep)' }}>
                <span>Total Payload</span>
                <span style={{ color: 'var(--accent-clay)' }}>₹{grandTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary"
                style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/farms" style={{ fontSize: '0.85rem', color: 'var(--primary-medium)', fontWeight: '600' }}>
                  Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;
