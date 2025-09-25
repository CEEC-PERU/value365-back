const QuestionService = require('./questions.service');

const createQuestion = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        // El body contendrá: titulo, descripcion, es_obligatorio, question_type_id, etc.
        const newQuestion = await QuestionService.createQuestion(campaignId, req.body);
        res.status(201).json({ success: true, data: newQuestion });
    } catch (error) {
        next(error);
    }
};

const getQuestionsByCampaign = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const questions = await QuestionService.getQuestionsByCampaign(campaignId);
        res.status(200).json({ success: true, data: questions });
    } catch (error) {
        next(error);
    }
};

const updateQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedQuestion = await QuestionService.updateQuestion(id, req.body);
        res.status(200).json({ success: true, data: updatedQuestion });
    } catch (error) {
        next(error);
    }
};

const deleteQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;
        await QuestionService.deleteQuestion(id);
        res.status(200).json({ success: true, message: 'Pregunta eliminada exitosamente.' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createQuestion,
    getQuestionsByCampaign,
    updateQuestion,
    deleteQuestion,
};