const messagingService = require('./messaging.service');

const sendSmsController = async (req, res) => {
  try {
    const { recipient, messageBody, programmedDate, flashMessage } = req.body;

    if (!recipient || !messageBody) {
      return res.status(400).json({ error: 'Los campos "recipient" y "messageBody" son obligatorios.' });
    }
    
    const result = await messagingService.sendSms({
      recipient,
      messageBody,
      programmedDate,
      flashMessage,
    });

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendSmsController,
};