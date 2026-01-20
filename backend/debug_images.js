const axios = require('axios');
const readline = require('readline');

// URL for Electronics
const url = "https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories/meta_Electronics.jsonl";

async function deepDebug() {
    console.log("Fetching first 5 lines for deep inspection...");
    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    });

    const rl = readline.createInterface({
        input: response.data,
        crlfDelay: Infinity
    });

    let count = 0;
    for await (const line of rl) {
        count++;
        console.log(`\n--- ITEM ${count} ---`);
        try {
            const item = JSON.parse(line);
            console.log("Title Present:", !!item.title);
            console.log("Images Raw:", JSON.stringify(item.images));

            // Test extraction logic
            const getFirstValid = (arr) => {
                if (!arr) return null;
                if (Array.isArray(arr)) {
                    return arr.find(u => u && typeof u === 'string' && u !== 'null' && u.startsWith('http')) || null;
                }
                return (typeof arr === 'string' && arr !== 'null' && arr.startsWith('http')) ? arr : null;
            };

            let imageUrl = '';
            if (item.images) {
                imageUrl = getFirstValid(item.images.hi_res) ||
                    getFirstValid(item.images.large) ||
                    getFirstValid(item.images.thumb);
            }
            console.log("Extracted Image URL:", imageUrl);
        } catch (e) {
            console.log("Parse Error");
        }

        if (count >= 5) break;
    }
    process.exit(0);
}

deepDebug();
