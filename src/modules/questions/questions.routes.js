const express = require('express');
const router = express.Router({ mergeParams: true });
const questionsController = require('./questions.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

router.use(jwtMiddleware);

router.route('/')
    .post(questionsController.createQuestion)
    .get(questionsController.getQuestionsByForm);

router.route('/:id')
    .put(questionsController.updateQuestion)
    .delete(questionsController.deleteQuestion);

module.exports = router;

