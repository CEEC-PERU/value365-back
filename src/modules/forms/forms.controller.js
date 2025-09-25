const FormService = require('./forms.service');

const createForm = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const newForm = await FormService.createForm(campaignId, req.body);
        res.status(201).json({ success: true, data: newForm });
    } catch (error) {
        next(error);
    }
};

const getFormsByCampaign = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const forms = await FormService.getFormsByCampaign(campaignId);
        res.status(200).json({ success: true, data: forms });
    } catch (error) {
        next(error);
    }
};
module.exports = { createForm, getFormsByCampaign };