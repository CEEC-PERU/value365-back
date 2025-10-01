const axios = require('axios');
const MediaModel = require('./media.model');

const MediaService = {
    async saveUploadedFile(file, user) {
        const publicUrl = `${process.env.API_BASE_URL}/uploads/${file.filename}`;
        const mediaData = {
            empresa_id: user.empresa_id,
            subido_por: user.user_id,
            nombre_archivo: file.filename,
            nombre_original: file.originalname,
            ruta_archivo: file.path,
            url_publica: publicUrl,
            tamaño_archivo: file.size,
            tipo_mime: file.mimetype,
            tipo_archivo: file.mimetype.split('/')[0] || 'file',
            source: 'upload', 
        };
        return MediaModel.create(mediaData);
    },

    async saveExternalMedia(mediaInfo, user) {
        const { url, type, source, originalName } = mediaInfo;
        const mediaData = {
            empresa_id: user.empresa_id,
            subido_por: user.user_id,
            url_publica: url,
            tipo_archivo: type, 
            source: source, 
            nombre_original: originalName,
            nombre_archivo: null,
            ruta_archivo: null,
            tamaño_archivo: null,
            tipo_mime: null,
        };
        return MediaModel.create(mediaData);
    },

    async searchGiphy(query) {
        if (!process.env.GIPHY_API_KEY) {
            throw new Error('La API Key de Giphy no está configurada.');
        }
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=25&rating=g`;
        const response = await axios.get(url);
        return response.data.data.map(gif => ({
            id: gif.id,
            url: gif.images.fixed_height.url,
            title: gif.title,
            type: 'gif',
            source: 'giphy'
        }));
    },

    async searchUnsplash(query) {
        if (!process.env.UNSPLASH_API_KEY) {
            return [
                { id: '1', url: 'https://images.unsplash.com/photo-1707343843539-7a54a25071f8?w=500', title: 'Imagen de prueba 1', type: 'image', source: 'unsplash' },
                { id: '2', url: 'https://images.unsplash.com/photo-1720048160053-6a68f4e2f54c?w=500', title: 'Imagen de prueba 2', type: 'image', source: 'unsplash' }
            ];
        }
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=25`;
        const response = await axios.get(url, {
            headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_API_KEY}` }
        });
        return response.data.results.map(img => ({
            id: img.id,
            url: img.urls.regular,
            title: img.alt_description,
            type: 'image',
            source: 'unsplash'
        }));
    },
};

module.exports = MediaService;