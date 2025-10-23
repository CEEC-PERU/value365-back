const pool = require('../../config/db'); 

class TemplateModel {

    async insert(empresaId, nombre, descripcion, datosPlantilla, creadoPor, categoria, imagenPreview = null) {
        const query = `
            INSERT INTO templates (
                empresa_id, nombre, descripcion, datos_plantilla, creado_por, categoria, imagen_preview
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, nombre, descripcion, categoria, datos_plantilla, creado_por, fecha_creacion;
        `;
        const result = await pool.query(query, [empresaId, nombre, descripcion, datosPlantilla, creadoPor, categoria, imagenPreview]);
        return result.rows[0];
    }

  
    async findAllAvailable(empresaId) {
        const query = `
            SELECT 
                t.id, t.nombre, t.descripcion, t.categoria, t.datos_plantilla, 
                t.es_predeterminada, t.es_publica, t.veces_usado, t.fecha_creacion,
                u.username as creado_por_username 
            FROM templates t
            JOIN users u ON t.creado_por = u.id
            -- Muestra plantillas de la empresa O plantillas que son marcadas como públicas
            WHERE t.empresa_id = $1 OR t.es_publica = TRUE 
            ORDER BY t.es_predeterminada DESC, t.fecha_creacion DESC;
        `;
        const result = await pool.query(query, [empresaId]);
        return result.rows;
    }
}

module.exports = new TemplateModel();