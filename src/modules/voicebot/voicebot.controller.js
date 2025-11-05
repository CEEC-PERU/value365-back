const VoicebotController = {
  async handleWebhook(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        message: 'Voicebot webhook - en desarrollo'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = VoicebotController;
