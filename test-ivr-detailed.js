// Test aislado para verificar imports
console.log('=== TEST DE IMPORTS IVR ===\n');

try {
    console.log('1. Cargando IVRController...');
    const IVRController = require('./src/modules/ivr/ivr.controller');
    console.log('   ✅ IVRController cargado:', typeof IVRController);
    
    console.log('\n2. Cargando verifyToken...');
    const { verifyToken } = require('./src/modules/auth/jwt.middleware');
    console.log('   ✅ verifyToken cargado:', typeof verifyToken);
    
    console.log('\n3. Verificando métodos del controlador:');
    const methods = [
        'createFlow', 'getFlows', 'getFlowById', 'getFlowWithNodes', 
        'updateFlow', 'deleteFlow', 'createNode', 'getNodesByFlowId',
        'getNodeById', 'updateNode', 'bulkUpdateNodes', 'deleteNode',
        'getCalls', 'getCallById', 'getCallInteractions', 'getCallStats',
        'handleIncomingCall', 'handleGatherInput', 'handleCallStatus'
    ];
    
    let allOk = true;
    methods.forEach(method => {
        const type = typeof IVRController[method];
        const ok = type === 'function';
        console.log(`   ${ok ? '✅' : '❌'} ${method}: ${type}`);
        if (!ok) allOk = false;
    });
    
    if (!allOk) {
        console.log('\n❌ HAY MÉTODOS QUE NO SON FUNCIONES');
        process.exit(1);
    }
    
    console.log('\n4. Intentando crear router...');
    const express = require('express');
    const router = express.Router();
    
    console.log('\n5. Registrando rutas una por una...');
    
    try {
        router.post('/flows', verifyToken, IVRController.createFlow);
        console.log('   ✅ POST /flows');
    } catch (e) {
        console.log('   ❌ POST /flows:', e.message);
    }
    
    try {
        router.get('/flows', verifyToken, IVRController.getFlows);
        console.log('   ✅ GET /flows');
    } catch (e) {
        console.log('   ❌ GET /flows:', e.message);
    }
    
    try {
        router.get('/flows/:id', verifyToken, IVRController.getFlowById);
        console.log('   ✅ GET /flows/:id');
    } catch (e) {
        console.log('   ❌ GET /flows/:id:', e.message);
    }
    
    try {
        router.get('/flows/:id/complete', verifyToken, IVRController.getFlowWithNodes);
        console.log('   ✅ GET /flows/:id/complete');
    } catch (e) {
        console.log('   ❌ GET /flows/:id/complete:', e.message);
    }
    
    try {
        router.put('/flows/:id', verifyToken, IVRController.updateFlow);
        console.log('   ✅ PUT /flows/:id');
    } catch (e) {
        console.log('   ❌ PUT /flows/:id:', e.message);
    }
    
    try {
        router.delete('/flows/:id', verifyToken, IVRController.deleteFlow);
        console.log('   ✅ DELETE /flows/:id');
    } catch (e) {
        console.log('   ❌ DELETE /flows/:id:', e.message);
    }
    
    console.log('\n✅ TODAS LAS RUTAS SE REGISTRARON CORRECTAMENTE');
    
} catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
}
