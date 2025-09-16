const pool = require('../../config/db');

class TemplatesService {
  async create(templateData, userId) {
    try {
      const {
        empresa_id = 2, 
        nombre,
        descripcion,
        categoria,
        datos_plantilla,
        imagen_preview,
        es_predeterminada = false,
        es_publica = false
      } = templateData;

      const query = `
        INSERT INTO templates (
          empresa_id, nombre, descripcion, categoria, datos_plantilla,
          imagen_preview, es_predeterminada, es_publica, creado_por
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

      const values = [
        empresa_id,
        nombre,
        descripcion,
        categoria,
        datos_plantilla,
        imagen_preview,
        es_predeterminada,
        es_publica,
        userId
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getAll(empresaId = 2) {
    try {
      const query = `
        SELECT t.*, u.username as creado_por_nombre
        FROM templates t
        LEFT JOIN users u ON t.creado_por = u.id
        WHERE t.empresa_id = $1 OR t.es_publica = true
        ORDER BY t.fecha_creacion DESC
      `;

      const result = await pool.query(query, [empresaId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async getById(id) {
    try {
      const query = `
        SELECT t.*, u.username as creado_por_nombre
        FROM templates t
        LEFT JOIN users u ON t.creado_por = u.id
        WHERE t.id = $1
      `;

      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error('Template no encontrado');
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async update(id, templateData, userId) {
    try {
      const {
        nombre,
        descripcion,
        categoria,
        datos_plantilla,
        imagen_preview,
        es_predeterminada,
        es_publica
      } = templateData;

      const query = `
        UPDATE templates 
        SET 
          nombre = COALESCE($2, nombre),
          descripcion = COALESCE($3, descripcion),
          categoria = COALESCE($4, categoria),
          datos_plantilla = COALESCE($5, datos_plantilla),
          imagen_preview = COALESCE($6, imagen_preview),
          es_predeterminada = COALESCE($7, es_predeterminada),
          es_publica = COALESCE($8, es_publica),
          fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = $1 AND creado_por = $9
        RETURNING *
      `;

      const values = [
        id, nombre, descripcion, categoria, datos_plantilla,
        imagen_preview, es_predeterminada, es_publica, userId
      ];

      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        throw new Error('Template no encontrado o sin permisos');
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async delete(id, userId) {
    try {
      const query = `
        DELETE FROM templates 
        WHERE id = $1 AND creado_por = $2
        RETURNING *
      `;

      const result = await pool.query(query, [id, userId]);
      if (result.rows.length === 0) {
        throw new Error('Template no encontrado o sin permisos');
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async incrementarUso(id) {
    try {
      const query = `
        UPDATE templates 
        SET veces_usado = veces_usado + 1
        WHERE id = $1
        RETURNING *
      `;

      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TemplatesService();

