const dbEngine = require('../config/dbEngine');

const orderController = {
  // @desc    Create new order(s) from cart payload
  // @route   POST /api/orders
  createOrder: async (req, res) => {
    try {
      const { items, deliveryAddress, phone, paymentMethod } = req.body;
      const consumerId = req.user._id;
      const consumerName = req.user.username;

      if (!items || items.length === 0 || !deliveryAddress || !phone) {
        return res.status(400).json({ message: 'Missing order details or empty items payload.' });
      }

      // Group cart items by farm/farmerId to generate distinct farm orders
      const farmGroups = {};
      items.forEach(item => {
        const farmerId = item.farm._id || item.farm.id;
        if (!farmGroups[farmerId]) {
          farmGroups[farmerId] = {
            farmerId: farmerId,
            farmName: item.farm.farmName || 'Local Farm',
            items: []
          };
        }
        farmGroups[farmerId].items.push({
          productId: item.product._id,
          title: item.product.title,
          unit: item.product.unit,
          price: parseFloat(item.product.price),
          quantity: parseInt(item.quantity)
        });
      });

      const createdOrders = [];

      // Create an order record for each farmer
      for (const farmerId in farmGroups) {
        const group = farmGroups[farmerId];
        const totalAmount = group.items.reduce((sum, i) => sum + i.price * i.quantity, 0) + 30; // + delivery fee

        const orderObj = {
          consumerId,
          consumerName,
          consumerPhone: phone,
          deliveryAddress,
          farmerId: group.farmerId,
          farmName: group.farmName,
          items: group.items,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          paymentMethod: paymentMethod || 'COD',
          paymentStatus: paymentMethod === 'UPI' ? 'Paid' : 'Pending',
          status: 'Pending'
        };

        const newOrder = await dbEngine.createOrder(orderObj);
        createdOrders.push(newOrder);
      }

      return res.status(201).json({
        message: 'Order(s) placed successfully!',
        orders: createdOrders
      });
    } catch (error) {
      console.error('Order creation error:', error);
      return res.status(500).json({ message: 'Server error placing order.' });
    }
  },

  // @desc    Get order history for logged-in consumer
  // @route   GET /api/orders/my-orders
  getConsumerOrders: async (req, res) => {
    try {
      const consumerId = req.user._id;
      const orders = await dbEngine.findOrdersByConsumer(consumerId);
      return res.status(200).json(orders);
    } catch (error) {
      console.error('Fetch consumer orders error:', error);
      return res.status(500).json({ message: 'Server error retrieving your orders.' });
    }
  },

  // @desc    Get orders received by logged-in farmer
  // @route   GET /api/orders/farmer-orders
  getFarmerOrders: async (req, res) => {
    try {
      const farmerId = req.user._id;
      const orders = await dbEngine.findOrdersByFarmer(farmerId);
      return res.status(200).json(orders);
    } catch (error) {
      console.error('Fetch farmer orders error:', error);
      return res.status(500).json({ message: 'Server error retrieving incoming orders.' });
    }
  },

  // @desc    Update order status (Farmer)
  // @route   PUT /api/orders/:id/status
  updateOrderStatus: async (req, res) => {
    try {
      const orderId = req.params.id;
      const { status } = req.body;
      const farmerId = req.user._id;

      const order = await dbEngine.findOrderById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      if (order.farmerId !== farmerId) {
        return res.status(401).json({ message: 'Not authorized to update this order.' });
      }

      const updatedOrder = await dbEngine.updateOrderStatus(orderId, status);
      return res.status(200).json({ message: 'Order status updated successfully!', order: updatedOrder });
    } catch (error) {
      console.error('Update order status error:', error);
      return res.status(500).json({ message: 'Server error updating status.' });
    }
  }
};

module.exports = orderController;
