const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbEngine = require('../config/dbEngine');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const authController = {
  // @desc    Register a new farmer
  // @route   POST /api/auth/register
  register: async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        phone,
        address,
        farmName,
        farmDescription,
        latitude,
        longitude
      } = req.body;

      if (!username || !email || !password || !phone || !address || !farmName || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ message: 'Please fill all required fields.' });
      }

      // Check if user exists
      const emailExists = await dbEngine.findUserByEmail(email);
      if (emailExists) {
        return res.status(400).json({ message: 'A farmer with this email already exists.' });
      }

      const usernameExists = await dbEngine.findUserByUsername(username);
      if (usernameExists) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate OTP
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

      const newUser = await dbEngine.createUser({
        username,
        email,
        password: hashedPassword,
        phone,
        address,
        farmName,
        farmDescription: farmDescription || '',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        isVerified: false,
        otp,
        otpExpires: otpExpires.toISOString()
      });

      // Output Simulated OTP to terminal
      console.log('\n======================================================');
      console.log(`[OTP SIMULATION] Email verification code for ${email}`);
      console.log(`CODE: ${otp}`);
      console.log('Expires in: 15 minutes');
      console.log('======================================================\n');

      return res.status(201).json({
        message: 'Registration successful! Verification code sent to email (simulated).',
        email
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Server error during registration.' });
    }
  },

  // @desc    Verify farmer account via OTP
  // @route   POST /api/auth/verify-otp
  verifyOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ message: 'Email and verification code are required.' });
      }

      const user = await dbEngine.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'Farmer not found.' });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: 'Email is already verified.' });
      }

      // Check OTP and Expiry
      if (user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid verification code.' });
      }

      const isExpired = new Date() > new Date(user.otpExpires);
      if (isExpired) {
        return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
      }

      // Update user verification state
      const updatedUser = await dbEngine.updateUser(user._id, {
        isVerified: true,
        otp: null,
        otpExpires: null
      });

      return res.status(200).json({
        message: 'Account verified successfully!',
        token: generateToken(updatedUser._id),
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          farmName: updatedUser.farmName,
          phone: updatedUser.phone,
          address: updatedUser.address,
          latitude: updatedUser.latitude,
          longitude: updatedUser.longitude,
          farmDescription: updatedUser.farmDescription
        }
      });
    } catch (error) {
      console.error('OTP Verification error:', error);
      return res.status(500).json({ message: 'Server error during verification.' });
    }
  },

  // @desc    Resend OTP to email
  // @route   POST /api/auth/resend-otp
  resendOTP: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
      }

      const user = await dbEngine.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'Farmer not found.' });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: 'Account is already verified.' });
      }

      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

      await dbEngine.updateUser(user._id, {
        otp,
        otpExpires: otpExpires.toISOString()
      });

      // Output Simulated OTP to terminal
      console.log('\n======================================================');
      console.log(`[OTP SIMULATION] New email verification code for ${email}`);
      console.log(`CODE: ${otp}`);
      console.log('Expires in: 15 minutes');
      console.log('======================================================\n');

      return res.status(200).json({
        message: 'New verification code sent successfully (simulated).'
      });
    } catch (error) {
      console.error('OTP Resend error:', error);
      return res.status(500).json({ message: 'Server error during resending verification code.' });
    }
  },

  // @desc    Login farmer
  // @route   POST /api/auth/login
  login: async (req, res) => {
    try {
      const { identifier, password } = req.body; // identifier can be username or email

      if (!identifier || !password) {
        return res.status(400).json({ message: 'Please enter all fields.' });
      }

      // Check user by username or email
      let user = await dbEngine.findUserByEmail(identifier);
      if (!user) {
        user = await dbEngine.findUserByUsername(identifier);
      }

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials.' });
      }

      // Check if user is verified
      if (!user.isVerified) {
        // Automatically trigger a resend of OTP so they can verify immediately
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000);
        
        await dbEngine.updateUser(user._id, {
          otp,
          otpExpires: otpExpires.toISOString()
        });

        console.log('\n======================================================');
        console.log(`[OTP SIMULATION] Unverified Login Attempt. New code for ${user.email}`);
        console.log(`CODE: ${otp}`);
        console.log('======================================================\n');

        return res.status(403).json({
          message: 'Account not verified. A new verification code has been sent.',
          email: user.email,
          requiresVerification: true
        });
      }

      return res.status(200).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          farmName: user.farmName,
          phone: user.phone,
          address: user.address,
          latitude: user.latitude,
          longitude: user.longitude,
          farmDescription: user.farmDescription
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server error during login.' });
    }
  },

  // @desc    Update farmer profile
  // @route   PUT /api/auth/profile
  updateProfile: async (req, res) => {
    try {
      const { farmName, phone, address, farmDescription, latitude, longitude } = req.body;
      const farmerId = req.user._id;

      const user = await dbEngine.findUserById(farmerId);
      if (!user) {
        return res.status(404).json({ message: 'Farmer not found.' });
      }

      const updateData = {};
      if (farmName) updateData.farmName = farmName;
      if (phone) updateData.phone = phone;
      if (address) updateData.address = address;
      if (farmDescription !== undefined) updateData.farmDescription = farmDescription;
      if (latitude !== undefined) updateData.latitude = parseFloat(latitude);
      if (longitude !== undefined) updateData.longitude = parseFloat(longitude);

      const updatedUser = await dbEngine.updateUser(farmerId, updateData);

      return res.status(200).json({
        message: 'Profile updated successfully!',
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          farmName: updatedUser.farmName,
          phone: updatedUser.phone,
          address: updatedUser.address,
          latitude: updatedUser.latitude,
          longitude: updatedUser.longitude,
          farmDescription: updatedUser.farmDescription
        }
      });
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ message: 'Server error during profile update.' });
    }
  }
};

module.exports = authController;
