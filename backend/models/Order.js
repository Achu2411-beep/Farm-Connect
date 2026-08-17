const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  consumerId: { type: String, required: true },
  consumerName: { type: String, required: true },
  consumerPhone: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  farmerId: { type: String, required: true },
  farmName: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      title: { type: String, required: true },
      unit: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['COD', 'UPI'], default: 'COD' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
