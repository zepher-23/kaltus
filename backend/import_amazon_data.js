const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const readline = require('readline');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const BASE_URL = "https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories";

const CATEGORY_MAPPING = [
    { hf: 'Electronics', local: 'electronics', limit: 150 },
    { hf: 'Home_and_Kitchen', local: 'home', limit: 150 },
    { hf: 'Clothing_Shoes_and_Jewelry', local: 'fashion', limit: 150 },
    { hf: 'All_Beauty', local: 'beauty', limit: 100 },
    { hf: 'Sports_and_Outdoors', local: 'sports', limit: 100 },
    { hf: 'Toys_and_Games', local: 'toys', limit: 100 },
    { hf: 'Pet_Supplies', local: 'pets', limit: 80 },
    { hf: 'Automotive', local: 'automotive', limit: 80 },
    { hf: 'Video_Games', local: 'gaming', limit: 100 },
    { hf: 'Office_Products', local: 'office', limit: 80 },
    { hf: 'Tools_and_Home_Improvement', local: 'smart-home', limit: 80 }
];

// ... inside downloadCategory ...



const downloadCategory = async (hfCategory, localCategory, limit) => {
    const url = `${BASE_URL}/meta_${hfCategory}.jsonl`;
    console.log(`Starting fetch for ${hfCategory} -> ${localCategory}`);

    const products = [];

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

        let lineCount = 0;
        for await (const line of rl) {
            lineCount++;
            if (lineCount % 5000 === 0) {
                console.log(`[${hfCategory}] Processed ${lineCount} lines... Found ${products.length}/${limit}`);
            }

            if (products.length >= limit) {
                response.data.destroy(); // Stop stream
                break;
            }

            try {
                const item = JSON.parse(line);

                // 1. Must have title
                if (!item.title || item.title.trim() === '') continue;

                // 2. Price - Robust Parsing
                let price = 0;
                if (typeof item.price === 'number') {
                    price = item.price;
                } else if (typeof item.price === 'string' && item.price !== "") {
                    const parsed = parseFloat(item.price.replace(/[^0-9.]/g, ''));
                    if (!isNaN(parsed)) price = parsed;
                }

                // Fallback price if missing or 0
                if (!price || price === 0) {
                    price = parseFloat((Math.random() * 200 + 10).toFixed(2));
                }

                // 3. Images - Extraction
                let imageUrl = '';
                let imagesList = [];

                if (Array.isArray(item.images) && item.images.length > 0) {
                    // Extract all valid images
                    item.images.forEach(img => {
                        const bestUrl = img.hi_res || img.large || img.thumb;
                        if (bestUrl && bestUrl !== 'null' && bestUrl.startsWith('http')) {
                            // clean up duplications if any
                            if (!imagesList.includes(bestUrl)) imagesList.push(bestUrl);
                        }
                    });

                    // Prefer MAIN variant for main image, otherwise first one
                    const mainImageObj = item.images.find(img => img.variant === 'MAIN') || item.images[0];
                    if (mainImageObj) {
                        imageUrl = mainImageObj.hi_res || mainImageObj.large || mainImageObj.thumb;
                    }
                }
                // Fallback (older structure check)
                else if (item.images && typeof item.images === 'object') {
                    imageUrl = item.images.hi_res || item.images.large || item.images.thumb;
                    if (imageUrl) imagesList.push(imageUrl);
                }

                if (!imageUrl || imageUrl === 'null') continue; // Skip if no valid main image
                if (imagesList.length === 0 && imageUrl) imagesList.push(imageUrl);

                // 4. Description
                let description = "No description available.";
                if (Array.isArray(item.description)) {
                    description = item.description.filter(x => x).join('\n');
                } else if (typeof item.description === 'string') {
                    description = item.description;
                }

                // Extract Subcategory (2nd item in hierarchy usually)
                let subcategory = null;
                if (Array.isArray(item.categories)) {
                    if (item.categories.length > 1) {
                        subcategory = item.categories[1];
                    } else if (item.categories.length > 0) {
                        subcategory = item.categories[0];
                    }
                }

                if (subcategory) {
                    subcategory = subcategory.replace(/&amp;/g, '&');
                } else {
                    subcategory = "General";
                }

                // Constraint Check: Reviews > 0
                if (!item.rating_number || item.rating_number < 1) continue;

                const newProduct = {
                    id: Math.floor(Math.random() * 1000000000),
                    parent_asin: item.parent_asin,
                    title: item.title.substring(0, 200),
                    price: price,
                    rating: item.average_rating || (Math.random() * 2 + 3).toFixed(1),
                    reviews: item.rating_number || Math.floor(Math.random() * 500),
                    image: imageUrl,
                    images: imagesList,
                    isExpress: Math.random() > 0.6,
                    isBestSeller: (item.rating_number > 500 && item.average_rating > 4.4),
                    category: localCategory,
                    subcategory: subcategory,
                    description: description.substring(0, 5000),
                    features: item.features || []
                };

                products.push(newProduct);

            } catch (err) {
                // ignore parse errors
            }
        }

        console.log(`Finished ${hfCategory}: Fetched ${products.length} items.`);
        return products;

    } catch (error) {
        console.error(`Error fetching ${hfCategory}:`, error.message);
        return [];
    }
};

const importData = async () => {
    try {
        await connectDB();

        console.log('Clearing existing products...');
        await Product.deleteMany();
        console.log('Cleared.');

        const allProducts = [];

        for (const cat of CATEGORY_MAPPING) {
            const items = await downloadCategory(cat.hf, cat.local, cat.limit);
            if (items.length > 0) {
                await Product.insertMany(items);
                console.log(`Inserted ${items.length} items for ${cat.local} into DB.`);
                allProducts.push(...items);
            }
        }

        console.log(`Total products imported: ${allProducts.length}`);
        process.exit();
    } catch (error) {
        console.error(`Import Error: ${error}`);
        process.exit(1);
    }
};

importData();
