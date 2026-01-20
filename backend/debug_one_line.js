const axios = require('axios');
const readline = require('readline');

const url = "https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories/meta_Electronics.jsonl";

async function debug() {
    console.log("Fetching one line...");
    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    });

    const rl = readline.createInterface({
        input: response.data,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        console.log("RAW LINE JSON:");
        console.log(line);
        try {
            const item = JSON.parse(line);
            console.log("\nParsed Keys:", Object.keys(item));
            if (item.images) console.log("Images structure:", JSON.stringify(item.images, null, 2));
            if (item.price) console.log("Price structure:", item.price, typeof item.price);
        } catch (e) {
            console.log("Error parsing:", e);
        }
        break; // Only one line
    }
    process.exit(0);
}

debug();
