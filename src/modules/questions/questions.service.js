const QuestionModel = require('./questions.model');
const createError = require('http-errors');

const QuestionService = {
    createQuestion: async (campaignId, questionData) => {
        // Lógica para asignar el orden de la pregunta
        const questionCount = await QuestionModel.countByCampaignId(campaignId);
        questionData.posicion_orden = questionCount + 1;
        questionData.campaign_id = campaignId;

        // Aseguramos que los campos JSON existan
        if (!questionData.configuraciones) questionData.configuraciones = {};
        if (!questionData.validaciones) questionData.validaciones = {};

        return QuestionModel.create(questionData);
    },

    getQuestionsByCampaign: async (campaignId) => {
        return QuestionModel.findByCampaignId(campaignId);
    },

    updateQuestion: async (id, dataToUpdate) => {
        const question = await QuestionModel.findById(id);
        if (!question) {
            throw createError(404, 'Pregunta no encontrada.');
        }
        return QuestionModel.update(id, dataToUpdate);
    },

    deleteQuestion: async (id) => {
        const deletedQuestion = await QuestionModel.delete(id);
        if (!deletedQuestion) {
            throw createError(404, 'Pregunta no encontrada.');
        }
        return deletedQuestion;
    }
};

module.exports = QuestionService;