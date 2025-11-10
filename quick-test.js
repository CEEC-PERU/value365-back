/**
 * Prueba básica para verificar que el servidor IVR esté funcionando
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:9080';
const IVR_URL = `${BASE_URL}/api/ivr`;

async function quickTest() {
  try {
    console.log('🧪 Prueba rápida del sistema IVR');
    console.log('===============================\n');

    // 1. Verificar servidor principal
    console.log('1️⃣ Verificando servidor principal...');
    const healthCheck = await axios.get(BASE_URL);
    console.log('✅ Servidor principal:', healthCheck.data);

    // 2. Verificar endpoint de health check de IVR
    console.log('\n2️⃣ Verificando health check de IVR...');
    const ivrHealthResponse = await axios.get(`${IVR_URL}/health`);
    console.log('✅ IVR Health Check:', ivrHealthResponse.data.message);
    console.log('📊 Version:', ivrHealthResponse.data.version);
    console.log('📊 Endpoints disponibles:', Object.keys(ivrHealthResponse.data.endpoints).length);

    // 3. Verificar webhook endpoint
    console.log('\n3️⃣ Verificando endpoint de webhooks...');
    try {
      // Solo verificamos que el endpoint responda, no que procese correctamente
      await axios.post(`${IVR_URL}/webhook/test`, { test: true });
    } catch (error) {
      if (error.response && error.response.status !== 500) {
        console.log('✅ Endpoint webhook responde (esto es esperado)');
      } else {
        console.log('⚠️ Endpoint webhook puede tener problemas');
      }
    }

    console.log('\n🎉 ¡Sistema IVR básico funcionando correctamente!');
    console.log('\n💡 Notas:');
    console.log('   - Los endpoints de gestión requieren autenticación JWT');
    console.log('   - Los webhooks son públicos (para Twilio)');
    console.log('   - Para pruebas completas con datos, inicia sesión primero');

  } catch (error) {
    console.error('\n❌ Error en la prueba:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 No se pudo conectar al servidor');
      console.error('💡 Asegúrate de que el servidor esté ejecutándose con: npm start');
    } else if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📝 Mensaje:', error.response.data);
    } else {
      console.error('📝 Error:', error.message);
    }
  }
}

quickTest();