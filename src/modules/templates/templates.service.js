const templateModel = require('./templates.model');

class TemplateService {
    
    async createTemplate(data) {
        try {
            const { empresaId, nombre, descripcion, datos_plantilla, creadoPor, categoria, imagen_preview } = data;
            
            
            const newTemplate = await templateModel.insert(
                empresaId, 
                nombre, 
                descripcion, 
                datos_plantilla, 
                creadoPor,
                categoria || 'General', 
                imagen_preview
            );
            return newTemplate;

        } catch (error) {
            console.error("Error en TemplateService.createTemplate:", error.message);
            throw new Error(`Fallo al registrar la plantilla: ${error.message}`);
        }
    }
    
    async getAvailableTemplates(empresaId) {
        try {
            const templates = await templateModel.findAllAvailable(empresaId);
            return templates;

        } catch (error) {
            console.error("Error en TemplateService.getAvailableTemplates:", error.message);
            throw new Error('No se pudieron obtener las plantillas.');
        }
    }
}

module.exports = new TemplateService();