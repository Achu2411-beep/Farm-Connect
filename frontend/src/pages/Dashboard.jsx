import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, User as UserIcon, ShoppingBag, MapPin, Phone, FileText, CheckCircle, Save, Sprout, Plus, Edit, Trash2, Camera, Package, Tag, Coins, X } from 'lucide-react';
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

  // Products Inventory States
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');

  // Modals States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

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

  // Fetch products when switching to inventory tab
  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchProducts();
    }
  }, [activeTab]);

  if (!user) {
    return null;
  }

  // Fetch Farmer Products from backend
  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError('');
    const token = localStorage.getItem('token');
    
    if (!token) {
      setProductsError('Token missing. Please login again.');
      setProductsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load products.');
      }

      setProducts(data);
    } catch (err) {
      setProductsError(err.message);
    } finally {
      setProductsLoading(false);
    }
  };

  // Handle profile inputs change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle coordinate shifts on Map
  const handleCoordinatesChange = (lat, lng) => {
    setProfileData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  // Submit Profile edits
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setProfileError('Authentication token missing.');
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

  // Product Form Changes
  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Product Image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset product form
  const resetProductForm = () => {
    setProductForm({
      title: '',
      category: 'Vegetables',
      unit: 'kg',
      price: '',
      stock: '',
      description: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setFormError('');
  };

  // Open Add Modal
  const openAddModal = () => {
    resetProductForm();
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
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

  // Save product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setFormError('Authentication required.');
      setFormLoading(false);
      return;
    }

    const { title, category, unit, price, stock, description } = productForm;
    if (!title || !category || !unit || !price || !stock) {
      setFormError('Please fill in all required fields.');
      setFormLoading(false);
      return;
    }

    // Prepare FormData for file uploads (boundaries are handled automatically by browser)
    const formDataObj = new FormData();
    formDataObj.append('title', title);
    formDataObj.append('category', category);
    formDataObj.append('unit', unit);
    formDataObj.append('price', price);
    formDataObj.append('stock', stock);
    formDataObj.append('description', description);
    if (imageFile) {
      formDataObj.append('image', imageFile);
    }

    try {
      const url = isEditModalOpen 
        ? `http://localhost:5000/api/products/${currentProduct._id}`
        : 'http://localhost:5000/api/products';
      
      const method = isEditModalOpen ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataObj // No Content-Type header when uploading files
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error occurred while saving product.');
      }

      // Refresh listings and close modals
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

  // Delete product listing
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product listing?')) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete listing.');
      }

      // Refresh list
      fetchProducts();
    } catch (err) {
      alert(err.message);
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
                      placeholder="Share details about what you grow, organic certifications, and hours..."
                      rows="4"
                    />
                  </div>

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

            {/* 3. INVENTORY CATALOG TAB */}
            {activeTab === 'inventory' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Inventory Catalog</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Manage products currently displayed on your farm page.
                    </p>
                  </div>
                  <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Plus size={16} /> Add Product
                  </button>
                </div>

                {productsError && (
                  <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    {productsError}
                  </div>
                )}

                {productsLoading ? (
                  <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Loading inventory...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <ShoppingBag size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.6 }} />
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Products Listed</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                      Start listing items in your direct e-commerce catalog for local buyers.
                    </p>
                    <button onClick={openAddModal} className="btn btn-secondary">
                      List Your First Product
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '1.5rem'
                  }}>
                    {products.map((product) => (
                      <div key={product._id} className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                        {/* Product Image */}
                        <div style={{ height: '160px', width: '100%', backgroundColor: '#f1f5f9', position: 'relative', display: 'flex', alignItems: 'center', justify: 'center', overflow: 'hidden' }}>
                          {product.image ? (
                            <img 
                              src={`http://localhost:5000${product.image}`} 
                              alt={product.title} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                              <Camera size={36} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                              <span style={{ fontSize: '0.8rem' }}>No image uploaded</span>
                            </div>
                          )}
                          <span style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(27, 67, 50, 0.95)',
                            color: 'white',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '700'
                          }}>
                            {product.category}
                          </span>
                        </div>

                        {/* Card Info */}
                        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-deep)', fontWeight: '700' }}>{product.title}</h4>
                          {product.description && (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '38px' }}>
                              {product.description}
                            </p>
                          )}
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PRICE</span>
                              <strong style={{ color: 'var(--accent-clay)', fontSize: '1.15rem' }}>
                                ₹{parseFloat(product.price).toFixed(2)}
                              </strong>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/{product.unit}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>STOCK</span>
                              <span style={{
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                color: product.stock > 0 ? 'var(--primary-medium)' : '#dc2626'
                              }}>
                                {product.stock > 0 ? `${product.stock} ${product.unit}s` : 'Out of Stock'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Buttons */}
                        <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9', background: '#faf9f6' }}>
                          <button
                            onClick={() => openEditModal(product)}
                            style={{
                              flex: 1,
                              border: 'none',
                              background: 'transparent',
                              padding: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.3rem',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              color: 'var(--primary-medium)',
                              borderRight: '1px solid #f1f5f9',
                              cursor: 'pointer'
                            }}
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            style={{
                              flex: 1,
                              border: 'none',
                              background: 'transparent',
                              padding: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.3rem',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              color: '#dc2626',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
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

      {/* ================= ADD PRODUCT MODAL ================= */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={22} style={{ color: 'var(--primary-medium)' }} />
              List New Product
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Create an e-commerce listing for local consumers.
            </p>

            {formError && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Package size={14} /> Product Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  placeholder="e.g. Fresh Red Tomatoes"
                  value={productForm.title}
                  onChange={handleProductFormChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Tag size={14} /> Category *</label>
                  <select
                    name="category"
                    className="form-input"
                    value={productForm.category}
                    onChange={handleProductFormChange}
                    style={{ height: '43px' }}
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Grains & Flours">Grains & Flours</option>
                    <option value="Honey & Preserves">Honey & Preserves</option>
                    <option value="Poultry & Meat">Poultry & Meat</option>
                    <option value="Flowers & Herbs">Flowers & Herbs</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Sales Unit *</label>
                  <select
                    name="unit"
                    className="form-input"
                    value={productForm.unit}
                    onChange={handleProductFormChange}
                    style={{ height: '43px' }}
                  >
                    <option value="kg">Per Kilogram (kg)</option>
                    <option value="bunch">Per Bunch</option>
                    <option value="dozen">Per Dozen</option>
                    <option value="piece">Per Piece</option>
                    <option value="litre">Per Litre</option>
                    <option value="box">Per Box</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Coins size={14} /> Price per Unit (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    className="form-input"
                    placeholder="e.g. 45.00"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Available Stock Count *</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-input"
                    placeholder="e.g. 50"
                    value={productForm.stock}
                    onChange={handleProductFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Features</label>
                <textarea
                  name="description"
                  className="form-input"
                  placeholder="Organic, freshly harvested this morning, pesticide-free, etc..."
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  rows="3"
                />
              </div>

              {/* Image Upload field */}
              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Camera size={14} /> Upload Product Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="product-image-upload"
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="btn btn-secondary"
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Camera size={14} /> Choose Image
                  </label>
                  
                  {imagePreview && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ width: '44px', height: '44px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                      />
                      <button 
                        type="button" 
                        onClick={() => { setImageFile(null); setImagePreview(null); }} 
                        className="btn btn-secondary" 
                        style={{ padding: '0.2rem 0.5rem', color: '#dc2626', fontSize: '0.75rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Listing...' : 'List Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT PRODUCT MODAL ================= */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Edit size={22} style={{ color: 'var(--primary-medium)' }} />
              Edit Product Listing
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Modify details for your catalog listing.
            </p>

            {formError && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Package size={14} /> Product Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  value={productForm.title}
                  onChange={handleProductFormChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Tag size={14} /> Category *</label>
                  <select
                    name="category"
                    className="form-input"
                    value={productForm.category}
                    onChange={handleProductFormChange}
                    style={{ height: '43px' }}
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Grains & Flours">Grains & Flours</option>
                    <option value="Honey & Preserves">Honey & Preserves</option>
                    <option value="Poultry & Meat">Poultry & Meat</option>
                    <option value="Flowers & Herbs">Flowers & Herbs</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Sales Unit *</label>
                  <select
                    name="unit"
                    className="form-input"
                    value={productForm.unit}
                    onChange={handleProductFormChange}
                    style={{ height: '43px' }}
                  >
                    <option value="kg">Per Kilogram (kg)</option>
                    <option value="bunch">Per Bunch</option>
                    <option value="dozen">Per Dozen</option>
                    <option value="piece">Per Piece</option>
                    <option value="litre">Per Litre</option>
                    <option value="box">Per Box</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Coins size={14} /> Price per Unit (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    className="form-input"
                    value={productForm.price}
                    onChange={handleProductFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Available Stock Count *</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-input"
                    value={productForm.stock}
                    onChange={handleProductFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Features</label>
                <textarea
                  name="description"
                  className="form-input"
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  rows="3"
                />
              </div>

              {/* Image Upload field */}
              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Camera size={14} /> Update Product Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="product-image-edit"
                  />
                  <label
                    htmlFor="product-image-edit"
                    className="btn btn-secondary"
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Camera size={14} /> Choose New Image
                  </label>
                  
                  {imagePreview && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ width: '44px', height: '44px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                      />
                      <button 
                        type="button" 
                        onClick={() => { setImageFile(null); setImagePreview(null); }} 
                        className="btn btn-secondary" 
                        style={{ padding: '0.2rem 0.5rem', color: '#dc2626', fontSize: '0.75rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save Product'}
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
