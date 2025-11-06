const twilio = require('twilio');

const VoicebotController = {
  async iniciarLlamada(req, res, next) {
    try {
      const { numeroDestino, surveyId } = req.body;
      if (!numeroDestino) {
        return res.status(400).json({ success: false, error: 'Falta el número de destino.' });
      }
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      const call = await client.calls.create({
        to: numeroDestino,
        from: process.env.TWILIO_PHONE_NUMBER,
        url: `${process.env.BASE_URL}/api/voicebot/webhook?surveyId=${surveyId || ''}`
      });
      res.json({ success: true, callSid: call.sid });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async handleWebhook(req, res, next) {
    try {
      // Primer paso: pregunta al usuario si quiere encuesta o hablar con operador
      const { Digits, SpeechResult } = req.body;
      let twiml = '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n';

      if (!Digits && !SpeechResult) {
        // Primer mensaje
        twiml += '  <Gather numDigits="1" timeout="7" action="/api/voicebot/webhook">\n';
        twiml += '    <Say language="es-ES">Bienvenido. Marque 1 para responder encuesta, 2 para hablar con un operador. O diga "operador" para transferir.</Say>\n';
        twiml += '  </Gather>\n';
        twiml += '</Response>';
        return res.type('text/xml').send(twiml);
      }

      // Procesa la respuesta del usuario
      const input = Digits || (SpeechResult ? SpeechResult.toLowerCase() : '');
      if (input === '1') {
        // Flujo de encuesta
        twiml += '  <Gather numDigits="1" timeout="7" action="/api/voicebot/webhook">\n';
        twiml += '    <Say language="es-ES">¿Cuál es su nivel de satisfacción del 1 al 5?</Say>\n';
        twiml += '  </Gather>\n';
        twiml += '</Response>';
        return res.type('text/xml').send(twiml);
      } else if (input === '2' || input.includes('operador')) {
        // Transferencia a operador
        twiml += '  <Say language="es-ES">Un momento, lo transferimos a un operador.</Say>\n';
        twiml += '  <Dial timeout="30">+51999999999</Dial>\n'; // Reemplaza por el número real del operador
        twiml += '</Response>';
        return res.type('text/xml').send(twiml);
      } else if (['1','2','3','4','5'].includes(input)) {
        // Respuesta de encuesta
        twiml += `  <Say language="es-ES">Gracias por su respuesta: ${input}. ¡Hasta luego!</Say>\n`;
        twiml += '  <Hangup/>\n';
        twiml += '</Response>';
        return res.type('text/xml').send(twiml);
      } else {
        // Opción no válida
        twiml += '  <Say language="es-ES">Opción no válida. Intente nuevamente.</Say>\n';
        twiml += '  <Redirect>/api/voicebot/webhook</Redirect>\n';
        twiml += '</Response>';
        return res.type('text/xml').send(twiml);
      }
    } catch (error) {
      next(error);
    }
  }
};

module.exports = VoicebotController;
