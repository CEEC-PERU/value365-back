const express = require('express');
const router = express.Router();
const responsesController = require('./responses.controller');


// Obtener todas las respuestas de un formulario
router.get('/form/:formId', responsesController.getResponsesByFormId);

router.post('/', responsesController.submitResponse);

module.exports = router;