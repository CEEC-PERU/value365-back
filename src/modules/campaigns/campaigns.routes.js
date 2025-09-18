const express = require('express');
const router = express.Router();
const campaignsController = require('./campaigns.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

router.use(jwtMiddleware);

router.post('/', campaignsController.createCampaign);

router.get('/', campaignsController.getCampaigns);

router.get('/:id', campaignsController.getCampaignById);

router.put('/:id', campaignsController.updateCampaign);

router.delete('/:id', campaignsController.deleteCampaign);

module.exports = router;