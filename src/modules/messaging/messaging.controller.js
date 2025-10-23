const messagingService = require('./messaging.service');
const xlsx = require('xlsx');
const path = require('path');

const sendCampaignController = async (req, res) => {
  try {
    // Si viene archivo Excel (req.file), procesar Excel
    if (req.file) {
      console.log('Archivo Excel recibido para envío de SMS');
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const clients = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  console.log('Contactos extraídos del Excel:', clients);
  if (!clients || clients.length === 0) {
        return res.status(400).json({ error: 'No se encontraron clientes en el archivo Excel.' });
      }

      // Obtener mensaje base y url pública del formulario
      const { message, publicUrl } = req.body;
  console.log('Mensaje recibido:', message);
  if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Debes proporcionar un mensaje.' });
      }
  console.log('URL pública recibida:', publicUrl);
  if (!publicUrl || typeof publicUrl !== 'string') {
        return res.status(400).json({ error: 'Debes proporcionar la URL pública del formulario.' });
      }

      // Función para limpiar y formatear números
      const formatNumber = (num) => {
        let clean = String(num).replace(/\D/g, "");
        if (!clean.startsWith("51")) clean = "51" + clean;
        return "+" + clean;
      };

  const sendingPromises = clients.map(client => {
        const name = client.Nombre || '';
        let recipient = client.Numero || client.Telefono || '';
        recipient = formatNumber(recipient);
        // Personalizar mensaje: reemplazar {nombre} y {url} si existen
        let personalizedMsg = message.replace(/\{nombre\}/gi, name).replace(/\{url\}/gi, publicUrl);
        console.log('Enviando SMS a:', recipient, 'Mensaje:', personalizedMsg);
        return messagingService.sendSms({
          recipient,
          messageBody: personalizedMsg,
        }).then(resp => {
          console.log('Respuesta de la API de SMS:', resp);
          return resp;
        }).catch(err => {
          console.error('Error al enviar SMS:', err);
          throw err;
        });
      });

      await Promise.all(sendingPromises);
        const results = await Promise.all(sendingPromises);
        let sentCount = 0;
        let details = [];
        results.forEach(resp => {
          if (resp && Array.isArray(resp.Data)) {
            resp.Data.forEach(item => {
              if (item.MessageErrorCode === 0) sentCount++;
              details.push({
                MobileNumber: item.MobileNumber,
                status: item.MessageErrorDescription
              });
            });
          }
        });
        return res.status(200).json({
          message: `Campaña enviada exitosamente`,
          sentCount,
          details
        });
    }

    // Si no hay archivo, usar números y mensaje del body
    const { numbers, message, publicUrl } = req.body;
    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return res.status(400).json({ error: 'Debes proporcionar al menos un número.' });
    }
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Debes proporcionar un mensaje.' });
    }
    // Un solo envío con todos los números juntos
    const formatNumber = (num) => {
      let clean = String(num).replace(/\D/g, "");
      if (!clean.startsWith("51")) clean = "51" + clean;
      return clean;
    };
    const formattedNumbers = numbers.map(formatNumber);
    const mobileNumbersStr = formattedNumbers.join(",");
    let personalizedMsg = message;
    if (publicUrl) personalizedMsg = personalizedMsg.replace(/\{url\}/gi, publicUrl);
    try {
      const resp = await messagingService.sendSms({
        mobileNumbers: mobileNumbersStr,
        messageBody: personalizedMsg
      });
      let sentCount = 0;
      let details = [];
      if (resp && Array.isArray(resp.Data)) {
        resp.Data.forEach(item => {
          if (item.MessageErrorCode === 0) sentCount++;
          details.push({
            MobileNumber: item.MobileNumber,
            status: item.MessageErrorDescription
          });
        });
      }
      res.status(200).json({
        message: `Campaña enviada exitosamente`,
        sentCount,
        details
      });
    } catch (error) {
      console.error("Error en sendCampaignController:", error);
      res.status(500).json({ error: 'Ocurrió un error al enviar la campaña.', details: error.message });
    }
  } catch (error) {
    console.error("Error en sendCampaignController:", error);
    res.status(500).json({ error: 'Ocurrió un error al enviar la campaña.', details: error.message });
  }
};

const getSentMessagesController = async (req, res) => {
  try {0
    const { fromdate, enddate, page, pagesize } = req.query;
    const result = await messagingService.getSentMessages({ fromDate: fromdate, endDate: enddate, page: Number(page) || 1, pageSize: Number(pagesize) || 100 });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error in getSentMessagesController:', error && (error.message || (error.response && error.response.status)));
    // Si está habilitado el mock, devolver un set de datos de ejemplo para desarrollo
    const useMock = process.env.MOCK_SMS_SENT === 'true' || process.env.USE_MOCK_SMS_SENT === 'true';
    if (useMock) {
      console.warn('MOCK_SMS_SENT habilitado: devolviendo datos de ejemplo para mensajes enviados.');
      const sample = {
        Data: [
          {
            MobileNumber: '51923190931',
            SenderId: process.env.SMS_SENDER_ID || '19022422',
            Message: 'Responde esta encuesta: https://value-cx.com/forms/nuevo-5fb0b03c-2520-4200-a947-1994903901e0',
            Date: new Date().toISOString(),
            DeliveredAt: new Date().toISOString(),
            MessageErrorDescription: 'DELIVRD',
            MessageErrorCode: 0
          },
          {
            MobileNumber: '51987654321',
            SenderId: process.env.SMS_SENDER_ID || '19022422',
            Message: 'Gracias por tu compra. Tu pedido #12345 está en camino.',
            Date: new Date().toISOString(),
            DeliveredAt: new Date().toISOString(),
            MessageErrorDescription: 'DELIVRD',
            MessageErrorCode: 0
          }
        ]
      };
      return res.status(200).json({ success: true, data: sample });
    }

    // Si no mockeamos, devolver un 502 con mensaje claro para el frontend
    res.status(502).json({ success: false, message: 'No se pudo obtener la lista de mensajes desde el proveedor de SMS.', details: error && (error.message || (error.response && error.response.statusText)) });
  }
};

module.exports = {
  sendCampaignController,
  getSentMessagesController,
};