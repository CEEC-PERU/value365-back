const express = require('express');
const router = express.Router();
const GroupsController = require('./groups.controller');

router.get('/', GroupsController.findAll);
router.get('/:id', GroupsController.findById);
router.post('/', GroupsController.create);
router.put('/:id', GroupsController.update);
router.delete('/:id', GroupsController.delete);

const GroupContactsController = require('./groupContacts.controller');

// Endpoints para contactos de grupo
router.get('/:groupId/contacts', GroupContactsController.getContactsByGroup);
router.post('/:groupId/contacts', GroupContactsController.addContactToGroup);
router.delete('/:groupId/contacts', GroupContactsController.removeContactsFromGroup);

module.exports = router;
