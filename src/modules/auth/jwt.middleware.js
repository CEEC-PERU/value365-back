const jwt = require('jsonwebtoken');
const util = require('util');

const verifyAsync = util.promisify(jwt.verify);

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido.'
            });
        }

        const decoded = await verifyAsync(token, process.env.JWT_SECRET);

        req.user = decoded;
        
        next();

    } catch (error) {
        const authError = {
            status: 403,
            message: 'Token inválido o expirado.'
        };
        next(authError);
    }
};

module.exports = verifyToken;