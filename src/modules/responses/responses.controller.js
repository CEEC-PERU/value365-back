const responsesService = require('./responses.service');

const submitResponse = async (req, res) => {
  try {
    console.log('POST /api/responses recibido:', req.body);
    const { form_id, session_id, answers } = req.body;
    if (!form_id || !session_id || !answers) {
      console.log('❌ Datos incompletos:', req.body);
      return res.status(400).json({ error: 'Faltan campos obligatorios para la respuesta.' });
    }
    const savedResponse = await responsesService.saveResponse({
      form_id,
      session_id,
      answers,
    });
    console.log('✅ Respuesta guardada con ID:', savedResponse);
    res.status(201).json({ message: '¡Gracias por tu respuesta!', data: savedResponse });
  } catch (error) {
    console.error('❌ Error al guardar respuesta:', error);
    res.status(500).json({ error: 'Hubo un error al procesar tu respuesta.' });
  }
};
const getResponsesByFormId = async (req, res) => {
  try {
    const { formId } = req.params;
    if (!formId) {
      return res.status(400).json({ error: 'Falta el ID del formulario.' });
    }
    const responses = await responsesService.getResponsesByFormId(formId);
    // Formato esperado por el frontend: [{ session_id, preguntas: [{ tipo, pregunta, respuesta }] }]
    res.status(200).json({ success: true, data: responses });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuestas.' });
  }
};

const getResponsesBySessionId = async (req, res) => {
  try {
    const { formId, sessionId } = req.params;
    console.log('GET /api/responses/form/:formId/session/:sessionId', { formId, sessionId });
    const details = await responsesService.getResponsesBySessionId(formId, sessionId);
    res.status(200).json({ success: true, data: details });
  } catch (error) {
    console.error('❌ Error en getResponsesBySessionId:', error);
    res.status(500).json({ error: 'Error al obtener detalles.', detalle: error.message });
  }
};

module.exports = {
  submitResponse,
  getResponsesByFormId,
  getResponsesBySessionId,
};