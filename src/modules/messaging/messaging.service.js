// messaging.service.js

const axios = require('axios');

const sendSms = async ({ mobileNumbers, messageBody }) => {
  const apiKey = process.env.SMS_API_KEY ? process.env.SMS_API_KEY.replace(/"/g, "") : undefined;
  const clientId = process.env.SMS_CLIENT_ID ? process.env.SMS_CLIENT_ID.replace(/"/g, "") : undefined;
  const senderIdFinal = process.env.SMS_SENDER_ID ? process.env.SMS_SENDER_ID.replace(/"/g, "") : undefined;
  const payload = {
    ApiKey: apiKey,
    ClientId: clientId,
    SenderId: senderIdFinal,
    Message: messageBody,
    MobileNumbers: mobileNumbers,
    Is_Unicode: false,
    Is_Flash: false
  };

  try {
    const response = await axios.post(
      process.env.SMS_API_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`SMS enviado:`, response.data);
    return response.data;
  } catch (error) {
    const errorMessage = error.response 
      ? JSON.stringify(error.response.data) 
      : error.message;
    console.error(`Error al enviar SMS:`, errorMessage);
    throw new Error(`El servicio de SMS no está disponible.`);
  }
};

module.exports = {
  sendSms,
};