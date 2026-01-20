const axios = require('axios');
const readline = require('readline');

const testUrl = "https://huggingface.co/datasets/McAuley-Lab/Amazon-Reviews-2023/resolve/main/raw/meta_categories/meta_All_Beauty.jsonl";

async function testFetch() {
    try {
        console.log(`Fetching from: ${testUrl}`);
        const response = await axios({
            method: 'get',
            url: testUrl,
            responseType: 'stream'
        });

        const rl = readline.createInterface({
            input: response.data,
            crlfDelay: Infinity
        });

        let count = 0;
        for await (const line of rl) {
            console.log("Line:", line);
            count++;
            if (count >= 3) break;
        }
        process.exit(0);
    } catch (error) {
        console.error("Error/404:", error.message);
        process.exit(1);
    }
}

testFetch();
