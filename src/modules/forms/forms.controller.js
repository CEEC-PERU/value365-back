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

const getFormById = async (req, res, next) => {
    try {
        const { id } = req.params; // 'id' viene de la URL /forms/:id
        const form = await FormService.getFormById(id);
        res.status(200).json({ success: true, data: form });
    } catch (error) {
        next(error);
    }
};

const updateForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedForm = await FormService.updateForm(id, req.body);
        res.status(200).json({ success: true, data: updatedForm });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createForm,
    getFormsByCampaign,
    getFormById,
    updateForm
};
