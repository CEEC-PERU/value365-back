const express = require('express');
const router = express.Router();
const IVRController = require('./ivr.controller');
const verifyToken = require('../auth/jwt.middleware');

// Endpoints públicos (sin autenticación) - para webhooks y testing
router.get('/health', IVRController.healthCheck);
router.post('/webhook/:flowId', IVRController.handleWebhook);
router.post('/webhook/:flowId/input', IVRController.handleUserInput);

// Endpoints protegidos (requieren autenticación)
router.post('/flows', verifyToken, IVRController.createFlow);
router.get('/flows', verifyToken, IVRController.getFlows);
router.get('/flows/:id', verifyToken, IVRController.getFlowById);
router.get('/flows/:id/complete', verifyToken, IVRController.getFlowWithNodes);
router.put('/flows/:id', verifyToken, IVRController.updateFlow);
router.delete('/flows/:id', verifyToken, IVRController.deleteFlow);

router.post('/nodes', verifyToken, IVRController.createNode);
router.get('/flows/:flowId/nodes', verifyToken, IVRController.getNodesByFlowId);
router.get('/nodes/:id', verifyToken, IVRController.getNodeById);
router.put('/nodes/:id', verifyToken, IVRController.updateNode);
router.put('/nodes/bulk', verifyToken, IVRController.bulkUpdateNodes);
router.delete('/nodes/:id', verifyToken, IVRController.deleteNode);

router.get('/calls', verifyToken, IVRController.getCalls);
router.post('/calls', verifyToken, IVRController.createCall);
router.get('/calls/:id', verifyToken, IVRController.getCallById);
router.put('/calls/:id/status', verifyToken, IVRController.updateCallStatus);
router.get('/calls/:id/interactions', verifyToken, IVRController.getCallInteractions);
router.get('/stats', verifyToken, IVRController.getCallStats);


// Endpoint personalizado para frontend (sin autenticación)
router.post('/llamadas/iniciar', IVRController.iniciarLlamadaDesdeFrontend);
router.post('/iniciar-llamada', verifyToken, IVRController.iniciarLlamada);

router.post('/webhook/incoming', IVRController.handleIncomingCall);
router.post('/webhook/outbound', IVRController.handleOutboundCall);
router.post('/webhook/gather', IVRController.handleGatherInput);
router.post('/webhook/status', IVRController.handleCallStatus);

// Rutas para consolidaciones
router.get('/consolidations', IVRController.getConsolidations);
router.get('/consolidations/stats', IVRController.getConsolidationStats);
router.get('/consolidations/field/:fieldName', IVRController.getCollectedDataByField);
router.get('/consolidations/call/:callId', IVRController.getConsolidationByCallId);

module.exports = router;
