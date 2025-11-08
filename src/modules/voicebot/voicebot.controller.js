const twilio = require('twilio');

const VoicebotController = {
  async iniciarLlamada(req, res, next) {
    try {
      const { numeroDestino, surveyId } = req.body;
      
      if (!numeroDestino) {
        return res.status(400).json({ 
          success: false, 
          error: 'Falta el número de destino.' 
        });
      }

      if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        return res.status(500).json({ 
          success: false, 
          error: 'Credenciales de Twilio no configuradas (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)' 
        });
      }

      if (!process.env.TWILIO_PHONE_NUMBER) {
        return res.status(500).json({ 
          success: false, 
          error: 'Número de teléfono de Twilio no configurado (TWILIO_PHONE_NUMBER)' 
        });
      }

      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      const webhookBaseUrl = process.env.NGROK_URL || process.env.BASE_URL;
      
      const call = await client.calls.create({
        to: numeroDestino,
        from: process.env.TWILIO_PHONE_NUMBER,
        url: `${webhookBaseUrl}/api/voicebot/webhook?surveyId=${surveyId || ''}`
      });
      
      res.json({ 
        success: true, 
        callSid: call.sid,
        status: call.status
      });
    } catch (error) {
      console.error('Error al iniciar llamada:', error);
      
      let errorMessage = error.message;
      let errorDetails = error.code || 'UNKNOWN_ERROR';
      
      if (error.code === 21219) {
        errorMessage = 'El número de destino no está verificado. Para cuentas de prueba de Twilio, debes verificar los números antes de llamarlos.';
        errorDetails = {
          code: 21219,
          solution: 'Ve a https://console.twilio.com/us1/develop/phone-numbers/manage/verified para verificar el número',
          unverifiedNumber: req.body.numeroDestino
        };
      }
      
      res.status(500).json({ 
        success: false, 
        error: errorMessage,
        details: errorDetails
      });
    }
  },

  async handleWebhook(req, res, next) {
    try {
      // Primer paso: pregunta al usuario si quiere encuesta o hablar con operador
      const { Digits, SpeechResult } = req.body;
      let twiml = '<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n';

      if (!Digits && !SpeechResult) {
        // Primer mensaje (ya enviado en el create call, redirige al flujo)
        twiml += '  <Gather numDigits="1" timeout="7" action="/api/voicebot/webhook" language="es-MX" input="dtmf speech">\n';
        twiml += '    <Say voice="Polly.Mia" language="es-MX">Bienvenido. Marque 1 para responder encuesta, 2 para hablar con un operador.</Say>\n';
        twiml += '  </Gather>\n';
        twiml += '</Response>';
        return res.type('text/xml').send(twiml);
      }

      // Procesa la respuesta del usuario
      const input = Digits || (SpeechResult ? SpeechResult.toLowerCase() : '');
      if (input === '1') {
        // Flujo de encuesta
        twiml += '  <Gather numDigits="1" timeout="7" action="/api/voicebot/webhook" language="es-MX" input="dtmf">\n';
        twiml += '    <Say voice="Polly.Mia" language="es-MX">¿Cuál es su nivel de satisfacción del 1 al 5?</Say>\n';
        twiml += '  </Gather>\n';
        twiml += '</Response>';
        return res.type('text/xml').send(twiml);
      } else if (input === '2' || input.includes('operador')) {
        // Transferencia a operador
        twiml += '  <Say voice="Polly.Mia" language="es-MX">Un momento, lo transferimos a un operador.</Say>\n';
        twiml += '  <Dial timeout="30">+51999999999</Dial>\n';
        twiml += '</Response>';
        return res.type('text/xml').send(twiml);
      } else if (['1','2','3','4','5'].includes(input)) {
        // Respuesta de encuesta
        twiml += `  <Say voice="Polly.Mia" language="es-MX">Gracias por su respuesta: ${input}. ¡Hasta luego!</Say>\n`;
        twiml += '  <Hangup/>\n';
        twiml += '</Response>';
        return res.type('text/xml').send(twiml);
      } else {
        // Opción no válida
        twiml += '  <Say voice="Polly.Mia" language="es-MX">Opción no válida. Intente nuevamente.</Say>\n';
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
