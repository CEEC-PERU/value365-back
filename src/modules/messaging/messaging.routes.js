const express = require('express');
const router = express.Router();
const messagingController = require('./messaging.controller');
const smsSentRoutes = require('./sms_sent.routes');

router.post('/send-campaign', messagingController.sendCampaignController);

// Rutas para reporte y conteo de SMS enviados
router.use('/sms-sent', smsSentRoutes);

module.exports = router;