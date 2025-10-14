// messaging.service.js

const axios = require('axios');

const sendSms = async ({ recipient, messageBody }) => {
  // Construimos el cuerpo del POST según la documentación [cite: 931, 937, 939, 941, 942, 945]
  const payload = {
    ApiKey: process.env.SMS_API_KEY,
    ClientId: process.env.SMS_CLIENT_ID,
    SenderId: process.env.SMS_SENDER_ID,
    Message: messageBody,
    MobileNumbers: recipient.replace('+', ''), // La API parece esperar números sin el '+'
    Is_Unicode: false, // Opcional 
    Is_Flash: false,   // Opcional 
  };

  try {
    // La autenticación va en el cuerpo, no en los headers [cite: 931, 955]
    const response = await axios.post(
      process.env.SMS_API_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log(`SMS enviado a ${recipient}:`, response.data);
    return response.data;

  } catch (error) {
    // Manejo de errores mejorado para ver la respuesta de la API
    const errorMessage = error.response 
      ? JSON.stringify(error.response.data) 
      : error.message;

    console.error(`Error al enviar SMS a ${recipient}:`, errorMessage);
    throw new Error(`El servicio de SMS no está disponible para ${recipient}.`);
  }
};

module.exports = {
  sendSms,
};