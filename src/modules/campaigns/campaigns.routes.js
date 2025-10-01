const express = require('express');
const router = express.Router();
const { createCampaign, getCampaigns, getCampaignById, updateCampaign, deleteCampaign } = require('./campaigns.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

// Aplicamos el middleware de seguridad a todas las rutas de este archivo
router.use(jwtMiddleware);

// Definimos la ruta para POST /api/campaigns
router.post('/', createCampaign);

// Definimos la ruta para GET /api/campaigns
router.get('/', getCampaigns);

// Definimos las rutas para un ID específico
router.get('/:id', getCampaignById);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);

module.exports = router;

