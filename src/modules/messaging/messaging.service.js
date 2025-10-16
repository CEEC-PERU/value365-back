const axios = require('axios');

const sendSms = async ({ recipient, messageBody }) => {
  const senderId = process.env.SMS_SENDER_ID ? process.env.SMS_SENDER_ID.replace(/"/g, "") : undefined;
  const apiKey = process.env.SMS_API_KEY ? process.env.SMS_API_KEY.replace(/"/g, "") : undefined;
  const clientId = process.env.SMS_CLIENT_ID ? process.env.SMS_CLIENT_ID.replace(/"/g, "") : undefined;
  // Quitar el + si existe
  let mobileNumber = recipient.startsWith('+') ? recipient.slice(1) : recipient;
  const payload = {
    ApiKey: apiKey,
    ClientId: clientId,
    SenderId: senderId,
    MobileNumbers: mobileNumber,
    Message: messageBody,
  };

  try {
    const response = await axios.post(
      process.env.SMS_API_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.SMS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al enviar SMS a ${recipient}:`, error.response ? error.response.data : error.message);
    throw new Error(`El servicio de SMS no está disponible para ${recipient}.`);
  }
};

module.exports = {
  sendSms,
};