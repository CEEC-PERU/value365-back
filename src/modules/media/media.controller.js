const MediaService = require('./media.service');

const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No se ha subido ningún archivo.' });
        }
        const savedFile = await MediaService.saveUploadedFile(req.file, req.user);
        res.status(201).json({ success: true, message: 'Archivo subido exitosamente.', data: savedFile });
    } catch (error) {
        next(error);
    }
};

const saveExternalMedia = async (req, res, next) => {
    try {
        const { url, type, source, originalName } = req.body;
        if (!url || !type || !source) {
            return res.status(400).json({ success: false, message: 'Faltan los campos url, type o source.' });
        }
        const savedMedia = await MediaService.saveExternalMedia({ url, type, source, originalName }, req.user);
        res.status(201).json({ success: true, message: 'Recurso externo guardado.', data: savedMedia });
    } catch (error) {
        next(error);
    }
};

const searchGiphy = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: 'El término de búsqueda (q) es requerido.' });
        }
        const results = await MediaService.searchGiphy(q);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        next(error);
    }
};

const searchUnsplash = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: 'El término de búsqueda (q) es requerido.' });
        }
        const results = await MediaService.searchUnsplash(q);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadFile,
    saveExternalMedia,
    searchGiphy,
    searchUnsplash
};