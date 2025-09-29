const CampaignModel = require('./campaigns.model');
const createError = require('http-errors');

const CampaignService = {
    createCampaign: async (campaignData) => {
        return CampaignModel.create(campaignData);
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
        const existingCampaign = await CampaignModel.findById(id, empresaId);
        if (!existingCampaign) {
            throw createError(404, 'Campaña no encontrada o no tienes permiso para editarla.');
        }
        
        const dataToUpdate = {
            nombre: campaignData.nombre || existingCampaign.nombre,
            descripcion: campaignData.descripcion || existingCampaign.descripcion,
            objetivo: campaignData.objetivo || existingCampaign.objetivo,
            estado: campaignData.estado || existingCampaign.estado,
        };

        return CampaignModel.update(id, dataToUpdate);
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
