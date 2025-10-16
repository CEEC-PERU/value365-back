// test-sms.js
require('dotenv').config();
const axios = require('axios');

// --- CONFIGURA TU PRUEBA AQUÍ ---
const recipientNumber = '51923190931'; // 👈 Reemplaza con tu número de celular (código de país + número)
const messageText = 'Esta es una prueba final desde mi app Node.js.';
// ---------------------------------

async function sendTestSms() {
  console.log('Iniciando prueba de envío de SMS...');

  const payload = {
    ApiKey: process.env.SMS_API_KEY,
    ClientId: process.env.SMS_CLIENT_ID,
    Senderld: process.env.SMS_SENDER_ID,
    Message: messageText,
    MobileNumbers: recipientNumber,
    Is_Unicode: false,
    Is_Flash: false,
  };

  console.log('Enviando el siguiente payload a la API:');
  console.log(JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(process.env.SMS_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('\n✅ ¡ÉXITO! El servidor de la API respondió:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.ErrorCode === 0) {
      console.log('\n🎉 ¡Felicitaciones! La API aceptó el mensaje para envío.');
    } else {
      console.log('\n⚠️ ATENCIÓN: La API aceptó la petición pero devolvió un código de error.');
    }

  } catch (error) {
    console.error('\n❌ ERROR: La petición a la API falló.');
    if (error.response) {
      console.error('Respuesta del servidor:', JSON.stringify(error.response.data, null, 2));
      console.error('Código de estado:', error.response.status);
    } else {
      console.error('Detalles del error:', error.message);
    }
  }
}

sendTestSms();