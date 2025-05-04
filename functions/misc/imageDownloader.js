const axios = require('axios');
const fs = require('fs');

async function imageDownloader(imageURL, newId) {
    const response = await axios.get(imageURL, { responseType: 'arraybuffer' });

    if (!response) return;

    const contentType = response.headers['content-type'];
    if (contentType && contentType.startsWith('image')) {
        const fileName = `${newId}.png`;

        fs.writeFileSync(`./templateshit/images/${newId}.png`, response.data);
        console.log(`[IMAGEDOWNLOADER SUCCESS] - ${fileName}`);
    } else {
        console.log('[IMAGEDOWNLADER FAILURE]');
    }
}

module.exports = imageDownloader;