const pool = require('../../config/db');

const MediaModel = {
    async create(mediaData) {
        const {
            empresa_id,
            nombre_archivo,
            nombre_original,
            ruta_archivo,
            url_publica,
            tamaño_archivo,
            tipo_mime,
            tipo_archivo,
            subido_por,
            source,
        } = mediaData;

        const query = `
            INSERT INTO media_files (
                empresa_id, nombre_archivo, nombre_original, ruta_archivo, url_publica,
                tamaño_archivo, tipo_mime, tipo_archivo, subido_por, source
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, url_publica, nombre_original, source;
        `;

        const values = [
            empresa_id, nombre_archivo, nombre_original, ruta_archivo, url_publica,
            tamaño_archivo, tipo_mime, tipo_archivo, subido_por, source
        ];

        const { rows } = await pool.query(query, values);
        return rows[0];
    }
};

module.exports = MediaModel;