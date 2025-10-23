const express = require('express');
const router = express.Router({ mergeParams: true });
const formsController = require('./forms.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

// RUTAS PÚBLICAS (SIN AUTENTICACIÓN) - DEBEN IR ANTES DEL MIDDLEWARE JWT
router.route('/public/:slug')
    .get(formsController.getFormBySlug);

// Endpoint para generar códigos embed
router.route('/embed-codes/:campaignId')
    .get(formsController.generateEmbedCodesForExistingForms);

// El resto requiere autenticación
router.use(jwtMiddleware);

router.route('/slug/:slug')
    .get(formsController.getFormBySlug);

router.route('/')
    .post(formsController.createForm)
    .get(formsController.getFormsByCampaign);

router.route('/id/:id')
    .get(formsController.getFormById)
    .put(formsController.updateForm)
    .delete(formsController.deleteForm);
    
// Endpoint para actualizar preguntas de un formulario
router.route('/id/:id/preguntas')
    .put(formsController.updateFormQuestions);

module.exports = router;