// --- CORRECCIÓN ---
// Se ajusta la ruta para importar correctamente la configuración de la base de datos.
const pool = require('../../config/db');

const CampaignModel = {
    async create({ empresa_id, nombre, descripcion, publico_objetivo, user_id }) {
        const query = `
            INSERT INTO campaigns (empresa_id, nombre, descripcion, publico_objetivo, user_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [empresa_id, nombre, descripcion, publico_objetivo, user_id];

        const { rows } = await pool.query(query, values);
        return rows[0];
    },

    async findByEmpresaId(empresaId) {
        const query = 'SELECT * FROM campaigns WHERE empresa_id = $1 ORDER BY fecha_creacion DESC;';
        const { rows } = await pool.query(query, [empresaId]);
        return rows;
    },

    async findByIdWithForms(id, empresaId) {
        const campaignQuery = 'SELECT * FROM campaigns WHERE id = $1 AND empresa_id = $2;';
        const campaignResult = await pool.query(campaignQuery, [id, empresaId]);
        const campaign = campaignResult.rows[0];

        // --- CORRECCIÓN ---
        // Se añade una validación para evitar errores si la campaña no existe.
        if (!campaign) {
            return null;
        }

        const formsQuery = 'SELECT id, titulo, estado, fecha_creacion FROM forms WHERE campaign_id = $1 ORDER BY fecha_creacion DESC;';
        const formsResult = await pool.query(formsQuery, [id]);
        
        campaign.forms = formsResult.rows;

        return campaign;
    },
    
    async findById(id, empresaId) {
        const query = 'SELECT * FROM campaigns WHERE id = $1 AND empresa_id = $2;';
        const { rows } = await pool.query(query, [id, empresaId]);
        return rows[0];
    },


    async update(id, { nombre, descripcion, publico_objetivo, estado }) {
        const query = `
            UPDATE campaigns
            SET 
                nombre = $1, 
                descripcion = $2, 
                publico_objetivo = $3,
                estado = $4,
                fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *;
        `;
        const values = [nombre, descripcion, publico_objetivo, estado, id];
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

