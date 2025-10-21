const responsesService = require('./responses.service');

const submitResponse = async (req, res) => {
  try {
    const { surveyId, recipient, answers } = req.body;
    if (!surveyId || !recipient || !answers) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para la respuesta.' });
    }
    const savedResponse = await responsesService.saveResponse({
      surveyId,
      recipient,
      answers,
    });
    res.status(201).json({ message: '¡Gracias por tu respuesta!', data: savedResponse });
  } catch (error) {
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
    res.status(200).json({ success: true, data: responses });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuestas.' });
  }
};

module.exports = {
  submitResponse,
  getResponsesByFormId,
};