const pool = require('../../config/db');

const ContactsModel = {
    async create({ name, mobile, email }) {
        const query = `
            INSERT INTO contacts (name, phone, email)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [name, mobile, email]);
        return rows[0];
    },

    async findById(id) {
        const query = 'SELECT * FROM contacts WHERE id = $1;';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    },

    async findAll() {
        const query = 'SELECT * FROM contacts ORDER BY fecha_creacion DESC;';
        const { rows } = await pool.query(query);
        return rows;
    },

    async delete(id) {
        const query = 'DELETE FROM contacts WHERE id = $1 RETURNING *;';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
};

module.exports = ContactsModel;
