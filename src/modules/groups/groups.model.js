const pool = require('../../config/db');

const GroupsModel = {
    async create({ name, type = 'Normal', optin_name = '' }) {
        const query = `
            INSERT INTO groups (name, type, optin_name)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [name, type, optin_name]);
        return rows[0];
    },

    async findAll() {
        const query = `
            SELECT g.*, 
                (SELECT COUNT(*) FROM group_contacts gc WHERE gc.group_id = g.id) AS total_contacts
            FROM groups g
            ORDER BY g.fecha_creacion DESC;
        `;
        const { rows } = await pool.query(query);
        return rows;
    },

    async findById(id) {
        const query = `
            SELECT g.*, 
                (SELECT COUNT(*) FROM group_contacts gc WHERE gc.group_id = g.id) AS total_contacts
            FROM groups g
            WHERE g.id = $1;
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    },

    async update(id, { name, type, optin_name }) {
        const query = `
            UPDATE groups
            SET name = $1, type = $2, optin_name = $3, fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [name, type, optin_name, id]);
        return rows[0];
    },

    async delete(id) {
        const query = 'DELETE FROM groups WHERE id = $1 RETURNING *;';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
};

module.exports = GroupsModel;
