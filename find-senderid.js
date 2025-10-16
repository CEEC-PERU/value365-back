// find-senderid.js
require('dotenv').config();
const axios = require('axios');

async function findMySenderIds() {
  console.log('Buscando tus Sender IDs aprobados en la plataforma...');

  // La URL base es la misma, pero la ruta cambia a /api/v2/SenderId
  const apiUrl = process.env.SMS_API_URL.replace('/api/v2/SendSMS', '/api/v2/SenderId');

  const params = {
    ApiKey: process.env.SMS_API_KEY,
    ClientId: process.env.SMS_CLIENT_ID,
  };

  try {
    const response = await axios.get(apiUrl, { params });

    console.log('\n✅ ¡ÉXITO! El servidor respondió:');
    
    if (response.data.ErrorCode === 0 && response.data.Data.length > 0) {
      console.log('Esta es tu lista de Sender IDs disponibles:');
      console.log(JSON.stringify(response.data.Data, null, 2));
      console.log('\nUsa uno de los valores del campo "Sender-Id" en tu archivo .env');
    } else if (response.data.Data.length === 0) {
      console.log('⚠️ No se encontraron Sender IDs registrados en tu cuenta.');
    } else {
      console.log('La API devolvió una respuesta inesperada:', response.data);
    }

  } catch (error) {
    console.error('\n❌ ERROR: La petición para obtener Sender IDs falló.');
    if (error.response) {
      console.error('Respuesta del servidor:', JSON.stringify(error.response.data, null, 2));
      console.error('Código de estado:', error.response.status);
    } else {
      console.error('Detalles del error:', error.message);
    }
  }
}

findMySenderIds();