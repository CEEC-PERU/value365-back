const CampaignModel = require('./campaigns.model');
const createError = require('http-errors');
const pool = require('../../config/db');

const CampaignService = {
    createCampaign: async (campaignData, userId, empresaId) => {
        if (!userId || !empresaId) {
            throw createError(400, 'Faltan parámetros requeridos: userId o empresaId.');
        }

        const empresaQuery = `
            SELECT 1 FROM user_empresas WHERE user_id = $1 AND empresa_id = $2 LIMIT 1;
        `;
        const empresaResult = await pool.query(empresaQuery, [userId, empresaId]);

        if (empresaResult.rowCount === 0) {
            throw createError(403, 'El usuario no está asignado a esta empresa.');
        }

        const campaignDataWithEmpresa = {
            ...campaignData,
            empresa_id: empresaId,
            user_id: userId
        };

        return CampaignModel.create(campaignDataWithEmpresa);
    },

    getCampaignsByEmpresa: async (empresaId) => {
        return CampaignModel.findByEmpresaId(empresaId);
    },

    getCampaignById: async (id, empresaId) => {
        const campaign = await CampaignModel.findByIdWithForms(id, empresaId);
        if (!campaign) {
            throw createError(404, 'Campaña no encontrada.');
        }
        return campaign;
    },

    updateCampaign: async (id, empresaId, campaignData) => {
        const campaignId = parseInt(id, 10);
        if (isNaN(campaignId)) {
            throw createError(400, 'El ID de la campaña debe ser un número válido.');
        }

        const empresaIdNumber = parseInt(empresaId, 10);
        if (isNaN(empresaIdNumber)) {
            throw createError(400, 'El ID de la empresa debe ser un número válido.');
        }

        const existingCampaign = await CampaignModel.findById(campaignId, empresaIdNumber);
        if (!existingCampaign) {
            throw createError(404, 'Campaña no encontrada o no tienes permiso para editarla.');
        }

        const dataToUpdate = {
            nombre: campaignData.nombre || existingCampaign.nombre,
            descripcion: campaignData.descripcion || existingCampaign.descripcion,
            publico_objetivo: campaignData.publico_objetivo || existingCampaign.publico_objetivo,
            estado: campaignData.estado || existingCampaign.estado
        };

        return CampaignModel.update(campaignId, dataToUpdate);
    },

    deleteCampaign: async (id, empresaId) => {
        const deletedCampaign = await CampaignModel.delete(id, empresaId);
        if (!deletedCampaign) {
            throw createError(404, 'Campaña no encontrada o no tienes permiso para eliminarla.');
        }
        return deletedCampaign;
    }
};

module.exports = CampaignService;
