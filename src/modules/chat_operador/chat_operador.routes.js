const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/chat-operador', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('DEBUG: message:', message);
        console.log('DEBUG: GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
        console.log('DEBUG: typeof GoogleGenerativeAI:', typeof GoogleGenerativeAI);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log('DEBUG: typeof genAI.getGenerativeModel:', typeof genAI.getGenerativeModel);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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

module.exports = router;
