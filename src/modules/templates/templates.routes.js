const express = require('express');
const router = express.Router();
const templatesController = require('./templates.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

router.use(jwtMiddleware);

router.route('/')
    .post(templatesController.createTemplate)
    .get(templatesController.getTemplates);

module.exports = router;
