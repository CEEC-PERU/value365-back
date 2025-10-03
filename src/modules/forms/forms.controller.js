const FormService = require('./forms.service');
const FormSharesModel = require('../forms_shared/forms_shared.model');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

const createForm = async (req, res, next) => {
    try {
        const { campaign_id, titulo, descripcion, diseño, configuraciones } = req.body;

        // Validar que campaign_id y titulo sean obligatorios
        if (!campaign_id || !titulo) {
            return res.status(400).json({ success: false, message: 'El ID de la campaña y el título son obligatorios.' });
        }

        // Generar el slug combinado con UUID
        const baseSlug = slugify(titulo, { lower: true, strict: true });
        const slug = `${baseSlug}-${uuidv4()}`;
        console.log('Slug combinado generado:', slug); // Log para depuración

        // Crear el formulario
        const newForm = await FormService.createForm(campaign_id, {
            titulo,
            descripcion,
            diseño,
            configuraciones,
            slug // Pasamos el slug combinado
        });

        // Generar URL compartible
        const shareUrl = `${process.env.BASE_URL}/forms/${slug}`;
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
        const { campaignId } = req.params;
        const forms = await FormService.getFormsByCampaign(campaignId);
        res.status(200).json({ success: true, data: forms });
    } catch (error) {
        next(error);
    }
};

const getFormById = async (req, res, next) => {
    try {
        const { id } = req.params; // 'id' viene de la URL /forms/:id
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
        console.log('Slug recibido en el controlador:', slug); // Log para depuración
        const form = await FormService.getFormBySlug(slug);
        if (!form) {
            return res.status(404).json({ success: false, message: 'Formulario no encontrado.' });
        }
        res.status(200).json({ success: true, data: form });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createForm,
    getFormsByCampaign,
    getFormById,
    updateForm,
    getFormBySlug
};
