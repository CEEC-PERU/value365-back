const pool = require('../../config/db');

const CampaignSMSController = {
    async getSMSList(req, res, next) {
        try {
            const { fromdate, enddate } = req.query;
            // Simulación: reemplaza por tu consulta real
            const query = `
                SELECT *, COUNT(*) OVER() AS total
                FROM sms_messages
                WHERE fecha_envio BETWEEN $1 AND $2
                ORDER BY fecha_envio DESC;
            `;
            const { rows } = await pool.query(query, [fromdate, enddate]);
            res.status(200).json({ success: true, data: rows, total: rows.length ? rows[0].total : 0 });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = CampaignSMSController;
