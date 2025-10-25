const express = require('express');
const router = express.Router();
const { getSmsSent, countSmsSent } = require('./sms_sent.controller');

// Reporte de SMS enviados
router.get('/', getSmsSent);
router.get('/count', countSmsSent);

module.exports = router;
