const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams es crucial
const formsController = require('./forms.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

router.use(jwtMiddleware);

router.route('/')
    .post(formsController.createForm)
    .get(formsController.getFormsByCampaign);

module.exports = router;