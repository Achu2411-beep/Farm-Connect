const fs = require('fs');
const path = require('path');
const { getIsConnected } = require('./db');
const User = require('../models/User');
const Product = require('../models/Product');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([]));
}

// Helper to read/write JSON
const readJSON = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Generate a random string ID (mimics MongoDB's ObjectId structure enough to work interchangeably)
const generateId = () => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

const dbEngine = {
  // Users
  findUserByEmail: async (email) => {
    if (getIsConnected()) {
      return await User.findOne({ email });
    } else {
      const users = readJSON(USERS_FILE);
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      return user ? { ...user, id: user._id } : null;
    }
  },

  findUserByUsername: async (username) => {
    if (getIsConnected()) {
      return await User.findOne({ username });
    } else {
      const users = readJSON(USERS_FILE);
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      return user ? { ...user, id: user._id } : null;
    }
  },

  findUserById: async (id) => {
    if (getIsConnected()) {
      return await User.findById(id);
    } else {
      const users = readJSON(USERS_FILE);
      const user = users.find(u => u._id === id);
      return user ? { ...user, id: user._id } : null;
    }
  },

  createUser: async (userData) => {
    if (getIsConnected()) {
      const newUser = new User(userData);
      return await newUser.save();
    } else {
      const users = readJSON(USERS_FILE);
      const _id = generateId();
      const newUser = {
        _id,
        isVerified: false,
        createdAt: new Date().toISOString(),
        ...userData
      };
      users.push(newUser);
      writeJSON(USERS_FILE, users);
      return { ...newUser, id: _id };
    }
  },

  updateUser: async (id, updateData) => {
    if (getIsConnected()) {
      return await User.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      const users = readJSON(USERS_FILE);
      const index = users.findIndex(u => u._id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updateData };
        writeJSON(USERS_FILE, users);
        return { ...users[index], id: users[index]._id };
      }
      return null;
    }
  },

  // Products
  findProductsByFarmer: async (farmerId) => {
    if (getIsConnected()) {
      return await Product.find({ farmerId });
    } else {
      const products = readJSON(PRODUCTS_FILE);
      return products.filter(p => p.farmerId === farmerId);
    }
  },

  findProductById: async (id) => {
    if (getIsConnected()) {
      return await Product.findById(id);
    } else {
      const products = readJSON(PRODUCTS_FILE);
      const product = products.find(p => p._id === id);
      return product || null;
    }
  },

  createProduct: async (productData) => {
    if (getIsConnected()) {
      const newProduct = new Product(productData);
      return await newProduct.save();
    } else {
      const products = readJSON(PRODUCTS_FILE);
      const _id = generateId();
      const newProduct = {
        _id,
        createdAt: new Date().toISOString(),
        ...productData
      };
      products.push(newProduct);
      writeJSON(PRODUCTS_FILE, products);
      return newProduct;
    }
  },

  updateProduct: async (id, updateData) => {
    if (getIsConnected()) {
      return await Product.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      const products = readJSON(PRODUCTS_FILE);
      const index = products.findIndex(p => p._id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updateData };
        writeJSON(PRODUCTS_FILE, products);
        return products[index];
      }
      return null;
    }
  },

  deleteProduct: async (id) => {
    if (getIsConnected()) {
      return await Product.findByIdAndDelete(id);
    } else {
      const products = readJSON(PRODUCTS_FILE);
      const index = products.findIndex(p => p._id === id);
      if (index !== -1) {
        const deleted = products.splice(index, 1)[0];
        writeJSON(PRODUCTS_FILE, products);
        return deleted;
      }
      return null;
    }
  }
};

module.exports = dbEngine;
