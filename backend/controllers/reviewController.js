const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.productId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!product.parent_asin) {
            return res.json([]);
        }

        // Find reviews by parent_asin
        const reviews = await Review.find({ parent_asin: product.parent_asin }).sort({ timestamp: -1 });

        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProductReviews
};
