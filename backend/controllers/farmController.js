const dbEngine = require('../config/dbEngine');

const farmController = {
  // @desc    Get all verified farm locations for the map directory
  // @route   GET /api/farms
  getAllFarms: async (req, res) => {
    try {
      // Fetch users with role === 'farmer' and isVerified === true
      let farmers = [];
      if (typeof dbEngine.getIsConnected === 'function' && dbEngine.getIsConnected()) {
        const User = require('../models/User');
        farmers = await User.find({ isVerified: true, role: 'farmer' }).select('-password -otp -otpExpires');
      } else {
        // Fallback JSON DB mode
        const fs = require('fs');
        const path = require('path');
        const usersFile = path.join(__dirname, '../data/users.json');
        try {
          const data = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
          farmers = data.filter(u => u.isVerified && (u.role === 'farmer' || u.farmName));
        } catch (err) {
          farmers = [];
        }
      }

      // Map to clean farm object representation
      const farmsList = farmers.map(f => ({
        id: f._id,
        _id: f._id,
        farmName: f.farmName || 'Local Organic Farm',
        farmDescription: f.farmDescription || '',
        phone: f.phone,
        address: f.address,
        latitude: f.latitude,
        longitude: f.longitude,
        username: f.username,
        email: f.email
      }));

      return res.status(200).json(farmsList);
    } catch (error) {
      console.error('Error fetching farms:', error);
      return res.status(500).json({ message: 'Server error retrieving farms directory.' });
    }
  },

  // @desc    Get single farm details & active products
  // @route   GET /api/farms/:id
  getFarmById: async (req, res) => {
    try {
      const farmId = req.params.id;
      const farmer = await dbEngine.findUserById(farmId);

      if (!farmer) {
        return res.status(404).json({ message: 'Farm not found.' });
      }

      // Fetch products for this farm
      const products = await dbEngine.findProductsByFarmer(farmId);

      const farmProfile = {
        id: farmer._id,
        _id: farmer._id,
        farmName: farmer.farmName || 'Local Organic Farm',
        farmDescription: farmer.farmDescription || '',
        phone: farmer.phone,
        address: farmer.address,
        latitude: farmer.latitude,
        longitude: farmer.longitude,
        username: farmer.username,
        email: farmer.email,
        products: products || []
      };

      return res.status(200).json(farmProfile);
    } catch (error) {
      console.error('Error fetching farm storefront:', error);
      return res.status(500).json({ message: 'Server error retrieving farm profile.' });
    }
  }
};

module.exports = farmController;
