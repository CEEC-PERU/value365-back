const CampaignService = require('./campaigns.service');

const createCampaign = async (req, res, next) => {
    try {
        const { nombre, descripcion, objetivo } = req.body;
        const empresa_id = req.user.empresa_id;
        const creado_por = req.user.user_id;

        if (!nombre) {
            return res.status(400).json({ success: false, message: 'El nombre de la campaña es obligatorio.' });
        }

        const newCampaign = await CampaignService.createCampaign({
            empresa_id,
            nombre,
            descripcion,
            objetivo,
            creado_por
        });

        res.status(201).json({
            success: true,
            message: 'Campaña creada exitosamente.',
            data: newCampaign
        });
    } catch (error) {
        next(error);
    }
};

const getCampaigns = async (req, res, next) => {
    try {
        const empresaId = req.user.empresa_id;
        const campaigns = await CampaignService.getCampaignsByEmpresa(empresaId);
        res.status(200).json({
            success: true,
            count: campaigns.length,
            data: campaigns
        });
    } catch (error) {
        next(error);
    }
};

const getCampaignById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const empresaId = req.user.empresa_id;
        const campaign = await CampaignService.getCampaignById(id, empresaId);
        res.status(200).json({ success: true, data: campaign });
    } catch (error) {
        next(error);
    }
};

const updateCampaign = async (req, res, next) => {
    try {
        const { id } = req.params;
        const empresaId = req.user.empresa_id;
        const updatedCampaign = await CampaignService.updateCampaign(id, empresaId, req.body);
        res.status(200).json({
            success: true,
            message: 'Campaña actualizada exitosamente.',
            data: updatedCampaign
        });
    } catch (error) {
        next(error);
    }
};

const deleteCampaign = async (req, res, next) => {
    try {
        const { id } = req.params;
        const empresaId = req.user.empresa_id;
        await CampaignService.deleteCampaign(id, empresaId);
        res.status(200).json({ success: true, message: 'Campaña eliminada exitosamente.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCampaign,
    getCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign
};