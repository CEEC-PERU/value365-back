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
  console.log('Datos recibidos para envío manual:', { numbers, message, publicUrl });
    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return res.status(400).json({ error: 'Debes proporcionar al menos un número.' });
    }
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Debes proporcionar un mensaje.' });
    }

    // Función para limpiar y formatear números
    const formatNumber = (num) => {
      let clean = String(num).replace(/\D/g, "");
      if (!clean.startsWith("51")) clean = "51" + clean;
      return "+" + clean;
    };

  const sendingPromises = numbers.map(num => {
      const recipient = formatNumber(num);
      // Reemplazar {url} en el mensaje si existe
      let personalizedMsg = message;
      if (publicUrl) {
        personalizedMsg = personalizedMsg.replace(/\{url\}/gi, publicUrl);
      }
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
      res.status(200).json({
        message: `Campaña enviada exitosamente`,
        sentCount,
        details
      });
  } catch (error) {
    console.error("Error en sendCampaignController:", error);
    if (error.response) {
      // Error de la API de SMS
      console.error("Respuesta de la API de SMS:", error.response.data);
    }
    res.status(500).json({ error: 'Ocurrió un error al enviar la campaña.', details: error.message });
  }
};

module.exports = {
  sendCampaignController,
};