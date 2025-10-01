const jwt = require('jsonwebtoken');
const util = require('util');

// Convertimos jwt.verify a una función que devuelve promesas para poder usar async/await
const verifyAsync = util.promisify(jwt.verify);

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 

        if (!token) {
            // Si no hay token, enviamos un error 401
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido.'
            });
        }

        // Usamos await para esperar el resultado de la verificación.
        // Si el token es inválido, esto lanzará un error que será atrapado por el bloque catch.
        const decoded = await verifyAsync(token, process.env.JWT_SECRET);

        // Si la verificación es exitosa, añadimos los datos del usuario a la petición
        req.user = decoded;
        
        // Pasamos al siguiente middleware o controlador
        next();

    } catch (error) {
        // Si jwt.verify falla (token expirado, firma inválida, etc.), el error llega aquí.
        // Creamos un error estandarizado y se lo pasamos al manejador de errores global.
        const authError = {
            status: 403,
            message: 'Token inválido o expirado.'
        };
        console.error('Error en la verificación del token:', error.message); // Log para depurar
        next(authError); // Pasamos el error al siguiente manejador de errores (errorHandler.js)
    }
};

module.exports = verifyToken;