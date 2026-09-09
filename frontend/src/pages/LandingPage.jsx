import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, MapPin, TrendingUp, ShieldCheck, ArrowRight, ShoppingBag, CheckCircle, LogIn, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section" style={{
        background: 'linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 183, 136, 0.08) 100%)',
        padding: '5rem 5% 5.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(27, 67, 50, 0.06)'
      }}>
        {/* Decorative background blobs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(82,183,136,0.1) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-5%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,106,79,0.06) 0%, rgba(255,255,255,0) 70%)',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: 0, maxWidth: '880px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'rgba(45, 106, 79, 0.1)',
            borderRadius: '50px',
            color: 'var(--primary-medium)',
            fontWeight: '700',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <Sprout size={16} /> Empowering Local Agriculture
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: '800',
            lineHeight: 1.15,
            color: 'var(--primary-deep)',
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em'
          }}>
            Connect Your Farm <br />
            <span style={{ color: 'var(--primary-light)' }}>Directly to Your Community</span>
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 auto 2.5rem',
            fontWeight: '500'
          }}>
            Ditch the middlemen. Register your farm, locate your stand on our map, list your harvest, and trade directly with local buyers in real time.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <Link to="/farms" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.95rem 2.2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} /> Explore Local Farms
            </Link>
            <Link to="/register" className="btn btn-secondary" style={{ fontSize: '1.05rem', padding: '0.95rem 2.2rem' }}>
              Register Your Farm
            </Link>
          </div>
        </div>
      </section>

      {/* Dedicated Portals Section: Separate Farmer & Consumer Logins */}
      <section style={{
        padding: '4.5rem 5% 5rem',
        background: '#ffffff',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ padding: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 1rem',
              background: 'var(--primary-pale)',
              borderRadius: '50px',
              color: 'var(--primary-deep)',
              fontWeight: '700',
              fontSize: '0.85rem',
              marginBottom: '0.85rem'
            }}>
              <LogIn size={15} /> Portals & Logins
            </div>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.4rem)', fontWeight: '800', marginBottom: '0.65rem', color: 'var(--primary-deep)' }}>
              Separate Portals for Farmers & Consumers
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '620px', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
              Sign in to your dedicated account to manage your harvest listings or order fresh local farm produce.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '960px',
            margin: '0 auto'
          }}>
            {/* Farmer Card */}
            <div style={{
              background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.25rem 2rem',
              border: '2px solid #bbf7d0',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'var(--transition)'
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '50px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  marginBottom: '1.25rem'
                }}>
                  🌾 For Farmers & Growers
                </div>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: 'var(--primary-deep)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  boxShadow: '0 6px 16px rgba(27, 67, 50, 0.18)'
                }}>
                  <Sprout size={28} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.6rem', color: 'var(--primary-deep)' }}>
                  Farmer Portal
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.55', marginBottom: '1.5rem' }}>
                  Manage your farm's digital profile, pin your harvest stand on the map, update stock and prices in real time, and fulfill direct customer orders.
                </p>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.1rem', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.55rem', fontSize: '0.88rem', color: '#166534', fontWeight: '600' }}>
                    <CheckCircle size={16} /> Interactive Map Geo-Pinning
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.55rem', fontSize: '0.88rem', color: '#166534', fontWeight: '600' }}>
                    <CheckCircle size={16} /> 100% Direct Profits & Zero Commission
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.88rem', color: '#166534', fontWeight: '600' }}>
                    <CheckCircle size={16} /> Live Inventory & Order Management
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <Link to="/login/farmer" className="btn btn-primary" style={{ padding: '0.85rem', fontSize: '0.95rem', width: '100%' }}>
                  <Sprout size={17} /> Farmer Login <ChevronRight size={15} />
                </Link>
                <Link to="/register" className="btn btn-secondary" style={{ padding: '0.8rem', fontSize: '0.9rem', width: '100%', borderColor: '#bbf7d0' }}>
                  Register New Farm
                </Link>
              </div>
            </div>

            {/* Consumer Card */}
            <div style={{
              background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.25rem 2rem',
              border: '2px solid #fed7aa',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'var(--transition)'
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#ffedd5',
                  color: '#9a3412',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '50px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  marginBottom: '1.25rem'
                }}>
                  🛒 For Fresh Food Buyers
                </div>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: 'var(--accent-clay)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  boxShadow: '0 6px 16px rgba(198, 113, 67, 0.18)'
                }}>
                  <ShoppingBag size={28} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.6rem', color: 'var(--text-dark)' }}>
                  Consumer Portal
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.55', marginBottom: '1.5rem' }}>
                  Locate verified organic and local farms in your neighborhood. Browse freshly picked fruits, greens, and veggies, and order direct at genuine farm-gate rates.
                </p>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.1rem', marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.55rem', fontSize: '0.88rem', color: '#9a3412', fontWeight: '600' }}>
                    <CheckCircle size={16} /> Direct-from-Farm Freshness
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.55rem', fontSize: '0.88rem', color: '#9a3412', fontWeight: '600' }}>
                    <CheckCircle size={16} /> Zero Middlemen Price Markups
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.88rem', color: '#9a3412', fontWeight: '600' }}>
                    <CheckCircle size={16} /> Convenient Cart & Direct Orders
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <Link to="/login/consumer" className="btn btn-accent" style={{ padding: '0.95rem', fontSize: '1rem', width: '100%' }}>
                  <ShoppingBag size={17} /> Consumer Login <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '2.5rem 5%',
        background: 'var(--primary-deep)',
        color: 'white',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div className="container" style={{
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-light)', marginBottom: '0.25rem' }}>100%</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', fontWeight: '600' }}>Direct-to-Consumer Sales</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-light)', marginBottom: '0.25rem' }}>0%</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', fontWeight: '600' }}>Platform Middleman Fees</p>
          </div>
          <div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-light)', marginBottom: '0.25rem' }}>Real-Time</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', fontWeight: '600' }}>Interactive Map Pinning</p>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section style={{ padding: '5.5rem 5% 5rem', background: '#faf9f6' }}>
        <div className="container" style={{ padding: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', fontWeight: '800' }}>
              Why List on Farmley Connect?
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
              Everything a modern local farmer needs to build digital presence, reach neighborhood markets, and manage fresh inventory.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem'
          }}>
            {/* Feature 1 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: 'var(--primary-pale)',
                color: 'var(--primary-medium)',
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '700' }}>Geographic Map Pins</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Use our integrated Leaflet map to place a pin directly on your farm location or farm-stand. Consumers can easily find you and route to your address.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: 'var(--primary-pale)',
                color: 'var(--primary-medium)',
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '700' }}>Real-time Catalog Control</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Add, edit, or delete items instantly. Define pricing per unit (kg, dozen, bunches), stock numbers, and upload beautiful pictures of your harvest.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: 'var(--primary-pale)',
                color: 'var(--primary-medium)',
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '700' }}>Verified Farmer Profiles</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Security first. We verify your signup with email OTP verification codes. Once activated, manage your coordinates and farm details from a secure dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{
        padding: '4.5rem 5%',
        background: 'linear-gradient(135deg, var(--primary-deep) 0%, #153527 100%)',
        color: 'white',
        position: 'relative'
      }}>
        <div className="container" style={{
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '720px'
        }}>
          <h2 style={{ color: 'white', fontSize: '2.15rem', marginBottom: '0.85rem', fontWeight: '800' }}>
            Ready to grow your community reach?
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.82)', marginBottom: '2rem', fontSize: '1.02rem', lineHeight: '1.6' }}>
            Set up your farm profile or sign in as a buyer to support local growers. Connect directly with fresh organic produce in your neighborhood.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/login/farmer" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
              <Sprout size={18} /> Farmer Portal
            </Link>
            <Link to="/login/consumer" className="btn btn-accent" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
              <ShoppingBag size={18} /> Consumer Portal
            </Link>
            <Link to="/farms" className="btn btn-secondary" style={{
              background: 'transparent',
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)'
            }}>
              Explore Farms <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
