// messaging.service.js

const axios = require('axios');
const SmsSentModel = require('./sms_sent.model');

const sendSms = async ({ recipient, messageBody, campaign_id = null, form_id = null }) => {
  const senderId = process.env.SMS_SENDER_ID ? process.env.SMS_SENDER_ID.replace(/"/g, "") : undefined;
  const apiKey = process.env.SMS_API_KEY ? process.env.SMS_API_KEY.replace(/"/g, "") : undefined;
  const clientId = process.env.SMS_CLIENT_ID ? process.env.SMS_CLIENT_ID.replace(/"/g, "") : undefined;
  let mobileNumber = recipient.startsWith('+') ? recipient.slice(1) : recipient;
  const payload = {
    ApiKey: apiKey,
    ClientId: clientId,
    SenderId: senderId,
    MobileNumbers: mobileNumber,
    Message: messageBody,
    Is_Unicode: false,
    Is_Flash: false,
  };

  let estado = 'pendiente';
  let errorMsg = null;
  let smsRecord = null;
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
    estado = 'enviado';
    smsRecord = await SmsSentModel.create({
      numero: recipient,
      mensaje: messageBody,
      estado,
      error: null,
      campaña_id: campaign_id,
      form_id: form_id,
      fecha_envio: new Date(),
    });
    console.log(`SMS enviado a ${recipient}:`, response.data);
    return response.data;
  } catch (error) {
    estado = 'fallido';
    errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    smsRecord = await SmsSentModel.create({
      numero: recipient,
      mensaje: messageBody,
      estado,
      error: errorMsg,
      campaña_id: campaign_id,
      form_id: form_id,
      fecha_envio: new Date(),
    });
    console.error(`Error al enviar SMS a ${recipient}:`, errorMsg);
    throw new Error(`El servicio de SMS no está disponible para ${recipient}.`);
  }
};

module.exports = {
  sendSms,
};