const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  farmerId: { type: String, required: true }, // Store as String to match either ObjectId or local JSON IDs
  title: { type: String, required: true },
  category: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
