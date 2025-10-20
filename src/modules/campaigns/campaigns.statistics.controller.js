const pool = require('../../config/db');

const CampaignStatisticsController = {
    async getStatistics(req, res, next) {
        try {
            const { campaignId } = req.query;
            if (!campaignId) return res.status(400).json({ success: false, message: 'campaignId es requerido.' });
            // Simulación: reemplaza por tu consulta real
            const query = `
                SELECT 
                    COUNT(*) AS TotalCount,
                    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) AS DeliveredCount,
                    SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) AS SubmittedCount,
                    SUM(CASE WHEN status = 'undelivered' THEN 1 ELSE 0 END) AS UnDeliveredCount,
                    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS RejectedCount
                FROM sms_messages
                WHERE campaign_id = $1;
            `;
            const { rows } = await pool.query(query, [campaignId]);
            res.status(200).json({ success: true, data: rows[0] });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = CampaignStatisticsController;
