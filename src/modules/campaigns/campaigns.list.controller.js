const pool = require('../../config/db');

const CampaignListController = {
    async getCampaigns(req, res, next) {
        try {
            const { fromdate, enddate } = req.query;
            // Simulación: reemplaza por tu consulta real
            const query = `
                SELECT c.*, COUNT(m.id) AS MessageCount
                FROM campaigns c
                LEFT JOIN sms_messages m ON m.campaign_id = c.id
                WHERE c.fecha_creacion BETWEEN $1 AND $2
                GROUP BY c.id
                ORDER BY c.fecha_creacion DESC;
            `;
            const { rows } = await pool.query(query, [fromdate, enddate]);
            res.status(200).json({ success: true, data: rows });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = CampaignListController;
