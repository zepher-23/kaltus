const express = require('express');
const router = express.Router();
const {
    registerUser,
    authUser,
    getUserProfile,
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/profile/addresses')
    .post(protect, addAddress);

router.route('/profile/addresses/:id')
    .put(protect, updateAddress)
    .delete(protect, deleteAddress);

router.route('/profile/addresses/:id/default')
    .put(protect, setDefaultAddress);

router.route('/wishlist')
    .get(protect, getWishlist)
    .post(protect, addToWishlist);

router.route('/wishlist/:id')
    .delete(protect, removeFromWishlist);

module.exports = router;
