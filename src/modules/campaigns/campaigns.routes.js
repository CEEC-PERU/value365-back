module.exports = router;

const express = require('express');
const router = express.Router();
const campaignsController = require('./campaigns.controller');
const jwtMiddleware = require('../auth/jwt.middleware');
const formRoutes = require('../forms/forms.routes'); 
router.use(jwtMiddleware);

router.route('/')
    .get(campaignsController.getCampaigns)
    .post(campaignsController.createCampaign);

router.route('/:id')
    .get(campaignsController.getCampaignById)
    .put(campaignsController.updateCampaign)
    .delete(campaignsController.deleteCampaign);


router.use('/:campaignId/forms', formRoutes);

module.exports = router;