const express = require('express');
const router = express.Router();
const ContactsController = require('./contacts.controller');

router.get('/', ContactsController.findAll);
router.get('/:id', ContactsController.findById);
router.post('/', ContactsController.create);
router.delete('/:id', ContactsController.delete);

module.exports = router;
