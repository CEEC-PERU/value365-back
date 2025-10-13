// Archivo: test-email.js

// require('dotenv').config(); // <--- COMENTA O ELIMINA ESTA LÍNEA
const nodemailer = require('nodemailer');

console.log('--- Iniciando prueba de conexión DIRECTA ---');

const transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 465,
    secure: true,
    auth: {
        user: "admin@value-cx.com",
        pass: "PruebaValue3652025" // <-- ¡PON AQUÍ TU CONTRASEÑA SIMPLE!
    }
});

async function verificarConexion() {
    try {
        await transporter.verify();
        console.log('✅ ¡ÉXITO! La autenticación con datos en duro fue exitosa.');
    } catch (error) {
        console.error('❌ ¡FALLO! No se pudo autenticar. El error es:');
        console.error(error);
    }
}

verificarConexion();