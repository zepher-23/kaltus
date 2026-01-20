const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        let query = {};

        if (req.query.keyword) {
            query.$or = [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { category: { $regex: req.query.keyword, $options: 'i' } }
            ];
        }

        if (req.query.category) {
            query.category = {
                $regex: req.query.category,
                $options: 'i'
            };
        }

        // Get products
        let products = await Product.find(query).lean();

        // Get review stats for all finding products (OPTIMIZATION: could be better with $lookup in aggregation)
        // For < 500 items, parallel queries or one big aggregation is fine.
        // Let's do a bulk aggregation for stats
        const stats = await Review.aggregate([
            {
                $group: {
                    _id: "$parent_asin",
                    count: { $sum: 1 },
                    avgRating: { $avg: "$rating" }
                }
            }
        ]);

        // Map stats to dictionary
        const statsMap = {};
        stats.forEach(s => {
            statsMap[s._id] = s;
        });

        // Merge stats
        products = products.map(p => {
            const stat = statsMap[p.parent_asin];
            return {
                ...p,
                reviews: stat ? stat.count : 0,
                rating: stat ? parseFloat(stat.avgRating.toFixed(1)) : 0
            };
        });

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Fetch product suggestions for autocomplete
// @route   GET /api/products/suggestions
// @access  Public
router.get('/suggestions', async (req, res) => {
    try {
        const query = {};

        // Keyword filter
        if (req.query.keyword) {
            query.title = {
                $regex: req.query.keyword,
                $options: 'i'
            };
        }

        // Category filter
        if (req.query.category && req.query.category !== 'All') {
            query.category = {
                $regex: req.query.category.replace(/-/g, '.*'),
                $options: 'i'
            };
        }

        const products = await Product.find(query).select('title image category id').limit(6);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        // Search by 'id' field
        const product = await Product.findOne({ id: req.params.id }).lean();

        if (product) {
            // Get local review stats
            const stats = await Review.aggregate([
                { $match: { parent_asin: product.parent_asin } },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        avgRating: { $avg: "$rating" }
                    }
                }
            ]);

            const realStats = stats[0] || { count: 0, avgRating: 0 };

            const productWithRealStats = {
                ...product,
                reviews: realStats.count,
                rating: parseFloat(realStats.avgRating.toFixed(1))
            };

            res.json(productWithRealStats);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
