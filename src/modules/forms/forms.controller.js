// Endpoint para contar formularios por campaña
const countFormsByCampaign = async (req, res, next) => {
    try {
        const campaignId = req.params.campaignId;
        if (!campaignId) {
            return res.status(400).json({ success: false, message: 'El ID de la campaña es obligatorio.' });
        }
        const count = await FormService.countFormsByCampaign(campaignId);
        res.status(200).json({ success: true, count });
    } catch (error) {
        next(error);
    }
};
const FormService = require('./forms.service');
const FormSharesModel = require('../forms_shared/forms_shared.model');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

const createForm = async (req, res, next) => {
    try {
    const { campaignId } = req.params;
    let { titulo, descripcion, diseno, configuraciones, pantalla_bienvenida, pantalla_despedida } = req.body;
    console.log('Payload recibido en createForm:', req.body);
    if (diseno) {
        console.log('Diseño recibido en createForm:', diseno);
    }

        if (!campaignId || !titulo) {
            return res.status(400).json({ success: false, message: 'El ID de la campaña y el título son obligatorios.' });
        }

        // Si pantalla_bienvenida o pantalla_despedida vienen en el root, agrégalas a configuraciones
        if (!configuraciones || typeof configuraciones !== 'object') configuraciones = {};
        if (pantalla_bienvenida) configuraciones.pantalla_bienvenida = pantalla_bienvenida;
        if (pantalla_despedida) configuraciones.pantalla_despedida = pantalla_despedida;

        const baseSlug = slugify(titulo, { lower: true, strict: true });
        const slug = `${baseSlug}-${uuidv4()}`;

        const newForm = await FormService.createForm(campaignId, {
            titulo,
            descripcion,
            diseno,
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
        if (form && form.diseno) {
            console.log('Diseño retornado en getFormById:', form.diseno);
        }
        res.status(200).json({ success: true, data: form });
    } catch (error) {
        next(error);
    }
};

const updateForm = async (req, res, next) => {
    try {
    const { id } = req.params;
    let { configuraciones, pantalla_bienvenida, pantalla_despedida } = req.body;
    console.log('Payload recibido en updateForm:', req.body);
    if (req.body.diseno) {
        console.log('Diseño recibido en updateForm:', req.body.diseno);
    }
    // Si pantalla_bienvenida o pantalla_despedida vienen en el root, agrégalas a configuraciones
    if (!configuraciones || typeof configuraciones !== 'object') configuraciones = {};
    if (pantalla_bienvenida) configuraciones.pantalla_bienvenida = pantalla_bienvenida;
    if (pantalla_despedida) configuraciones.pantalla_despedida = pantalla_despedida;

    const updatedForm = await FormService.updateForm(id, { ...req.body, configuraciones });
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

        // Extraer pantalla de bienvenida y despedida si existen en configuraciones
        let pantalla_bienvenida = null;
        let pantalla_despedida = null;
        if (form.configuraciones) {
            try {
                const config = typeof form.configuraciones === 'string' ? JSON.parse(form.configuraciones) : form.configuraciones;
                pantalla_bienvenida = config.pantalla_bienvenida || null;
                pantalla_despedida = config.pantalla_despedida || null;
            } catch (e) {
                pantalla_bienvenida = null;
                pantalla_despedida = null;
            }
        }

        if (form && form.diseno) {
            console.log('Diseño retornado en getFormBySlug:', form.diseno);
        }

        res.status(200).json({
            success: true,
            data: {
                ...form,
                pantalla_bienvenida,
                pantalla_despedida
            }
        });
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
    countFormsByCampaign,
};