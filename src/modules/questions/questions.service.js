const pool = require('../../config/db');
const QuestionModel = require('./questions.model');
const QuestionOptionsModel = require('../question_options/question_options.model');
const createError = require('http-errors');

const QuestionService = {
    createQuestion: async (formId, questionData) => {
        const client = await pool.connect();
        try {

            questionData.form_id = formId;
            const questionCount = await QuestionModel.countByFormId(formId, client);
            questionData.posicion_orden = questionCount + 1;

            if (!questionData.configuraciones) questionData.configuraciones = {};
            if (!questionData.validaciones) questionData.validaciones = {};

            const options = questionData.options;
            delete questionData.options;

            const newQuestion = await QuestionModel.create(questionData, client);

            let createdOptions = [];
            if (options && Array.isArray(options) && options.length > 0) {
                createdOptions = await QuestionOptionsModel.bulkCreate(newQuestion.id, options, client);
            }

            return { ...newQuestion, options: createdOptions };

        } catch (error) {
            console.error(error);
            throw createError(500, 'No se pudo crear la pregunta en la base de datos.');
        } finally {
            client.release();
        }
    },

    async getQuestionsByForm(formId) {
        return QuestionModel.findByFormId(formId);
    },

    async updateQuestion(id, dataToUpdate) {
        const question = await QuestionModel.findById(id);
        if (!question) {
            throw createError(404, 'Pregunta no encontrada.');
        }
        return QuestionModel.update(id, dataToUpdate);
    },

    async deleteQuestion(id) {
        const deletedQuestion = await QuestionModel.delete(id);
        if (!deletedQuestion) {
            throw createError(404, 'Pregunta no encontrada.');
        }
        return deletedQuestion;
    }
};

module.exports = QuestionService;

