const express = require('express');
const router = express.Router();
const responsesController = require('./responses.controller');

router.post('/', responsesController.submitResponse);

module.exports = router;