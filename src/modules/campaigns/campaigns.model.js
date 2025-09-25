const pool = require('../../config/db');

const CampaignModel = {
    async create({ empresa_id, nombre, descripcion, objetivo, creado_por }) {
        const query = `
            INSERT INTO campaigns (empresa_id, nombre, descripcion, objetivo, creado_por)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [empresa_id, nombre, descripcion, objetivo, creado_por];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async findByEmpresaId(empresaId) {
        const query = 'SELECT * FROM campaigns WHERE empresa_id = $1 ORDER BY fecha_creacion DESC;';
        const { rows } = await pool.query(query, [empresaId]);
        return rows;
    },

    async findById(id, empresaId) {
        const query = 'SELECT * FROM campaigns WHERE id = $1 AND empresa_id = $2;';
        const { rows } = await pool.query(query, [id, empresaId]);
        return rows[0];
    },

    async update(id, { nombre, descripcion, objetivo, estado }) {
        const query = `
            UPDATE campaigns
            SET 
                nombre = $1, 
                descripcion = $2, 
                objetivo = $3,
                estado = $4,
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *;
        `;
        const values = [nombre, descripcion, objetivo, estado, id];
        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async delete(id, empresaId) {
        const query = 'DELETE FROM campaigns WHERE id = $1 AND empresa_id = $2 RETURNING *;';
        const { rows } = await pool.query(query, [id, empresaId]);
        return rows[0];
    }
};

module.exports = CampaignModel;