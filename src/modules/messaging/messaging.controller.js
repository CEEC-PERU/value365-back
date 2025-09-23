const messagingService = require('./messaging.service');
const xlsx = require('xlsx');
const path = require('path');

const sendCampaignController = async (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../../contacts.xlsx');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const clients = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!clients || clients.length === 0) {
      return res.status(400).json({ error: 'No se encontraron clientes en el archivo Excel.' });
    }

    const surveyId = req.body.surveyId || 'encuesta-default';

    const sendingPromises = clients.map(client => {
      const name = client.Nombre;
      let recipient = String(client.Numero);

      if (!recipient.startsWith('+')) {
        recipient = `+51${recipient}`;
      }

      const surveyUrl = `https://tu-plataforma.com/encuesta/${surveyId}?user=${recipient}`;
      const messageBody = `Hola ${name}, ayúdanos a mejorar respondiendo esta encuesta: ${surveyUrl}`;

      return messagingService.sendSms({
        recipient: recipient,
        messageBody: messageBody,
      });
    });

    await Promise.all(sendingPromises);

    res.status(200).json({ message: `Campaña enviada exitosamente a ${clients.length} clientes del archivo Excel.` });

  } catch (error) {
    console.error("Error en sendCampaignController:", error);
    res.status(500).json({ error: 'Ocurrió un error al leer el archivo o enviar la campaña.', details: error.message });
  }
};

module.exports = {
  sendCampaignController,
};