const express = require('express');
const router = express.Router();
const campaignsController = require('./campaigns.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

// Obtener formularios de una campaña específica
router.get('/:campaignId/forms', async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const forms = await require('../forms/forms.service').getFormsByCampaign(campaignId);
        // Agrega la URL pública a cada formulario
        const formsWithUrl = forms.map(form => ({
            ...form,
            public_url: `https://value-cx.com/forms/${form.slug}`
        }));
        res.status(200).json({ success: true, data: formsWithUrl });
    } catch (error) {
        next(error);
    }
});

// Crear formulario para una campaña específica
router.post('/:campaignId/forms', require('../forms/forms.controller').createForm);

router.use(jwtMiddleware);

router.route('/')
    .get(campaignsController.getCampaigns)
    .post(campaignsController.createCampaign);

router.route('/:id')
    .get(campaignsController.getCampaignById)
    .put(campaignsController.updateCampaign)
    .delete(campaignsController.deleteCampaign);

module.exports = router;