import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
    }
  }, []);

  // Listen to external window cart update events (from FarmStorefront)
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (err) {
        console.error(err);
      }
    };

    window.addEventListener('cartUpdated', handleStorageUpdate);
    return () => window.removeEventListener('cartUpdated', handleStorageUpdate);
  }, []);

  // Save cart to localStorage whenever state changes
  const saveCartState = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const addToCart = (product, farm, quantity = 1) => {
    const existingIndex = cart.findIndex(item => item.product._id === product._id);
    let newCart = [...cart];

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({
        product,
        farm: {
          _id: farm._id || farm.id,
          farmName: farm.farmName,
          address: farm.address,
          phone: farm.phone
        },
        quantity
      });
    }

    saveCartState(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.product._id !== productId);
    saveCartState(newCart);
  };

  const updateQuantity = (productId, delta) => {
    const newCart = cart
      .map(item => {
        if (item.product._id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    saveCartState(newCart);
  };

  const clearCart = () => {
    saveCartState([]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
