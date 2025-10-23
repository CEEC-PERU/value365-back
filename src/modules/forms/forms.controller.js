const FormService = require('./forms.service');
const FormSharesModel = require('../forms_shared/forms_shared.model');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

const createForm = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const { titulo, descripcion, diseño, configuraciones } = req.body;

        if (!campaignId || !titulo) {
            return res.status(400).json({ success: false, message: 'El ID de la campaña y el título son obligatorios.' });
        }

    const baseSlug = slugify(titulo, { lower: true, strict: true });
    const slug = `${baseSlug}-${uuidv4()}`;

        const newForm = await FormService.createForm(campaignId, {
            titulo,
            descripcion,
            diseño,
            configuraciones,
            slug
        });

    const shareUrl = `https://value-cx.com/forms/${slug}`;
    const embedCode = `<iframe src='${shareUrl}' width='600' height='400' frameborder='0'></iframe>`;

        await FormSharesModel.create({
            form_id: newForm.id,
            tipo: 'public',
            url_generada: shareUrl,
            configuracion: configuraciones
        });

        res.status(201).json({
            success: true,
            message: 'Formulario creado exitosamente.',
            data: { ...newForm, shareUrl, embedCode }
        });
    } catch (error) {
        next(error);
    }
};

const getFormsByCampaign = async (req, res, next) => {
    try {
        const campaignId = req.params.campaignId || req.query.campaignId;

        if (!campaignId) {
            return res.status(400).json({ success: false, message: 'El ID de la campaña es obligatorio.' });
        }

        const forms = await FormService.getFormsByCampaign(campaignId);
        res.status(200).json({ success: true, data: forms });
    } catch (error) {
        next(error);
    }
};

const getFormById = async (req, res, next) => {
    try {
        const { id } = req.params;
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

const getFormBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const form = await FormService.getFormBySlug(slug);
        
        if (!form) {
            return res.status(404).json({ success: false, message: 'Formulario no encontrado.' });
        }

        // Mapear las preguntas al formato esperado por el frontend
        if (form.preguntas) {
            form.preguntas = form.preguntas.map(pregunta => ({
                id: pregunta.id,
                titulo: pregunta.titulo,
                descripcion: pregunta.descripcion || '',
                tipo_id: pregunta.question_type_id,
                es_obligatorio: pregunta.es_obligatorio,
                posicion_orden: pregunta.posicion_orden,
                opciones: pregunta.opciones || [],
                validaciones: pregunta.validaciones || {},
                configuraciones: pregunta.configuraciones || {}
            }));
            
            // Ordenar preguntas por posicion_orden
            form.preguntas.sort((a, b) => a.posicion_orden - b.posicion_orden);
        }

        res.status(200).json({ success: true, data: form });
    } catch (error) {
        next(error);
    }
};

const deleteForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedForm = await FormService.deleteForm(id);

        if (!deletedForm) {
            return res.status(404).json({ success: false, message: 'Formulario no encontrado.' });
        }

        res.status(200).json({
            success: true,
            message: 'Formulario eliminado exitosamente.',
        });
    } catch (error) {
        next(error);
    }
};

const generateEmbedCodesForExistingForms = async (req, res, next) => {
    try {
        const campaignId = req.params.campaignId || req.query.campaignId;

        if (!campaignId) {
            return res.status(400).json({ success: false, message: 'El ID de la campaña es obligatorio.' });
        }

        const forms = await FormService.getFormsByCampaign(campaignId);

        const updatedForms = forms.map(form => {
            const shareUrl = `${process.env.BASE_URL || 'https://value-cx.com'}/forms/${form.slug}`;
            const embedCode = `<iframe src='${shareUrl}' width='600' height='400' frameborder='0'></iframe>`;

            return {
                id: form.id,
                titulo: form.titulo,
                slug: form.slug,
                shareUrl,
                embedCode
            };
        });

        res.status(200).json({
            success: true,
            data: updatedForms
        });
    } catch (error) {
        next(error);
    }
};


// Nuevo endpoint: actualizar preguntas de un formulario
const updateFormQuestions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const preguntas = req.body.preguntas;
        if (!Array.isArray(preguntas)) {
            return res.status(400).json({ success: false, message: 'Se requiere un array de preguntas.' });
        }
        const result = await FormService.updateFormQuestions(id, preguntas);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

async function addForm(formData) {
    try {
        return await FormService.addForm(formData);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createForm,
    getFormsByCampaign,
    updateFormQuestions,
    getFormById,
    updateForm,
    getFormBySlug,
    deleteForm,
    addForm,
    generateEmbedCodesForExistingForms,
};