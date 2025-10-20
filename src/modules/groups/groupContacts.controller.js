const GroupContactsModel = require('./groupContacts.model');
const ContactsModel = require('../contacts/contacts.model');

const GroupContactsController = {
    async getContactsByGroup(req, res, next) {
        try {
            const { groupId } = req.params;
            const contacts = await GroupContactsModel.getContactsByGroup(groupId);
            res.status(200).json({ success: true, data: contacts });
        } catch (error) {
            next(error);
        }
    },

    async addContactToGroup(req, res, next) {
        try {
            const { groupId } = req.params;
            const { name, mobile, email } = req.body;
            if (!name || !mobile) return res.status(400).json({ success: false, message: 'Nombre y móvil son obligatorios.' });
            // Crear contacto
            const contact = await ContactsModel.create({ name, mobile, email });
            // Asociar contacto al grupo
            await GroupContactsModel.addContactToGroup(groupId, contact.id);
            res.status(201).json({ success: true, data: contact });
        } catch (error) {
            next(error);
        }
    },

    async removeContactsFromGroup(req, res, next) {
        try {
            const { groupId } = req.params;
            const { contactIds } = req.body; // array de IDs
            if (!Array.isArray(contactIds) || contactIds.length === 0) return res.status(400).json({ success: false, message: 'Debes enviar un array de contactIds.' });
            await GroupContactsModel.removeContactsFromGroup(groupId, contactIds);
            res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = GroupContactsController;