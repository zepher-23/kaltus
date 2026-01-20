const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const readline = require('readline');
const Product = require('./models/Product');
const Review = require('./models/Review');
const connectDB = require('./config/db');

dotenv.config();

// Base URL for reviews (Note: It's "reviews_categories", not "meta_categories")
const BASE_URL = "https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/review_categories";

const CATEGORY_MAPPING = [
    { hf: 'Electronics', local: 'electronics' },
    { hf: 'Home_and_Kitchen', local: 'home' },
    { hf: 'Clothing_Shoes_and_Jewelry', local: 'fashion' },
    { hf: 'All_Beauty', local: 'beauty' },
    { hf: 'Sports_and_Outdoors', local: 'sports' },
    { hf: 'Toys_and_Games', local: 'toys' },
    { hf: 'Pet_Supplies', local: 'pets' },
    { hf: 'Automotive', local: 'automotive' }
];

const importReviews = async () => {
    try {
        await connectDB();

        console.log('Clearing existing reviews...');
        await Review.deleteMany();
        console.log('Cleared.');

        // Get all products to lookup ASINs
        const products = await Product.find({}, 'parent_asin');
        const asinSet = new Set(products.map(p => p.parent_asin).filter(Boolean));

        console.log(`Found ${products.length} products. Tracking reviews for ${asinSet.size} unique ASINs.`);

        let totalReviewsImported = 0;

        for (const cat of CATEGORY_MAPPING) {
            const url = `${BASE_URL}/${cat.hf}.jsonl`;
            console.log(`Starting fetch for reviews: ${cat.hf}`);

            try {
                const response = await axios({
                    method: 'get',
                    url: url,
                    responseType: 'stream'
                });

                const rl = readline.createInterface({
                    input: response.data,
                    crlfDelay: Infinity
                });

                let buffer = [];
                let count = 0;
                let processedLines = 0;

                for await (const line of rl) {
                    processedLines++;

                    try {
                        const review = JSON.parse(line);

                        // Only add review if we have the product in our DB
                        if (asinSet.has(review.parent_asin)) {
                            // Extract relevant fields
                            const newReview = {
                                parent_asin: review.parent_asin,
                                title: review.title || "Customer Review",
                                text: review.text,
                                rating: review.rating,
                                helpful_votes: review.helpful_vote || 0,
                                verified_purchase: review.verified_purchase || false,
                                user_id: review.user_id,
                                timestamp: review.timestamp || Date.now()
                            };

                            buffer.push(newReview);
                            count++;
                        }
                    } catch (e) {
                        // ignore parse error
                    }

                    // Log progress occasionally
                    if (processedLines % 50000 === 0) {
                        console.log(`[${cat.hf}] Scanned ${processedLines} reviews... Found ${count} matches.`);
                        // Optional: Break early if we have enough reviews per category to save time
                        // But since products are random, better to scan more.
                        // Let's limit scan per category to 200,000 lines to avoid long waits
                        if (processedLines > 200000) {
                            response.data.destroy();
                            break;
                        }
                    }
                }

                if (buffer.length > 0) {
                    await Review.insertMany(buffer);
                    console.log(`Inserted ${buffer.length} reviews for ${cat.hf}.`);
                    totalReviewsImported += buffer.length;
                } else {
                    console.log(`No matching reviews found for ${cat.hf} in first 200k lines.`);
                }

            } catch (err) {
                console.error(`Error processing ${cat.hf}: ${err.message}`);
            }
        }

        console.log(`Total reviews imported: ${totalReviewsImported}`);
        process.exit();
    } catch (error) {
        console.error(`Import Error: ${error}`);
        process.exit(1);
    }
};

importReviews();
