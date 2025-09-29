const pool = require('../../config/db');

const FormModel = {
    async create(formData) {
        const { campaign_id, titulo, descripcion } = formData;
        const diseño = JSON.stringify(formData.diseño || {});
        const configuraciones = JSON.stringify(formData.configuraciones || {});

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
    },

    async findById(formId) {
        const query = 'SELECT * FROM forms WHERE id = $1;';
        const { rows } = await pool.query(query, [formId]);
        return rows[0];
    },

    async update(formId, dataToUpdate) {
        const fields = Object.keys(dataToUpdate);
        const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

        const values = fields.map(field => {
            if (field === 'diseño' && typeof dataToUpdate[field] === 'object') {
                return JSON.stringify(dataToUpdate[field]);
            }
            return dataToUpdate[field];
        });

        const query = `
            UPDATE forms
            SET ${setString}, fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = $${fields.length + 1}
            RETURNING *;
        `;

        const { rows } = await pool.query(query, [...values, formId]);
        return rows[0];
    }
};

module.exports = FormModel;
