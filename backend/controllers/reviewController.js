const dbEngine = require('../config/dbEngine');

const reviewController = {
  // @desc    Submit a review for a farm
  // @route   POST /api/reviews
  createReview: async (req, res) => {
    try {
      const { farmId, rating, comment } = req.body;
      const consumerId = req.user._id;
      const consumerName = req.user.username;

      if (!farmId || !rating || !comment) {
        return res.status(400).json({ message: 'Please provide rating and comment.' });
      }

      const numRating = parseInt(rating);
      if (numRating < 1 || numRating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5 stars.' });
      }

      const review = await dbEngine.createReview({
        farmId,
        consumerId,
        consumerName,
        rating: numRating,
        comment
      });

      return res.status(201).json({ message: 'Review submitted successfully!', review });
    } catch (error) {
      console.error('Create review error:', error);
      return res.status(500).json({ message: 'Server error posting review.' });
    }
  },

  // @desc    Get all reviews for a farm
  // @route   GET /api/reviews/farm/:farmId
  getFarmReviews: async (req, res) => {
    try {
      const farmId = req.params.farmId;
      const reviews = await dbEngine.findReviewsByFarm(farmId);
      return res.status(200).json(reviews);
    } catch (error) {
      console.error('Get reviews error:', error);
      return res.status(500).json({ message: 'Server error retrieving reviews.' });
    }
  }
};

module.exports = reviewController;
