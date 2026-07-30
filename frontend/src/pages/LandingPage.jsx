import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, MapPin, TrendingUp, ShieldCheck, ArrowRight, Users, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section" style={{
        background: 'linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 183, 136, 0.08) 100%)',
        padding: '6rem 5% 7rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(27, 67, 50, 0.06)'
      }}>
        {/* Decorative elements */}
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

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: 0, maxWidth: '850px' }}>
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
            marginBottom: '2rem'
          }}>
            <Sprout size={16} /> Empowering Local Agriculture
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            lineHeight: 1.15,
            color: 'var(--primary-deep)',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em'
          }}>
            Connect Your Farm <br />
            <span style={{ color: 'var(--primary-light)' }}>Directly to Your Community</span>
          </h1>
          
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '650px',
            margin: '0 auto 3rem',
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
            <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '1rem 2.2rem' }}>
              Register Your Farm <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.05rem', padding: '1rem 2.2rem' }}>
              Farmer Dashboard Login
            </Link>
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
      <section style={{ padding: '6rem 5% 5rem', background: '#ffffff' }}>
        <div className="container" style={{ padding: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', fontWeight: '800' }}>
              Why List on Local Farm Connect?
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
        padding: '5rem 5%',
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
          maxWidth: '700px'
        }}>
          <h2 style={{ color: 'white', fontSize: '2.25rem', marginBottom: '1rem', fontWeight: '800' }}>
            Ready to grow your community reach?
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            Set up your farm profile in minutes. Start listing your organic vegetables, fruits, dairy, or fresh poultry and connect directly with local neighborhoods.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-accent" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
              Get Started Now <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{
              background: 'transparent',
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              hover: { background: 'white' }
            }}>
              Farmer Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
