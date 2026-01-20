const axios = require('axios');

const BASE_URL = "https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories";

const POTENTIAL_CATS = [
    'Video_Games',
    'Office_Products',
    'Tools_and_Home_Improvement' // Smat Home?
];

const checkExistence = async () => {
    for (const cat of POTENTIAL_CATS) {
        try {
            const url = `${BASE_URL}/meta_${cat}.jsonl`;
            console.log(`Checking ${cat}...`);
            await axios.head(url);
            console.log(`[OK] ${cat} exists.`);
        } catch (e) {
            console.log(`[FAIL] ${cat} not found.`);
        }
    }
};

checkExistence();
