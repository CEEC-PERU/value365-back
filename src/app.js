const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// --- Configuración de CORS y Middlewares ---
const allowedOrigins = [
    'https://encuestas-olive.vercel.app',
    'http://localhost:3000',
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('No permitido por CORS'));
    },
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'modules/uploads')));

app.get('/', (req, res) => {
    res.json({ message: 'Value365 Backend API' });
});

// --- Carga Segura de Rutas ---
// Esta función intenta cargar una ruta y avisa si falla.
const loadAndRegisterRoutes = (path, filePath) => {
    try {
        const router = require(filePath);
        app.use(path, router);
        // console.log(`✅ Rutas cargadas exitosamente para: ${path}`);
    } catch (error) {
        console.error(`❌ ERROR: No se pudieron cargar las rutas para: ${path}`);
        console.error(`   En el archivo: ${filePath}`);
        console.error('   Razón:', error.message);
        // Opcional: Detener el servidor si una ruta crítica falla
        // process.exit(1); 
    }
};

loadAndRegisterRoutes('/api/auth', './modules/auth/auth.routes');
loadAndRegisterRoutes('/api/media', './modules/media/media.routes');
loadAndRegisterRoutes('/api/users', './modules/users/users.routes');
loadAndRegisterRoutes('/api/messaging', './modules/messaging/messaging.routes');
loadAndRegisterRoutes('/api/v1/templates', './modules/templates/templates.routes');
loadAndRegisterRoutes('/api/campaigns', './modules/campaigns/campaigns.routes'); // Ahora sabrás si esta o una anterior falla
loadAndRegisterRoutes('/api/v1/forms', './modules/forms/forms.routes');
loadAndRegisterRoutes('/api/v1/campaigns/:campaignId/forms', './modules/forms/forms.routes');
loadAndRegisterRoutes('/api/v1/forms/:formId/questions', './modules/questions/questions.routes');

// --- Manejador de Errores Global ---
app.use(errorHandler);

module.exports = app;