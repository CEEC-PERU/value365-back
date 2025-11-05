const express = require('express');
const router = express.Router();
const VoicebotController = require('./voicebot.controller');

router.post('/webhook', VoicebotController.handleWebhook);

module.exports = router;
