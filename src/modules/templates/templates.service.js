const templateModel = require('./templates.model');

class TemplateService {
    /**
     * Crea y registra una nueva plantilla.
     */
    async createTemplate(data) {
        try {
            // Desestructuración de datos con validación mínima
            const { empresaId, nombre, descripcion, datos_plantilla, creadoPor, categoria, imagen_preview } = data;

            if (!nombre || !datos_plantilla || !creadoPor || !empresaId) {
                 throw new Error("Faltan datos esenciales (nombre, datos_plantilla, usuario o empresa).");
            }
            
            // Llama al modelo para la inserción
            const newTemplate = await templateModel.insert(
                empresaId, 
                nombre, 
                descripcion, 
                datos_plantilla, 
                creadoPor,
                categoria || 'General', // Valor por defecto si no se proporciona
                imagen_preview
            );
            return newTemplate;

        } catch (error) {
            console.error("Error en TemplateService.createTemplate:", error.message);
            throw new Error(`Fallo al registrar la plantilla: ${error.message}`);
        }
    }

    /**
     * Obtiene todas las plantillas disponibles para una empresa.
     */
    async getAvailableTemplates(empresaId) {
        try {
            if (!empresaId) {
                 throw new Error("ID de empresa es requerido para obtener plantillas.");
            }
            
            const templates = await templateModel.findAllAvailable(empresaId);
            return templates;

        } catch (error) {
            console.error("Error en TemplateService.getAvailableTemplates:", error.message);
            throw new Error('No se pudieron obtener las plantillas.');
        }
    }
}

module.exports = new TemplateService();