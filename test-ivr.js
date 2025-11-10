/**
 * Archivo de prueba para el sistema IVR
 * Ejecutar: node test-ivr.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:9080/api/ivr';

// Datos de prueba
const testFlowData = {
  name: 'Flujo de Prueba IVR',
  description: 'Flujo de prueba para validar el sistema IVR',
  status: 'active'
};

const testNodeData = {
  node_name: 'Nodo Principal',
  node_type: 'menu_opciones',
  config: {
    mensaje: 'Bienvenido al sistema IVR. Presione 1 para continuar, 2 para hablar con un agente',
    opciones: [
      { numero: '1', descripcion: 'Continuar' },
      { numero: '2', descripcion: 'Hablar con agente' }
    ],
    timeout: 10
  },
  position: 0
};

async function runTests() {
  console.log('🧪 Iniciando pruebas del sistema IVR...\n');

  try {
    // 1. Crear flujo
    console.log('📋 1. Creando flujo de prueba...');
    const flowResponse = await axios.post(`${BASE_URL}/flows`, testFlowData);
    console.log('✅ Flujo creado:', flowResponse.data);
    const flowId = flowResponse.data.data ? flowResponse.data.data.id : flowResponse.data.id;

    // 2. Crear nodo
    console.log('\n📋 2. Creando nodo de prueba...');
    const nodeData = { ...testNodeData, flow_id: flowId };
    const nodeResponse = await axios.post(`${BASE_URL}/nodes`, nodeData);
    console.log('✅ Nodo creado:', nodeResponse.data.data.id);

    // 3. Obtener flujo con nodos
    console.log('\n📋 3. Obteniendo flujo con nodos...');
    const flowWithNodes = await axios.get(`${BASE_URL}/flows/${flowId}/nodes`);
    console.log('✅ Flujo con nodos obtenido:', flowWithNodes.data.data.nodes.length, 'nodos');

    // 4. Crear llamada de prueba
    console.log('\n📞 4. Creando llamada de prueba...');
    const callData = {
      flow_id: flowId,
      phone_number: '+1234567890',
      call_sid: 'test_call_' + Date.now(),
      status: 'initiated'
    };
    const callResponse = await axios.post(`${BASE_URL}/calls`, callData);
    console.log('✅ Llamada creada:', callResponse.data.data.id);
    const callId = callResponse.data.data.id;

    // 5. Simular interacción
    console.log('\n📞 5. Registrando interacción...');
    const interactionData = {
      callId: callId,
      nodeId: nodeResponse.data.data.id,
      nodeType: 'menu_opciones',
      userInput: '1',
      systemResponse: 'Usuario seleccionó opción 1'
    };
    const interactionResponse = await axios.post(`${BASE_URL}/calls/${callId}/interactions`, interactionData);
    console.log('✅ Interacción registrada');

    // 6. Consolidar datos
    console.log('\n📊 6. Consolidando datos de llamada...');
    const consolidationData = {
      call_id: callId,
      collected_data: {
        opcion_principal: '1',
        tiempo_respuesta: 5,
        satisfaccion: 'alta'
      },
      final_node_id: nodeResponse.data.data.id,
      completion_status: 'completed'
    };
    const consolidationResponse = await axios.post(`${BASE_URL}/calls/${callId}/consolidate`, consolidationData);
    console.log('✅ Datos consolidados');

    // 7. Obtener estadísticas
    console.log('\n📊 7. Obteniendo estadísticas...');
    const statsResponse = await axios.get(`${BASE_URL}/calls/stats`);
    console.log('✅ Estadísticas de llamadas:', statsResponse.data.data);

    const consolidationStatsResponse = await axios.get(`${BASE_URL}/consolidations/stats`);
    console.log('✅ Estadísticas de consolidación:', consolidationStatsResponse.data.data);

    // 8. Actualizar estado de llamada
    console.log('\n📞 8. Actualizando estado de llamada...');
    const updateResponse = await axios.put(`${BASE_URL}/calls/${callId}/status`, {
      status: 'completed',
      duration: 45,
      ended_at: new Date().toISOString()
    });
    console.log('✅ Estado actualizado');

    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    console.error('Stack:', error.stack);
  }
}

// Función para limpiar datos de prueba
async function cleanup() {
  console.log('\n🧹 Limpiando datos de prueba...');
  
  try {
    // Obtener todos los flujos
    const flowsResponse = await axios.get(`${BASE_URL}/flows`);
    const testFlows = flowsResponse.data.data.filter(flow => 
      flow.name.includes('Prueba') || flow.name.includes('Test')
    );

    for (const flow of testFlows) {
      await axios.delete(`${BASE_URL}/flows/${flow.id}`);
      console.log(`✅ Flujo eliminado: ${flow.id}`);
    }
    
    console.log('🎯 Limpieza completada');
  } catch (error) {
    console.error('❌ Error en la limpieza:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas
if (require.main === module) {
  const action = process.argv[2];
  
  if (action === 'cleanup') {
    cleanup();
  } else {
    runTests();
  }
}

module.exports = { runTests, cleanup };