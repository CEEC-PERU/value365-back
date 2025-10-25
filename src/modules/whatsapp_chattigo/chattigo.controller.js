const chattigoService = require('./chattigo.service');

async function sendCampaign(req, res) {
  try {
    const { did, namespace, template_name, destinations } = req.body;
    if (!did || !namespace || !template_name || !Array.isArray(destinations)) {
      return res.status(400).json({ success: false, message: 'Faltan datos requeridos.' });
    }
    const result = await chattigoService.sendBulkMessage({ did, namespace, template_name, destinations });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/whatsapp/webhook (verificación)
function webhookVerify(req, res) {
  // Chattigo/Meta puede requerir challenge
  const challenge = req.query['hub.challenge'];
  if (challenge) return res.send(challenge);
  res.send('OK');
}

// POST /api/whatsapp/webhook (eventos)
function webhookReceive(req, res) {

    console.log('Webhook recibido:', req.body);
  res.sendStatus(200);
}

module.exports = {
  sendCampaign,
  webhookVerify,
  webhookReceive
};
