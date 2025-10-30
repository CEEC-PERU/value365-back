const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const twilio = require('twilio');

// Diálogo libre operador
router.post('/chat-operador', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('DEBUG: message:', message);
        console.log('DEBUG: GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
        console.log('DEBUG: typeof GoogleGenerativeAI:', typeof GoogleGenerativeAI);
        if (!message) return res.status(400).json({ success: false, error: 'Falta el mensaje.' });
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('DEBUG: typeof genAI.getGenerativeModel:', typeof genAI.getGenerativeModel);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
        const systemPrompt = `Eres un Asistente de Plataforma para encuestas y gestión de contactos. Responde preguntas sobre contactos, estadísticas y tareas pendientes de forma clara y útil.`;
        const result = await model.generateContent({ contents: [
            { role: 'system', parts: [{ text: systemPrompt }] },
            { role: 'user', parts: [{ text: message }] }
        ] });
        const respuesta = result?.response?.text || 'No se pudo obtener respuesta.';
        res.json({ success: true, respuesta });
    } catch (error) {
        console.error('ERROR chat-operador:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Llamada saliente
router.post('/iniciar-llamada', async (req, res) => {
    try {
        const { numeroDestino, surveyId } = req.body;
        if (!numeroDestino || !surveyId) return res.status(400).json({ success: false, error: 'Faltan datos.' });
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const call = await client.calls.create({
            to: numeroDestino,
            from: process.env.TWILIO_PHONE_NUMBER,
            url: `${process.env.PUBLIC_URL}/api/voicebot/twiml/iniciar-encuesta?surveyId=${surveyId}`
        });
        res.json({ success: true, callSid: call.sid });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// TwiML: Inicio de encuesta
router.post('/twiml/iniciar-encuesta', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Gracias por participar. ¿Cuál es su nivel de satisfacción del 1 al 5?');
    twiml.gather({ action: '/api/voicebot/twiml/procesar-pregunta-1', input: 'speech dtmf', numDigits: 1 });
    res.type('text/xml');
    res.send(twiml.toString());
});

// TwiML: Procesar respuesta pregunta 1
router.post('/twiml/procesar-pregunta-1', async (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    const respuesta = req.body.SpeechResult || req.body.Digits;
    if (respuesta && ['1','2','3','4','5'].includes(respuesta)) {
        // Aquí podrías guardar la respuesta en la BD
        twiml.say('¿Por qué esa calificación?');
        twiml.gather({ action: '/api/voicebot/twiml/finalizar-encuesta', input: 'speech' });
    } else {
        twiml.say('No entendí. Por favor, solo diga un número del 1 al 5.');
        twiml.gather({ action: '/api/voicebot/twiml/procesar-pregunta-1', input: 'speech dtmf', numDigits: 1 });
    }
    res.type('text/xml');
    res.send(twiml.toString());
});

// TwiML: Finalizar encuesta
router.post('/twiml/finalizar-encuesta', (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('¡Gracias por participar!');
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
});

module.exports = router;
