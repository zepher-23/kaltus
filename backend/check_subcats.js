const axios = require('axios');
const readline = require('readline');

const BASE_URL = "https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories";

const CATEGORY_MAPPING = [
    { hf: 'Electronics', local: 'electronics' },
    { hf: 'Home_and_Kitchen', local: 'home' },
    { hf: 'Clothing_Shoes_and_Jewelry', local: 'fashion' },
    { hf: 'All_Beauty', local: 'beauty' },
    { hf: 'Sports_and_Outdoors', local: 'sports' },
    { hf: 'Toys_and_Games', local: 'toys' }
];

const checkSubcategories = async () => {
    const findings = {};

    for (const cat of CATEGORY_MAPPING) {
        console.log(`Checking ${cat.hf}...`);
        try {
            const url = `${BASE_URL}/meta_${cat.hf}.jsonl`;
            const response = await axios({
                method: 'get',
                url: url,
                responseType: 'stream'
            });

            const rl = readline.createInterface({
                input: response.data,
                crlfDelay: Infinity
            });

            const subCatCounts = {};
            let count = 0;

            for await (const line of rl) {
                count++;
                if (count > 500) { // Check first 500 items per category
                    response.data.destroy();
                    break;
                }

                try {
                    const item = JSON.parse(line);
                    if (item.categories && Array.isArray(item.categories) && item.categories.length > 1) {
                        // Usually index 0 is Main, index 1 is Sub
                        const sub = item.categories[1];
                        if (sub) {
                            subCatCounts[sub] = (subCatCounts[sub] || 0) + 1;
                        }
                    }
                } catch (e) { }
            }

            // Get top 5 subcategories
            const sorted = Object.entries(subCatCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(x => x[0]);

            findings[cat.local] = sorted;
            console.log(`Top found for ${cat.local}:`, sorted);

        } catch (err) {
            console.error(err.message);
        }
    }

    console.log("\nFINAL JSON:");
    console.log(JSON.stringify(findings, null, 2));
};

checkSubcategories();
