// value365-backend/src/modules/templates/templates.controller.js
const templateService = require('./templates.service');

/**
 * [POST] /api/v1/templates
 * Registra una nueva plantilla.
 */
const createTemplate = async (req, res, next) => {
    try {
        const { nombre, descripcion, datos_plantilla, categoria, imagen_preview } = req.body;
        
        // Datos del usuario obtenidos del JWT (req.user)
        const creadoPor = req.user.user_id; 
        const empresaId = req.user.empresa_id; // Obtenido del token

        // Validaciones de entrada
        if (!nombre || !datos_plantilla) {
            return res.status(400).json({
                success: false,
                message: 'El nombre y los datos_plantilla son campos obligatorios.'
            });
        }
        
        // El campo datos_plantilla debe ser un objeto JSON para PostgreSQL
        if (typeof datos_plantilla !== 'object' || datos_plantilla === null) {
            return res.status(400).json({
                success: false,
                message: 'datos_plantilla debe ser un objeto JSON válido.'
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

        // HTTP 201 Created
        res.status(201).json({
            success: true,
            message: 'Plantilla registrada exitosamente.',
            template: newTemplate
        });
    } catch (error) {
        next(error); 
    }
};

/**
 * [GET] /api/v1/templates
 * Obtiene todas las plantillas disponibles.
 */
const getTemplates = async (req, res, next) => {
    try {
        // Obtenemos el ID de empresa para filtrar plantillas
        const empresaId = req.user.empresa_id; 

        const templates = await templateService.getAvailableTemplates(empresaId);
        
        // HTTP 200 OK
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