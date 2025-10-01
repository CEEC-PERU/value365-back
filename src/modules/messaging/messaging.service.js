const axios = require('axios');

const sendSms = async ({ recipient, messageBody }) => {
  const payload = {
    recipient,
    messageBody,
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