const ContactsModel = require('./contacts.model');

const ContactsController = {
    async create(req, res, next) {
        try {
            const { name, mobile, email } = req.body;
            if (!name || !mobile) return res.status(400).json({ success: false, message: 'Nombre y móvil son obligatorios.' });
            const contact = await ContactsModel.create({ name, mobile, email });
            res.status(201).json({ success: true, data: contact });
        } catch (error) {
            next(error);
        }
    },

    async findAll(req, res, next) {
        try {
            const contacts = await ContactsModel.findAll();
            res.status(200).json({ success: true, data: contacts });
        } catch (error) {
            next(error);
        }
    },

    async findById(req, res, next) {
        try {
            const { id } = req.params;
            const contact = await ContactsModel.findById(id);
            if (!contact) return res.status(404).json({ success: false, message: 'Contacto no encontrado.' });
            res.status(200).json({ success: true, data: contact });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const contact = await ContactsModel.delete(id);
            res.status(200).json({ success: true, data: contact });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = ContactsController;
