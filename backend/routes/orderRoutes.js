const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getConsumerOrders);
router.get('/farmer-orders', orderController.getFarmerOrders);
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;
