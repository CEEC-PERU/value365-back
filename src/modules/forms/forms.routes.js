const express = require('express');
const router = express.Router({ mergeParams: true });
const formsController = require('./forms.controller');
const jwtMiddleware = require('../auth/jwt.middleware');

router.use(jwtMiddleware);

router.route('/')
    .post(formsController.createForm)
    .get(formsController.getFormsByCampaign);

router.route('/id/:id')
    .get(formsController.getFormById)
    .put(formsController.updateForm)
    .delete(formsController.deleteForm);

router.route('/slug/:slug')
    .get(formsController.getFormBySlug);

router.post('/', async (req, res) => {
    try {
        const formData = req.body;
        const newForm = await formsController.addForm(formData);
        res.status(201).json({ message: 'Formulario creado con éxito', data: newForm });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el formulario', error: error.message });
    }
});

module.exports = router;
