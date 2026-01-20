const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    parent_asin: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    helpful_votes: {
        type: Number,
        default: 0
    },
    verified_purchase: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
