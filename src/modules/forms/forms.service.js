const FormModel = require('./forms.model');
const createError = require('http-errors');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');


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

        // Generar el slug combinado si no existe
        if (!formData.slug) {
            const baseSlug = slugify(formData.titulo, { lower: true, strict: true });
            formData.slug = `${baseSlug}-${uuidv4()}`;
            console.log('Slug combinado generado en el servicio:', formData.slug); // Log para depuración
        }

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

    async getFormBySlug(slug) {
        console.log('Slug recibido en el servicio:', slug); // Log para depuración
        const form = await FormModel.findBySlug(slug);
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

    async generateEmbedCodesForExistingForms() {
        try {
            const forms = await FormModel.findAllWithSlug(); // Método para obtener formularios con slug válido

            const updatedForms = forms.map(form => {
                const shareUrl = `${process.env.BASE_URL}/forms/${form.slug}`;
                const embedCode = `<iframe src='${shareUrl}' width='600' height='400' frameborder='0'></iframe>`;

                return {
                    id: form.id,
                    shareUrl,
                    embedCode
                };
            });

            console.log('Formularios actualizados con embedCode y shareUrl:', updatedForms);
            return updatedForms;
        } catch (error) {
            console.error('Error generando códigos embebidos:', error);
            throw error;
        }
    },
};

module.exports = FormService;
