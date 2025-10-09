
const express = require('express');
const router = express.Router();
const campaignsController = require('./campaigns.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

// Obtener formularios de una campaña específica
router.get('/:campaignId/forms', async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const forms = await require('../forms/forms.service').getFormsByCampaign(campaignId);
        res.status(200).json({ success: true, data: forms });
    } catch (error) {
        next(error);
    }
});

router.use(jwtMiddleware);

router.route('/')
    .get(campaignsController.getCampaigns)
    .post(campaignsController.createCampaign);

router.route('/:id')
    .get(campaignsController.getCampaignById)
    .put(campaignsController.updateCampaign)
    .delete(campaignsController.deleteCampaign);

module.exports = router;