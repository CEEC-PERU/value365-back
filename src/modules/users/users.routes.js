const express = require('express');
const router = express.Router();
const userController = require('./users.controller');
const verifyToken = require('../auth/jwt.middleware');

router.get('/me', verifyToken, userController.getProfile);
router.get('/me/empresas', verifyToken, userController.getUserEmpresas);
router.get('/me/empresas-campaigns', verifyToken, userController.getUserEmpresasWithCampaigns);

module.exports = router;
