const QuestionService = require('./questions.service');

const createQuestion = async (req, res, next) => {
    try {
        const { formId } = req.params;
        
        const newQuestion = await QuestionService.createQuestion(formId, req.body);
        
        res.status(201).json({ success: true, data: newQuestion });
    } catch (error) {
        next(error);
    }
};

const getQuestionsByForm = async (req, res, next) => {
    try {
        const { formId } = req.params;
        const questions = await QuestionService.getQuestionsByForm(formId);
        res.status(200).json({ success: true, count: questions.length, data: questions });
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
    getQuestionsByForm,
    updateQuestion,
    deleteQuestion,
};

