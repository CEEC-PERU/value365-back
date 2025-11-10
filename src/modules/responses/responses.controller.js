const responsesService = require('./responses.service');

const submitResponse = async (req, res) => {
  try {
    const { form_id, session_id, answers } = req.body;
    
    if (!form_id || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios',
        details: 'Se requiere: form_id (number), answers (array), session_id (string, opcional)'
      });
    }

    const savedResponse = await responsesService.saveResponse({
      form_id,
      session_id: session_id || `session_${Date.now()}`,
      answers,
    });
    
    res.status(201).json({ 
      success: true,
      message: '¡Gracias por tu respuesta!', 
      data: { form_response_id: savedResponse }
    });
  } catch (error) {
    console.error('Error al guardar respuesta:', error);
    res.status(500).json({ 
      error: 'Hubo un error al procesar tu respuesta.',
      details: error.message
    });
  }
};
const getResponsesByFormId = async (req, res) => {
  try {
    const { formId } = req.params;
    if (!formId) {
      return res.status(400).json({ error: 'Falta el ID del formulario.' });
    }
    const responses = await responsesService.getResponsesByFormId(formId);
    res.status(200).json({ success: true, data: responses });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuestas.' });
  }
};

module.exports = {
  submitResponse,
  getResponsesByFormId,
};