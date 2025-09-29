const FormModel = require('./forms.model');
const createError = require('http-errors');


const isObject = (item) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
};

const mergeDeep = (target, source) => {
    let output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = mergeDeep(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
};


const FormService = {
    async createForm(campaignId, formData) {
        formData.campaign_id = campaignId;
        return FormModel.create(formData);
    },

    async getFormsByCampaign(campaignId) {
        return FormModel.findByCampaignId(campaignId);
    },
    
    async getFormById(formId) {
        const form = await FormModel.findById(formId);
        if (!form) {
            throw createError(404, 'Formulario no encontrado.');
        }
        return form;
    },

    async updateForm(formId, formData) {
        const existingForm = await this.getFormById(formId);

        const dataToUpdate = {};
        
        if (formData.titulo) dataToUpdate.titulo = formData.titulo;
        if (formData.descripcion) dataToUpdate.descripcion = formData.descripcion;
        if (formData.estado) dataToUpdate.estado = formData.estado;

        if (formData.diseño) {
            dataToUpdate.diseño = mergeDeep(existingForm.diseño || {}, formData.diseño);
        }

        if (formData.configuraciones) {
            dataToUpdate.configuraciones = mergeDeep(existingForm.configuraciones || {}, formData.configuraciones);
        }

        if (Object.keys(dataToUpdate).length === 0) {
            return existingForm;
        }

        return FormModel.update(formId, dataToUpdate);
    },
};

module.exports = FormService;
