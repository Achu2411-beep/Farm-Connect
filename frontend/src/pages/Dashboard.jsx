import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User as UserIcon, ShoppingBag, MapPin, Phone, FileText, CheckCircle, Save, Sprout, Plus, Edit, Trash2, Camera, Package, Tag, Coins, X, Truck, Clock, ShieldCheck } from 'lucide-react';
import MapInput from '../components/MapInput';

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'profile', 'inventory', 'orders'
  
  // Profile Form States
  const [profileData, setProfileData] = useState({
    farmName: '',
    phone: '',
    address: '',
    farmDescription: '',
    latitude: '',
    longitude: '',
    maxDeliveryRadius: '100'
  });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Products Inventory States
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');

  // Farmer Incoming Orders States
  const [farmerOrders, setFarmerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');

  // Modals States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Delivery OTP Modal States
  const [otpModalOrder, setOtpModalOrder] = useState(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Add/Edit Product Form States
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Vegetables',
    unit: 'kg',
    price: '',
    stock: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Redirect to login if user state doesn't exist
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setProfileData({
      farmName: user.farmName || '',
      phone: user.phone || '',
      address: user.address || '',
      farmDescription: user.farmDescription || '',
      latitude: user.latitude !== undefined ? user.latitude.toString() : '10.850500',
      longitude: user.longitude !== undefined ? user.longitude.toString() : '76.271100',
      maxDeliveryRadius: user.maxDeliveryRadius !== undefined ? user.maxDeliveryRadius.toString() : '100'
    });
  }, [user, navigate]);

  // Fetch data when switching tabs
  useEffect(() => {
    if (activeTab === 'inventory' || activeTab === 'overview') {
      fetchProducts();
    }
    if (activeTab === 'orders' || activeTab === 'overview') {
      fetchFarmerOrders();
    }
  }, [activeTab]);

  if (!user) {
    return null;
  }

  // Fetch Farmer Products
  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError('');
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to load products.');
      setProducts(data);
    } catch (err) {
      setProductsError(err.message);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch Farmer Received Orders
  const fetchFarmerOrders = async () => {
    setOrdersLoading(true);
    setOrdersError('');
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/orders/farmer-orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to load orders.');
      setFarmerOrders(data);
    } catch (err) {
      setOrdersError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Update order status (Farmer action)
  const handleUpdateOrderStatus = async (order, newStatus) => {
    if (newStatus === 'Delivered') {
      // Open 4-digit Delivery Handover OTP Modal
      setOtpModalOrder(order);
      setEnteredOtp('');
      setOtpError('');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${order._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update status.');
      }

      // Refresh farmer orders
      fetchFarmerOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  // Submit & verify 4-digit Delivery Handover OTP
  const handleVerifyAndDeliver = async (e) => {
    e.preventDefault();
    if (!otpModalOrder) return;
    setOtpError('');
    setOtpLoading(true);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${otpModalOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'Delivered',
          deliveryOtp: enteredOtp
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Verification failed.');

      setOtpModalOrder(null);
      setEnteredOtp('');
      fetchFarmerOrders();
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoordinatesChange = (lat, lng) => {
    setProfileData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    const token = localStorage.getItem('token');
    if (!token) return;

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
          longitude: parseFloat(profileData.longitude),
          maxDeliveryRadius: parseFloat(profileData.maxDeliveryRadius)
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile.');

      setProfileSuccess('Profile and delivery radius updated successfully!');
      
      const updatedUser = {
        ...user,
        farmName: data.user.farmName,
        phone: data.user.phone,
        address: data.user.address,
        farmDescription: data.user.farmDescription,
        latitude: data.user.latitude,
        longitude: data.user.longitude,
        maxDeliveryRadius: data.user.maxDeliveryRadius
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetProductForm = () => {
    setProductForm({ title: '', category: 'Vegetables', unit: 'kg', price: '', stock: '', description: '' });
    setImageFile(null);
    setImagePreview(null);
    setFormError('');
  };

  const openAddModal = () => { resetProductForm(); setIsAddModalOpen(true); };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setProductForm({
      title: product.title,
      category: product.category,
      unit: product.unit,
      price: product.price,
      stock: product.stock,
      description: product.description || ''
    });
    setImageFile(null);
    setImagePreview(product.image ? `http://localhost:5000${product.image}` : null);
    setFormError('');
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const token = localStorage.getItem('token');
    if (!token) return;

    const { title, category, unit, price, stock, description } = productForm;
    if (!title || !category || !unit || !price || !stock) {
      setFormError('Please fill in all required fields.');
      setFormLoading(false);
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append('title', title);
    formDataObj.append('category', category);
    formDataObj.append('unit', unit);
    formDataObj.append('price', price);
    formDataObj.append('stock', stock);
    formDataObj.append('description', description);
    if (imageFile) formDataObj.append('image', imageFile);

    try {
      const url = isEditModalOpen 
        ? `http://localhost:5000/api/products/${currentProduct._id}`
        : 'http://localhost:5000/api/products';
      const method = isEditModalOpen ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataObj
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error saving product.');

      fetchProducts();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      resetProductForm();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete listing.');
      fetchProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 150px)', padding: '2rem 0' }}>
      <div className="container">
        
        {/* Banner */}
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

        {/* Dashboard grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
          
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
            <button
              onClick={() => setActiveTab('orders')}
              className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start', width: '100%', padding: '1rem 1.25rem' }}
            >
              <Truck size={18} />
              Orders Received
            </button>
          </aside>

          <section className="card" style={{ padding: '2.5rem', minHeight: '450px' }}>
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Dashboard Overview</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  Welcome back! Summary of your farm presence on Farmley Connect.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', background: '#faf9f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-medium)', fontWeight: '700', marginBottom: '0.5rem' }}>
                      <CheckCircle size={18} /> Verified Account
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Email <strong style={{ color: 'var(--text-dark)' }}>{user.email}</strong> is active on the map.
                    </p>
                  </div>
                  <div style={{ border: '1.5px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', background: '#faf9f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-medium)', fontWeight: '700', marginBottom: '0.5rem' }}>
                      <MapPin size={18} /> Map Pin Located
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Farm coordinates: <strong style={{ color: 'var(--text-dark)' }}>{parseFloat(user.latitude).toFixed(4)}, {parseFloat(user.longitude).toFixed(4)}</strong>
                    </p>
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.75rem', background: 'white' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Farm Story & Description</h3>
                  <p style={{ color: user.farmDescription ? 'var(--text-dark)' : 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {user.farmDescription || 'No description listed yet. Head to "Farm Profile" to add details!'}
                  </p>
                </div>

                {/* Quick Products Overview with Edit Access */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-deep)', margin: 0 }}>
                        Your Produce Listings ({products.length})
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Quickly edit prices, adjust stock levels, or update produce info.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={openAddModal} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        <Plus size={15} /> Add Produce
                      </button>
                      <button onClick={() => setActiveTab('inventory')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        Manage Inventory
                      </button>
                    </div>
                  </div>

                  {products.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', background: '#faf9f6', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                        You haven't listed any farm produce yet.
                      </p>
                      <button onClick={openAddModal} className="btn btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
                        <Plus size={15} /> List Your First Harvest
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem' }}>
                      {products.slice(0, 6).map((product) => (
                        <div key={product._id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
                          <div>
                            <div style={{ height: '110px', background: '#f1f5f9', overflow: 'hidden' }}>
                              {product.image ? (
                                <img src={`http://localhost:5000${product.image}`} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                  <Camera size={26} />
                                </div>
                              )}
                            </div>
                            <div style={{ padding: '0.75rem' }}>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--primary-deep)' }}>{product.title}</h4>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                <strong style={{ color: 'var(--accent-clay)' }}>₹{product.price}/{product.unit}</strong>
                                <span>Stock: <strong>{product.stock}</strong></span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="btn btn-secondary"
                            style={{
                              width: '100%',
                              borderRadius: 0,
                              padding: '0.55rem',
                              fontSize: '0.85rem',
                              borderTop: '1px solid #e2e8f0',
                              borderLeft: 'none',
                              borderRight: 'none',
                              borderBottom: 'none',
                              color: 'var(--primary-medium)',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem'
                            }}
                          >
                            <Edit size={14} /> Edit Produce
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Manage Farm Details</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  Update contact info and drag your map marker to relocate.
                </p>

                {profileError && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{profileError}</div>}
                {profileSuccess && <div style={{ background: '#e8f5e9', color: 'var(--primary-medium)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{profileSuccess}</div>}

                <form onSubmit={handleProfileSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Farm Name</label>
                      <input type="text" name="farmName" className="form-input" value={profileData.farmName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contact Phone</label>
                      <input type="tel" name="phone" className="form-input" value={profileData.phone} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Physical Address</label>
                    <input type="text" name="address" className="form-input" value={profileData.address} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Direct Delivery Radius (km)</label>
                    <input type="number" name="maxDeliveryRadius" className="form-input" min="1" max="100" step="0.5" value={profileData.maxDeliveryRadius} onChange={handleInputChange} required placeholder="e.g. 100" />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Maximum distance in kilometers your farm will directly deliver to consumers.</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Farm Description</label>
                    <textarea name="farmDescription" className="form-input" value={profileData.farmDescription} onChange={handleInputChange} rows="3" />
                  </div>

                  <div className="form-group" style={{ marginTop: '1.5rem' }}>
                    <label className="form-label"><strong>Adjust Location Pin</strong></label>
                    <MapInput lat={parseFloat(profileData.latitude)} lng={parseFloat(profileData.longitude)} onChange={handleCoordinatesChange} />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={profileLoading} style={{ marginTop: '1rem' }}>
                    <Save size={18} /> {profileLoading ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* 3. INVENTORY TAB */}
            {activeTab === 'inventory' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Inventory Catalog</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage products displayed on your storefront.</p>
                  </div>
                  <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Plus size={16} /> Add Product
                  </button>
                </div>

                {productsLoading ? <p style={{ color: 'var(--text-muted)' }}>Loading inventory...</p> : products.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                    <h3>No Products Listed</h3>
                    <button onClick={openAddModal} className="btn btn-secondary" style={{ marginTop: '1rem' }}>List Product</button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    {products.map((product) => (
                      <div key={product._id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ height: '150px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                            {product.image ? (
                              <img src={`http://localhost:5000${product.image}`} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><Camera size={32} /></div>
                            )}
                          </div>
                          <div style={{ padding: '1rem' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>{product.title}</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                              <strong style={{ color: 'var(--accent-clay)' }}>₹{product.price}/{product.unit}</strong>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Stock: {product.stock}</span>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', borderTop: '1px solid #e2e8f0', background: '#faf9f6' }}>
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            style={{
                              flex: 1,
                              padding: '0.75rem',
                              border: 'none',
                              background: 'transparent',
                              color: 'var(--primary-medium)',
                              fontWeight: '700',
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.4rem',
                              borderRight: '1px solid #e2e8f0'
                            }}
                          >
                            <Edit size={16} /> Edit Product
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product._id)}
                            style={{
                              flex: 1,
                              padding: '0.75rem',
                              border: 'none',
                              background: 'transparent',
                              color: '#dc2626',
                              fontWeight: '700',
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.4rem'
                            }}
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. ORDERS RECEIVED TAB */}
            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Incoming Orders Received</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                  Manage customer orders and update delivery status.
                </p>

                {ordersError && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>{ordersError}</div>}

                {ordersLoading ? (
                  <p style={{ color: 'var(--text-muted)' }}>Loading incoming orders...</p>
                ) : farmerOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <Truck size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
                    <h3>No Orders Received Yet</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      When local buyers order your produce, they will appear here.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {farmerOrders.map((order) => (
                      <div key={order._id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', background: '#faf9f6' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                          <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--primary-deep)' }}>
                              Buyer: {order.consumerName}
                            </h4>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              Phone: <strong style={{ color: 'var(--text-dark)' }}>{order.consumerPhone}</strong> • Placed: {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Status Dropdown */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Status:</span>
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order, e.target.value)}
                              style={{
                                padding: '0.4rem 0.8rem',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                border: '1.5px solid var(--primary-medium)',
                                background: 'white',
                                color: 'var(--primary-deep)',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                          📍 Delivery Address: <strong style={{ color: 'var(--text-dark)' }}>{order.deliveryAddress}</strong>
                        </div>

                        {/* Items */}
                        <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                          <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Ordered Items</h5>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: idx !== order.items.length - 1 ? '1px dashed #f1f5f9' : 'none', padding: '0.3rem 0' }}>
                              <span>{item.title} x {item.quantity} {item.unit}s</span>
                              <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Payment Mode: <strong>{order.paymentMethod}</strong></span>
                          <strong style={{ fontSize: '1.15rem', color: 'var(--accent-clay)' }}>Order Total: ₹{order.totalAmount.toFixed(2)}</strong>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </section>

        </div>

      </div>

      {/* ADD/EDIT MODALS */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
            <h2>List New Product</h2>
            {formError && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem' }}>{formError}</div>}
            <form onSubmit={handleSaveProduct}>
              <div className="form-group"><label className="form-label">Title *</label><input type="text" name="title" className="form-input" value={productForm.title} onChange={handleProductFormChange} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group"><label className="form-label">Category</label><select name="category" className="form-input" value={productForm.category} onChange={handleProductFormChange}><option value="Vegetables">Vegetables</option><option value="Fruits">Fruits</option><option value="Dairy & Eggs">Dairy & Eggs</option><option value="Grains & Flours">Grains & Flours</option></select></div>
                <div className="form-group"><label className="form-label">Unit</label><select name="unit" className="form-input" value={productForm.unit} onChange={handleProductFormChange}><option value="kg">Per kg</option><option value="bunch">Per Bunch</option><option value="dozen">Per Dozen</option><option value="piece">Per Piece</option></select></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group"><label className="form-label">Price (₹) *</label><input type="number" step="0.01" name="price" className="form-input" value={productForm.price} onChange={handleProductFormChange} required /></div>
                <div className="form-group"><label className="form-label">Stock *</label><input type="number" name="stock" className="form-input" value={productForm.stock} onChange={handleProductFormChange} required /></div>
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea name="description" className="form-input" value={productForm.description} onChange={handleProductFormChange} rows="2" /></div>
              <div className="form-group"><label className="form-label">Product Image</label><input type="file" accept="image/*" onChange={handleImageChange} /></div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>{formLoading ? 'Saving...' : 'List Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '620px' }}>
            <button className="modal-close" onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Edit size={22} style={{ color: 'var(--primary-medium)' }} />
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-deep)', margin: 0 }}>Edit Produce Listing</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Update details, price, inventory stock, or photo for <strong>{currentProduct?.title}</strong>.
            </p>

            {formError && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.6rem 0.8rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.88rem', fontWeight: 600 }}>{formError}</div>}
            
            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Product Name / Harvest Title *</label>
                <input type="text" name="title" className="form-input" value={productForm.title} onChange={handleProductFormChange} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-input" value={productForm.category} onChange={handleProductFormChange}>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Grains & Flours">Grains & Flours</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Measurement Unit</label>
                  <select name="unit" className="form-input" value={productForm.unit} onChange={handleProductFormChange}>
                    <option value="kg">Per kg</option>
                    <option value="bunch">Per Bunch</option>
                    <option value="dozen">Per Dozen</option>
                    <option value="piece">Per Piece</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Unit Price (₹) *</label>
                  <input type="number" step="0.01" name="price" className="form-input" value={productForm.price} onChange={handleProductFormChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Available Stock Quantity *</label>
                  <input type="number" name="stock" className="form-input" value={productForm.stock} onChange={handleProductFormChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Harvest Notes</label>
                <textarea name="description" className="form-input" value={productForm.description} onChange={handleProductFormChange} rows="2" placeholder="e.g. Freshly picked this morning, pesticide-free..." />
              </div>

              <div className="form-group">
                <label className="form-label">Product Image</label>
                {imagePreview && (
                  <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid var(--border-color)' }}>
                      <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current preview. Choose a new file below if you wish to replace it.</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} className="form-input" style={{ padding: '0.4rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Save size={16} /> {formLoading ? 'Saving Changes...' : 'Save Product Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4-DIGIT DELIVERY HANDOVER OTP MODAL */}
      {otpModalOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '460px', textAlign: 'center' }}>
            <button className="modal-close" onClick={() => setOtpModalOrder(null)}><X size={20} /></button>
            
            <div style={{
              display: 'inline-flex',
              background: 'var(--primary-pale)',
              color: 'var(--primary-medium)',
              padding: '1rem',
              borderRadius: '50%',
              marginBottom: '1rem'
            }}>
              <ShieldCheck size={40} />
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem', color: 'var(--primary-deep)' }}>
              Verify Delivery Handover
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Ask consumer <strong>{otpModalOrder.consumerName}</strong> for their 4-digit Delivery OTP code upon handing over the produce.
            </p>

            {otpError && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.25rem', border: '1px solid #fca5a5' }}>
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyAndDeliver}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Enter 4-Digit Delivery OTP *</label>
                <input
                  type="text"
                  maxLength="4"
                  placeholder="0000"
                  className="form-input"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  style={{
                    textAlign: 'center',
                    fontSize: '2rem',
                    letterSpacing: '0.4em',
                    fontFamily: 'monospace',
                    fontWeight: '800',
                    padding: '0.6rem'
                  }}
                  required
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button type="button" onClick={() => setOtpModalOrder(null)} className="btn btn-secondary" style={{ width: '45%' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={otpLoading || enteredOtp.length !== 4} style={{ width: '55%' }}>
                  {otpLoading ? 'Verifying...' : 'Verify & Complete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
