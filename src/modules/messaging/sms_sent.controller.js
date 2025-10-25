const SmsSentModel = require('./sms_sent.model');

// GET /api/sms-sent?campaña_id=...&form_id=...&fromDate=...&toDate=...
const getSmsSent = async (req, res) => {
    console.log('🔎 Petición recibida en GET /api/messaging/sms-sent', req.query);
    try {
        const { campaña_id, form_id, fromDate, toDate } = req.query;
        const data = await SmsSentModel.findAll({ campaña_id, form_id, fromDate, toDate });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET /api/sms-sent/count?campaña_id=...&form_id=...
const countSmsSent = async (req, res) => {
    try {
        const { campaña_id, form_id } = req.query;
        const count = await SmsSentModel.count({ campaña_id, form_id });
        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getSmsSent,
    countSmsSent
};
