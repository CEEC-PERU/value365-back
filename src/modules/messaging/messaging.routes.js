const express = require('express');
const router = express.Router();
const messagingController = require('./messaging.controller');


router.post('/send-sms', messagingController.sendSmsController);

module.exports = router;
