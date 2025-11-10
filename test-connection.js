/**
 * Test simple de conectividad
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:9080/api/ivr';

async function testConnection() {
  try {
    console.log('🔍 Verificando conectividad con el servidor...');
    
    // Test básico de conectividad
    const healthResponse = await axios.get('http://localhost:9080/');
    console.log('✅ Servidor respondiendo:', healthResponse.data);
    
    // Test específico de IVR
    const ivrResponse = await axios.get(`${BASE_URL}/flows`);
    console.log('✅ Endpoint IVR disponible');
    console.log('📊 Respuesta:', ivrResponse.status, ivrResponse.statusText);
    
  } catch (error) {
    console.error('❌ Error de conectividad:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('StatusText:', error.response.statusText);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No hay respuesta del servidor');
      console.error('Asegúrate de que el servidor esté ejecutándose en http://localhost:9080');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testConnection();