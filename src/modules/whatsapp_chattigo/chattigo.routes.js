const express = require('express');
const router = express.Router();
const ctrl = require('./chattigo.controller');

// Enviar campaña WhatsApp
router.post('/send-campaign', ctrl.sendCampaign);

// Webhook para Chattigo/Meta
router.get('/webhook', ctrl.webhookVerify);
router.post('/webhook', ctrl.webhookReceive);

module.exports = router;
