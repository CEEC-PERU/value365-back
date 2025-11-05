const express = require('express');
const router = express.Router();
const IVRController = require('./ivr.controller');
const { verifyToken } = require('../auth/jwt.middleware');

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
router.get('/calls/:id', verifyToken, IVRController.getCallById);
router.get('/calls/:id/interactions', verifyToken, IVRController.getCallInteractions);
router.get('/stats', verifyToken, IVRController.getCallStats);

router.post('/webhook/incoming', IVRController.handleIncomingCall);
router.post('/webhook/gather', IVRController.handleGatherInput);
router.post('/webhook/status', IVRController.handleCallStatus);

module.exports = router;
