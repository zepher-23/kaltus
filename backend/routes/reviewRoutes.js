const express = require('express');
const router = express.Router();
const { getProductReviews } = require('../controllers/reviewController');

router.get('/:productId', getProductReviews);

module.exports = router;
