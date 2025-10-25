const pool = require('../../config/db');

const SmsSentModel = {
    async create({ numero, mensaje, estado, fecha_envio, campaña_id, form_id }) {
        const result = await pool.query(
            'INSERT INTO sms_sent (to, message, campaign_id, form_id, status, error) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [to, message, campaign_id, form_id, status, error]
        );
        return result.rows[0];
    },
    async findAll({ campaña_id, form_id, fromDate, toDate }) {
        let query = 'SELECT * FROM sms_sent WHERE 1=1';
        const values = [];
        if (campaña_id) { query += ' AND campaña_id = $' + (values.length + 1); values.push(campaña_id); }
        if (form_id) { query += ' AND form_id = $' + (values.length + 1); values.push(form_id); }
        if (fromDate) { query += ' AND fecha_envio >= $' + (values.length + 1); values.push(fromDate); }
        if (toDate) { query += ' AND fecha_envio <= $' + (values.length + 1); values.push(toDate); }
        query += ' ORDER BY fecha_envio DESC';
        const { rows } = await pool.query(query, values);
        return rows;
    },
    async count({ campaña_id, form_id }) {
        let query = 'SELECT COUNT(*) FROM sms_sent WHERE 1=1';
        const values = [];
        if (campaña_id) { query += ' AND campaña_id = $' + (values.length + 1); values.push(campaña_id); }
        if (form_id) { query += ' AND form_id = $' + (values.length + 1); values.push(form_id); }
        const { rows } = await pool.query(query, values);
        return parseInt(rows[0].count, 10);
    }
};

module.exports = SmsSentModel;
