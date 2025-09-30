const usersService = require('./users.service');

const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'No se encontró el ID de usuario en el token.'
            });
        }

        const user = await usersService.findUserById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado.'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        next(error);
    }
};

const getUserEmpresas = async (req, res, next) => {
    try {
        const userId = req.user.user_id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'No se encontró el ID de usuario en el token.'
            });
        }

        const empresas = await usersService.findEmpresasByUserId(userId);

        res.status(200).json({
            success: true,
            count: empresas.length,
            data: empresas
        });

    } catch (error) {
        next(error);
    }
};

const createUserWithEmpresas = async (req, res, next) => {
    try {
        const { email, role_id, nombre, apellido, username, empresaIds } = req.body;

        if (!email || !role_id || !nombre || !apellido || !username || !empresaIds) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios, incluyendo empresaIds.'
            });
        }

        const userId = await usersService.createUserWithEmpresas({
            email,
            role_id,
            nombre,
            apellido,
            username
        }, empresaIds);

        res.status(201).json({
            success: true,
            message: 'Usuario creado con éxito.',
            userId
        });
    } catch (error) {
        next(error);
    }
};

const assignEmpresasToUser = async (req, res, next) => {
    try {
        const { userId, empresaIds } = req.body;

        if (!userId || !empresaIds) {
            return res.status(400).json({
                success: false,
                message: 'userId y empresaIds son obligatorios.'
            });
        }

        await usersService.assignEmpresasToUser(userId, empresaIds);

        res.status(200).json({
            success: true,
            message: 'Empresas asignadas con éxito.'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    getUserEmpresas,
    createUserWithEmpresas,
    assignEmpresasToUser
};
