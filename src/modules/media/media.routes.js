const express = require('express');
const router = express.Router();
const multer = require('multer');
const mediaController = require('./media.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

const upload = multer({ dest: 'src/modules/uploads/' });

router.post('/upload', jwtMiddleware, upload.single('file'), mediaController.uploadFile);
router.post('/external', jwtMiddleware, mediaController.saveExternalMedia);
router.get('/search/giphy', jwtMiddleware, mediaController.searchGiphy);
router.get('/search/unsplash', jwtMiddleware, mediaController.searchUnsplash);

module.exports = router;