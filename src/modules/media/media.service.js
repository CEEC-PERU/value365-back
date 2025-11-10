const axios = require('axios');
const path = require('path');
const MediaModel = require('./media.model');

const MediaService = {
    async saveUploadedFile(file, user) {
        // Construye la URL pública
        const url_publica = `/uploads/${file.filename}`;
        // Guarda en la base de datos
        const mediaData = {
            nombre_archivo: file.filename,
            nombre_original: file.originalname,
            ruta_archivo: file.path,
            url_publica,
            tamaño_archivo: file.size,
            tipo_mime: file.mimetype,
            tipo_archivo: path.extname(file.originalname),
            subido_por: user ? user.id : null,
            source: 'upload'
        };
        const registro = await MediaModel.create(mediaData);
        return { url: url_publica, ...registro };
    },
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