const express = require('express');
const router = express.Router();
const messagingController = require('./messaging.controller');

router.post('/send-campaign', messagingController.sendCampaignController);

module.exports = router;