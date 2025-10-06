const pool = require('../../config/db');

const CampaignModel = {
    async create(campaignData) {
        const query = `
            INSERT INTO campaigns (empresa_id, nombre, descripcion, fecha_inicio, fecha_fin)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [
            campaignData.empresa_id,
            campaignData.nombre,
            campaignData.descripcion,
            campaignData.fecha_inicio,
            campaignData.fecha_fin
        ];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async findById(campaignId) {
        const query = 'SELECT * FROM campaigns WHERE id = $1;';
        const { rows } = await pool.query(query, [campaignId]);
        return rows[0];
    },

    async update(campaignId, campaignData) {
        const query = `
            UPDATE campaigns
            SET nombre = $1, descripcion = $2, fecha_inicio = $3, fecha_fin = $4
            WHERE id = $5
            RETURNING *;
        `;
        const values = [
            campaignData.nombre,
            campaignData.descripcion,
            campaignData.fecha_inicio,
            campaignData.fecha_fin,
            campaignId
        ];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async delete(campaignId) {
        const query = 'DELETE FROM campaigns WHERE id = $1 RETURNING *;';
        const { rows } = await pool.query(query, [campaignId]);
        return rows[0];
    }
};

module.exports = CampaignModel;

