const express = require('express');
const router = express.Router();
const CampaignSMSController = require('./campaigns.sms.controller');

// Endpoint para obtener el listado y conteo total de todos los SMS
router.get('/sms', CampaignSMSController.getSMSList);

module.exports = router;
