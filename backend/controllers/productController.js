const fs = require('fs');
const path = require('path');
const dbEngine = require('../config/dbEngine');

const productController = {
  // @desc    Get all products for logged-in farmer
  // @route   GET /api/products
  getProducts: async (req, res) => {
    try {
      const farmerId = req.user._id;
      const products = await dbEngine.findProductsByFarmer(farmerId);
      return res.status(200).json(products);
    } catch (error) {
      console.error('Get products error:', error);
      return res.status(500).json({ message: 'Server error retrieving products.' });
    }
  },

  // @desc    Add a product
  // @route   POST /api/products
  createProduct: async (req, res) => {
    try {
      const { title, category, unit, price, stock, description } = req.body;
      const farmerId = req.user._id;

      if (!title || !category || !unit || !price || !stock) {
        return res.status(400).json({ message: 'Please fill in all required fields.' });
      }

      let image = '';
      if (req.file) {
        image = `/uploads/${req.file.filename}`;
      }

      const product = await dbEngine.createProduct({
        farmerId,
        title,
        category,
        unit,
        price: parseFloat(price),
        stock: parseInt(stock),
        description: description || '',
        image
      });

      return res.status(201).json({ message: 'Product created successfully!', product });
    } catch (error) {
      console.error('Create product error:', error);
      return res.status(500).json({ message: 'Server error creating product.' });
    }
  },

  // @desc    Update a product
  // @route   PUT /api/products/:id
  updateProduct: async (req, res) => {
    try {
      const { title, category, unit, price, stock, description } = req.body;
      const productId = req.params.id;
      const farmerId = req.user._id;

      const product = await dbEngine.findProductById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      // Check authorization
      if (product.farmerId !== farmerId) {
        return res.status(401).json({ message: 'Not authorized to edit this product.' });
      }

      const updateData = {};
      if (title) updateData.title = title;
      if (category) updateData.category = category;
      if (unit) updateData.unit = unit;
      if (price !== undefined) updateData.price = parseFloat(price);
      if (stock !== undefined) updateData.stock = parseInt(stock);
      if (description !== undefined) updateData.description = description;

      if (req.file) {
        // Delete old image from server storage
        if (product.image) {
          const oldImagePath = path.join(__dirname, '..', product.image);
          if (fs.existsSync(oldImagePath)) {
            try {
              fs.unlinkSync(oldImagePath);
            } catch (err) {
              console.error('Failed to delete old image:', err.message);
            }
          }
        }
        updateData.image = `/uploads/${req.file.filename}`;
      }

      const updatedProduct = await dbEngine.updateProduct(productId, updateData);

      return res.status(200).json({ message: 'Product updated successfully!', product: updatedProduct });
    } catch (error) {
      console.error('Update product error:', error);
      return res.status(500).json({ message: 'Server error updating product.' });
    }
  },

  // @desc    Delete a product
  // @route   DELETE /api/products/:id
  deleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;
      const farmerId = req.user._id;

      const product = await dbEngine.findProductById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      // Check authorization
      if (product.farmerId !== farmerId) {
        return res.status(401).json({ message: 'Not authorized to delete this product.' });
      }

      // Delete image file from server
      if (product.image) {
        const imagePath = path.join(__dirname, '..', product.image);
        if (fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
          } catch (err) {
            console.error('Failed to delete product image file:', err.message);
          }
        }
      }

      await dbEngine.deleteProduct(productId);

      return res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (error) {
      console.error('Delete product error:', error);
      return res.status(500).json({ message: 'Server error deleting product.' });
    }
  }
};

module.exports = productController;
