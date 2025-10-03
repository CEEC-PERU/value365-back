const express = require('express');
const router = express.Router({ mergeParams: true }); 
const formsController = require('./forms.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

router.use(jwtMiddleware);

router.route('/')
    .post(formsController.createForm)
    .get(formsController.getFormsByCampaign);

router.route('/id/:id')
    .get(formsController.getFormById)
    .put(formsController.updateForm)
    .delete(formsController.deleteForm);

router.route('/slug/:slug')
    .get(formsController.getFormBySlug);

module.exports = router;
