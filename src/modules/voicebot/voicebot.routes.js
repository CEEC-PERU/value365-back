const express = require('express');
const router = express.Router();
const VoicebotController = require('./voicebot.controller');
const VoicebotVonageController = require('./voicebot-vonage.controller');

// Rutas Twilio
router.post('/iniciar-llamada', VoicebotController.iniciarLlamada);
router.post('/webhook', VoicebotController.handleWebhook);

// Rutas Vonage (alternativa gratuita)
router.post('/vonage/iniciar-llamada', VoicebotVonageController.iniciarLlamada);
router.post('/vonage-webhook', VoicebotVonageController.handleWebhook);

module.exports = router;
