const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams es importante para anidar rutas
const questionsController = require('./questions.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

// Todas las rutas de preguntas estarán protegidas
router.use(jwtMiddleware);

// Rutas anidadas bajo /api/v1/campaigns/:campaignId/questions
router.route('/')
    .post(questionsController.createQuestion)
    .get(questionsController.getQuestionsByCampaign);

// Rutas para una pregunta específica por su ID
router.route('/:id')
    .put(questionsController.updateQuestion)
    .delete(questionsController.deleteQuestion);

module.exports = router;