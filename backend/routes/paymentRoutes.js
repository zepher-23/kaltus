const express = require('express');
const { checkout, paymentVerification, getKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/checkout').post(protect, checkout);
router.route('/paymentverification').post(protect, paymentVerification);
router.route('/getkey').get(protect, getKey); // Technically key is public but let's protect usually

module.exports = router;
