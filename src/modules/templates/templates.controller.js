const templateService = require('./templates.service');

const createTemplate = async (req, res, next) => {
    try {
        const { nombre, descripcion, datos_plantilla, categoria, imagen_preview } = req.body;
        const creadoPor = req.user.user_id;
        const empresaId = req.user.empresa_id;
        if (!nombre || !datos_plantilla || !creadoPor || !empresaId) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios: nombre, datos_plantilla, usuario y empresa son requeridos.'
            });
        }
        if (typeof datos_plantilla !== 'object' || datos_plantilla === null) {
            return res.status(400).json({
                success: false,
                message: 'El campo datos_plantilla debe ser un objeto JSON válido.'
            });
        }
        const data = {
            empresaId,
            nombre,
            descripcion,
            datos_plantilla,
            creadoPor,
            categoria,
            imagen_preview
        };
        const newTemplate = await templateService.createTemplate(data);
        res.status(201).json({
            success: true,
            message: 'Plantilla registrada exitosamente.',
            template: newTemplate
        });
    } catch (error) {
        next(error);
    }
};

const getTemplates = async (req, res, next) => {
    try {
        const empresaId = req.user.empresa_id;
        if (!empresaId) {
             return res.status(400).json({
                success: false,
                message: 'No se pudo identificar la empresa del usuario.'
            });
        }
        const templates = await templateService.getAvailableTemplates(empresaId);
        res.status(200).json({
            success: true,
            count: templates.length,
            templates: templates
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTemplate,
    getTemplates
};