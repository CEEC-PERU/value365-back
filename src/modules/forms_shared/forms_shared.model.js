const pool = require('../../config/db');

const FormSharesModel = {
    /**
     * Crea un nuevo registro para compartir un formulario.
     * @param {Object} shareData - Datos como form_id, tipo y la URL generada.
     * @param {pg.Client} client - Cliente opcional para transacciones.
     */
    async create(shareData, client = pool) {
        const { form_id, tipo, url_generada, configuracion } = shareData;
        
        const query = `
            INSERT INTO form_shares (form_id, tipo, url_generada, configuracion, activo)
            VALUES ($1, $2, $3, $4, TRUE)
            RETURNING *;
        `;
        
        const values = [
            form_id,
            tipo,
            url_generada,
            JSON.stringify(configuracion || {})
        ];

        const { rows } = await client.query(query, values);
        return rows[0];
    }
};

module.exports = FormSharesModel;