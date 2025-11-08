const { Vonage } = require('@vonage/server-sdk');
const fs = require('fs');
const path = require('path');

const VoicebotVonageController = {
  async iniciarLlamada(req, res, next) {
    try {
      const { numeroDestino, surveyId } = req.body;
      
      if (!numeroDestino) {
        return res.status(400).json({ 
          success: false, 
          error: 'Falta el número de destino.' 
        });
      }

      if (!process.env.VONAGE_API_KEY || !process.env.VONAGE_API_SECRET) {
        return res.status(500).json({ 
          success: false, 
          error: 'Credenciales de Vonage no configuradas' 
        });
      }

      // Leer private key desde archivo o variable de entorno
      let privateKey;
      if (process.env.VONAGE_PRIVATE_KEY_PATH) {
        const keyPath = path.join(__dirname, '../../..', process.env.VONAGE_PRIVATE_KEY_PATH);
        privateKey = fs.readFileSync(keyPath, 'utf8');
      } else if (process.env.VONAGE_PRIVATE_KEY) {
        privateKey = process.env.VONAGE_PRIVATE_KEY.replace(/\\n/g, '\n');
      } else {
        return res.status(500).json({ 
          success: false, 
          error: 'Private key de Vonage no configurado (usa VONAGE_PRIVATE_KEY o VONAGE_PRIVATE_KEY_PATH)' 
        });
      }

      const vonage = new Vonage({
        apiKey: process.env.VONAGE_API_KEY,
        apiSecret: process.env.VONAGE_API_SECRET,
        applicationId: process.env.VONAGE_APPLICATION_ID,
        privateKey: privateKey
      });

      const webhookBaseUrl = process.env.NGROK_URL || process.env.BASE_URL;

      const ncco = [
        {
          action: 'talk',
          text: 'Bienvenido. Presione 1 para responder la encuesta, presione 2 para hablar con un operador.',
          language: 'es-ES'
        },
        {
          action: 'input',
          eventUrl: [`${webhookBaseUrl}/api/voicebot/vonage-webhook?surveyId=${surveyId || ''}`],
          maxDigits: 1,
          timeOut: 7
        }
      ];

      const response = await vonage.voice.createOutboundCall({
        to: [{
          type: 'phone',
          number: numeroDestino
        }],
        from: {
          type: 'phone',
          number: process.env.VONAGE_PHONE_NUMBER
        },
        ncco: ncco
      });
      
      res.json({ 
        success: true, 
        callUuid: response.uuid,
        status: response.status
      });
    } catch (error) {
      console.error('Error al iniciar llamada con Vonage:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message,
        details: error.response?.data || 'UNKNOWN_ERROR'
      });
    }
  },

  async handleWebhook(req, res, next) {
    try {
      const { dtmf, speech } = req.body;
      const surveyId = req.query.surveyId;

      const webhookBaseUrl = process.env.NGROK_URL || process.env.BASE_URL;

      let ncco = [];

      if (!dtmf && !speech) {
        // Primera interacción
        ncco = [
          {
            action: 'talk',
            text: 'Bienvenido. Presione 1 para responder la encuesta, presione 2 para hablar con un operador.',
            language: 'es-ES'
          },
          {
            action: 'input',
            eventUrl: [`${webhookBaseUrl}/api/voicebot/vonage-webhook?surveyId=${surveyId}`],
            maxDigits: 1,
            timeOut: 7
          }
        ];
      } else {
        const input = dtmf || speech;

        if (input === '1') {
          // Flujo de encuesta
          ncco = [
            {
              action: 'talk',
              text: '¿Cuál es su nivel de satisfacción del 1 al 5?',
              language: 'es-ES'
            },
            {
              action: 'input',
              eventUrl: [`${webhookBaseUrl}/api/voicebot/vonage-webhook?surveyId=${surveyId}&step=satisfaction`],
              maxDigits: 1,
              timeOut: 7
            }
          ];
        } else if (input === '2') {
          // Transferir a operador
          ncco = [
            {
              action: 'talk',
              text: 'Un momento, lo transferimos a un operador.',
              language: 'es-ES'
            },
            {
              action: 'connect',
              endpoint: [{
                type: 'phone',
                number: process.env.OPERATOR_PHONE_NUMBER || '+51999999999'
              }],
              timeOut: 30
            }
          ];
        } else if (['1','2','3','4','5'].includes(input)) {
          // Guardar respuesta de satisfacción
          // Aquí puedes guardar en la BD
          ncco = [
            {
              action: 'talk',
              text: `Gracias por su respuesta: ${input}. ¡Hasta luego!`,
              language: 'es-ES'
            }
          ];
        } else {
          // Opción no válida
          ncco = [
            {
              action: 'talk',
              text: 'Opción no válida. Intente nuevamente.',
              language: 'es-ES'
            },
            {
              action: 'input',
              eventUrl: [`${webhookBaseUrl}/api/voicebot/vonage-webhook?surveyId=${surveyId}`],
              maxDigits: 1,
              timeOut: 7
            }
          ];
        }
      }

      res.json(ncco);
    } catch (error) {
      console.error('Error en webhook de Vonage:', error);
      res.json([
        {
          action: 'talk',
          text: 'Lo sentimos, ha ocurrido un error. Intente más tarde.',
          language: 'es-ES'
        }
      ]);
    }
  }
};

module.exports = VoicebotVonageController;
