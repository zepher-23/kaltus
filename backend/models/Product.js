const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    parent_asin: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    reviews: {
        type: Number,
        required: true,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: false,
        default: []
    },
    isExpress: {
        type: Boolean,
        default: false
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    features: {
        type: [String],
        required: false
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
