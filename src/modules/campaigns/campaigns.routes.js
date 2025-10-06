const express = require('express');
const router = express.Router();
const campaignsController = require('./campaigns.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

router.use(jwtMiddleware);

router.route('/')
    .get(campaignsController.getAllCampaigns)
    .post(campaignsController.createCampaign);

router.route('/:id')
    .get(campaignsController.getCampaignById)
    .put(campaignsController.updateCampaign)
    .delete(campaignsController.deleteCampaign);

module.exports = router;

