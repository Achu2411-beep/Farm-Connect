const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/farm/:farmId', reviewController.getFarmReviews);
router.post('/', protect, reviewController.createReview);

module.exports = router;
