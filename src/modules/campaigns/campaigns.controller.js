const CampaignService = require('./campaigns.service');

const createCampaign = async (req, res, next) => {
    try {
        const { nombre, descripcion, publico_objetivo, empresa_id } = req.body;
        const creado_por = req.user?.user_id;

        if (!creado_por) {
            return res.status(401).json({ success: false, message: 'Usuario no autenticado. El campo user_id es obligatorio.' });
        }

        if (!nombre || !empresa_id) {
            return res.status(400).json({ success: false, message: 'El nombre de la campaña y el ID de la empresa son obligatorios.' });
        }

        const newCampaign = await CampaignService.createCampaign({
            nombre,
            descripcion,
            publico_objetivo,
            creado_por
        }, creado_por, empresa_id);

        res.status(201).json({
            success: true,
            message: 'Campaña creada exitosamente.',
            data: {
                id: newCampaign.id,
                nombre: newCampaign.nombre,
                descripcion: newCampaign.descripcion,
                publico_objetivo: newCampaign.publico_objetivo,
                empresa_id: newCampaign.empresa_id,
                creado_por: newCampaign.creado_por
            }
        });
    } catch (error) {
        next(error);
    }
};

const getCampaigns = async (req, res, next) => {
    try {
        const { empresa_id } = req.query;

        if (!empresa_id) {
            return res.status(400).json({ success: false, message: 'El ID de la empresa es obligatorio.' });
        }

        const campaigns = await CampaignService.getCampaignsByEmpresa(empresa_id);
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
        const { empresa_id } = req.body;

        if (!empresa_id) {
            return res.status(400).json({ success: false, message: 'El ID de la empresa es obligatorio.' });
        }

        const campaign = await CampaignService.getCampaignById(id, empresa_id);
        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaña no encontrada.' });
        }

        res.status(200).json({ success: true, data: campaign });
    } catch (error) {
        next(error);
    }
};

const updateCampaign = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { empresa_id, ...campaignData } = req.body;

        if (!empresa_id || typeof empresa_id !== 'number') {
            return res.status(400).json({ success: false, message: 'El ID de la empresa es obligatorio y debe ser un número.' });
        }

        const updatedCampaign = await CampaignService.updateCampaign(id, empresa_id, campaignData);
        if (!updatedCampaign) {
            return res.status(404).json({ success: false, message: 'Campaña no encontrada o no tienes permiso para editarla.' });
        }

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
        const { empresa_id } = req.body || {};

        if (!empresa_id) {
            return res.status(400).json({ success: false, message: 'El ID de la empresa es obligatorio.' });
        }

        const deletedCampaign = await CampaignService.deleteCampaign(id, empresa_id);
        if (!deletedCampaign) {
            return res.status(404).json({ success: false, message: 'Campaña no encontrada o no tienes permiso para eliminarla.' });
        }

        res.status(200).json({
            success: true,
            message: 'Campaña eliminada exitosamente.'
        });
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