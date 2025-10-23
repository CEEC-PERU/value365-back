const GroupsModel = require('./groups.model');

const GroupsController = {
    async create(req, res, next) {
        try {
            console.log('Body recibido en createGroup:', req.body);
            const { name, type, optin_name } = req.body;
            if (!name) return res.status(400).json({ success: false, message: 'El nombre es obligatorio.' });
            const group = await GroupsModel.create({ name, type, optin_name });
            res.status(201).json({ success: true, data: group });
        } catch (error) {
            next(error);
        }
    },

    async findAll(req, res, next) {
        try {
            const groups = await GroupsModel.findAll();
            res.status(200).json({ success: true, data: groups });
        } catch (error) {
            next(error);
        }
    },

    async findById(req, res, next) {
        try {
            const { id } = req.params;
            const group = await GroupsModel.findById(id);
            if (!group) return res.status(404).json({ success: false, message: 'Grupo no encontrado.' });
            res.status(200).json({ success: true, data: group });
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, type, optin_name } = req.body;
            const group = await GroupsModel.update(id, { name, type, optin_name });
            res.status(200).json({ success: true, data: group });
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const group = await GroupsModel.delete(id);
            res.status(200).json({ success: true, data: group });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = GroupsController;
