const express = require('express');
const router = express.Router();
const templatesController = require('./templates.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

// La ruta aquí debe ser /templates para que la URL completa sea /api/v1/templates
router.post('/templates', jwtMiddleware, templatesController.createTemplate);

// Puedes cambiar esta ruta para que sea /templates/available
router.get('/templates', jwtMiddleware, templatesController.getTemplates);

module.exports = router;