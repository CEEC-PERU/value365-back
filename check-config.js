/**
 * Verificar configuración actual del servidor
 */

require('dotenv').config();

console.log('🔍 Configuración del servidor:');
console.log('===============================');
console.log('PORT (env):', process.env.PORT);
console.log('PORT (default):', process.env.PORT || 9080);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Database URL:', process.env.DATABASE_URL ? 'Configurado' : 'No configurado');

console.log('\n📡 URLs de prueba:');
console.log('- Servidor:', `http://localhost:${process.env.PORT || 9080}`);
console.log('- API IVR:', `http://localhost:${process.env.PORT || 9080}/api/ivr`);
console.log('- Health Check:', `http://localhost:${process.env.PORT || 9080}/api/ivr/health`);

console.log('\n💡 Comandos sugeridos:');
console.log('- Iniciar servidor: npm start');
console.log('- Prueba rápida: node quick-test.js');
console.log('- Prueba completa: node test-ivr.js (requiere servidor activo)');

// Verificar si hay algún servidor ejecutándose
const axios = require('axios');

async function checkPorts() {
  const portsToCheck = [3000, 8000, 9080, 5000];
  
  console.log('\n🔍 Verificando puertos...');
  
  for (const port of portsToCheck) {
    try {
      const response = await axios.get(`http://localhost:${port}`, { timeout: 1000 });
      console.log(`✅ Puerto ${port}: Servidor activo -`, response.data?.message || 'Respuesta OK');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.log(`❌ Puerto ${port}: Sin servidor`);
      } else {
        console.log(`⚠️ Puerto ${port}: Error -`, error.message);
      }
    }
  }
}

checkPorts();