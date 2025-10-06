const axios = require('axios');

const MediaService = {
    async searchGiphy(query) {
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=25&rating=g`;
        const response = await axios.get(url);
        return response.data.data;
    },

    async searchUnsplash(query) {
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=25`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        });
        return response.data.results;
    }
};

module.exports = MediaService;