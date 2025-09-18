const express = require('express');
const router = express.Router();
const templatesController = require('./templates.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

router.post('/templates', jwtMiddleware, templatesController.createTemplate);

router.get('/templates', jwtMiddleware, templatesController.getTemplates);

module.exports = router;