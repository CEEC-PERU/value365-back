const FormModel = require('./forms.model');

const FormService = {
    async createForm(campaignId, formData) {
        formData.campaign_id = campaignId;
        return FormModel.create(formData);
    },
    async getFormsByCampaign(campaignId) {
        return FormModel.findByCampaignId(campaignId);
    }
};
module.exports = FormService;