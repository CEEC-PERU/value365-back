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
    async countFormsByCampaign(campaignId) {
        return await FormModel.countByCampaignId(campaignId);
    },
    async createForm(campaignId, formData) {
        try {
            formData.campaign_id = campaignId;

            if (!formData.slug) {
                const baseSlug = slugify(formData.titulo, { lower: true, strict: true });
                formData.slug = `${baseSlug}-${uuidv4()}`;
            }

            return await FormModel.create(formData);
        } catch (error) {
            console.error('Error en createForm:', error);
            throw error;
        }
    },

    async getFormsByCampaign(campaignId) {
        try {
            return await FormModel.findByCampaignId(campaignId);
        } catch (error) {
            console.error('Error en getFormsByCampaign:', error);
            throw error;
        }
    },
    
    async getFormById(formId) {
        try {
            const form = await FormModel.findById(formId);
            if (!form) {
                throw createError(404, 'Formulario no encontrado.');
            }
            // Obtener las preguntas del formulario
            try {
                const QuestionModel = require('../questions/questions.model');
                const preguntas = await QuestionModel.findByFormId(form.id);
                return {
                    ...form,
                    preguntas: preguntas || []
                };
            } catch (questionError) {
                console.log('⚠ Error obteniendo preguntas, continuando sin ellas:', questionError.message);
                return {
                    ...form,
                    preguntas: []
                };
            }
        } catch (error) {
            console.error('Error en getFormById:', error);
            throw error;
        }
    },

    async getFormBySlug(slug) {
        try {
            console.log('🔍 Buscando formulario con slug:', slug);
            
            const form = await FormModel.findBySlug(slug);
            if (!form) {
                throw createError(404, 'Formulario no encontrado.');
            }
            
            // Obtener las preguntas del formulario
            try {
                const QuestionModel = require('../questions/questions.model');
                const preguntas = await QuestionModel.findByFormId(form.id);
                
                return {
                    ...form,
                    preguntas: preguntas || []
                };
            } catch (questionError) {
                console.log('⚠ Error obteniendo preguntas, continuando sin ellas:', questionError.message);
                return {
                    ...form,
                    preguntas: []
                };
            }
        } catch (error) {
            console.error('❌ Error en getFormBySlug:', error);
            throw error;
        }
    },

    async updateForm(formId, formData) {
        try {
            const existingForm = await this.getFormById(formId);

            const dataToUpdate = {};
            
            if (formData.titulo) dataToUpdate.titulo = formData.titulo;
            if (formData.descripcion) dataToUpdate.descripcion = formData.descripcion;
            if (formData.estado) dataToUpdate.estado = formData.estado;

            if (formData.diseño) {
                const existingDiseño = existingForm.diseño || {};
                dataToUpdate.diseño = mergeDeep(existingDiseño, formData.diseño);
            }

            if (formData.configuraciones) {
                const existingConfig = existingForm.configuraciones || {};
                dataToUpdate.configuraciones = mergeDeep(existingConfig, formData.configuraciones);
            }

            if (Object.keys(dataToUpdate).length === 0) {
                return existingForm;
            }

            return await FormModel.update(formId, dataToUpdate);
        } catch (error) {
            console.error('Error en updateForm:', error);
            throw error;
        }
    },

    async deleteForm(formId) {
        try {
            const form = await this.getFormById(formId);
            const pool = require('../../config/db');
            const query = 'DELETE FROM forms WHERE id = $1 RETURNING *;';
            const { rows } = await pool.query(query, [formId]);
            return rows[0];
        } catch (error) {
            console.error('Error en deleteForm:', error);
            throw error;
        }
    },

    /**
     * Actualiza las preguntas de un formulario: crea nuevas, actualiza existentes y elimina las que ya no están.
     * @param {number|string} formId
     * @param {Array} preguntas
     */
    async updateFormQuestions(formId, preguntas) {
        const QuestionModel = require('../questions/questions.model');
        const pool = require('../../config/db');
        // Obtener preguntas actuales
        const preguntasActuales = await QuestionModel.findByFormId(formId);
        const preguntasActualesMap = new Map(preguntasActuales.map(q => [q.id, q]));

        // IDs de las preguntas recibidas
        const idsRecibidos = new Set(preguntas.filter(q => q.id).map(q => q.id));
        // Eliminar preguntas que ya no están
        for (const preguntaActual of preguntasActuales) {
            if (!idsRecibidos.has(preguntaActual.id)) {
                await QuestionModel.delete(preguntaActual.id);
            }
        }

        // Procesar preguntas recibidas
        const resultado = [];
        for (const pregunta of preguntas) {
            // Si tiene id, actualizar
            if (pregunta.id && preguntasActualesMap.has(pregunta.id)) {
                const dataToUpdate = {
                    titulo: pregunta.titulo,
                    descripcion: pregunta.descripcion,
                    question_type_id: pregunta.tipo_id || pregunta.question_type_id,
                    es_obligatorio: pregunta.es_obligatorio,
                    posicion_orden: pregunta.posicion_orden,
                    configuraciones: pregunta.configuraciones,
                    validaciones: pregunta.validaciones,
                };
                const updated = await QuestionModel.update(pregunta.id, dataToUpdate);
                resultado.push(updated);
            } else {
                // Si no tiene id, crear nueva
                const nuevaPregunta = {
                    form_id: formId,
                    titulo: pregunta.titulo,
                    descripcion: pregunta.descripcion,
                    question_type_id: pregunta.tipo_id || pregunta.question_type_id,
                    es_obligatorio: pregunta.es_obligatorio,
                    posicion_orden: pregunta.posicion_orden,
                    configuraciones: pregunta.configuraciones,
                    validaciones: pregunta.validaciones,
                };
                const creada = await QuestionModel.create(nuevaPregunta);
                resultado.push(creada);
            }
        }
        // Devolver el nuevo listado de preguntas
        return await QuestionModel.findByFormId(formId);
    },

    async generateEmbedCodesForExistingForms() {
        try {
            const pool = require('../../config/db');
            const query = 'SELECT * FROM forms WHERE slug IS NOT NULL;';
            const { rows } = await pool.query(query);

            const updatedForms = rows.map(form => {
                const shareUrl = `${process.env.BASE_URL || 'https://value-cx.com'}/forms/${form.slug}`;
                const embedCode = `<iframe src='${shareUrl}' width='600' height='400' frameborder='0'></iframe>`;

                return {
                    id: form.id,
                    shareUrl,
                    embedCode
                };
            });

            return updatedForms;
        } catch (error) {
            console.error('Error en generateEmbedCodesForExistingForms:', error);
            throw error;
        }
    },

    async addForm(formData) {
        try {
            if (!formData.titulo || !formData.descripcion || !formData.campaign_id) {
                throw new Error('Faltan campos obligatorios: titulo, descripcion o campaign_id');
            }

            return await FormModel.create({
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                campaign_id: formData.campaign_id,
                diseño: formData.diseño || {},
                configuraciones: formData.configuraciones || {},
            });
        } catch (error) {
            throw error;
        }
    }
};

module.exports = FormService;