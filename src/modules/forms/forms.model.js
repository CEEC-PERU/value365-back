const pool = require('../../config/db');

const FormModel = {
    async create(formData) {
        const { campaign_id, titulo, descripcion, diseño, configuraciones } = formData;
        const query = `
            INSERT INTO forms (campaign_id, titulo, descripcion, diseño, configuraciones)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const values = [campaign_id, titulo, descripcion, diseño, configuraciones];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },
    async findByCampaignId(campaignId) {
        const query = 'SELECT * FROM forms WHERE campaign_id = $1 ORDER BY fecha_creacion DESC;';
        const { rows } = await pool.query(query, [campaignId]);
        return rows;
    }
    // Aquí irían las funciones de update, findById, delete, etc.
};
module.exports = FormModel;