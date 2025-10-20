const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// --- 1. Define your helper functions first ---
const loadAndRegisterRoutes = (path, filePath) => {
    try {
        const router = require(filePath);
        app.use(path, router);
    } catch (error) {
        console.error(`ERROR: No se pudieron cargar las rutas para: ${path}`);
        console.error(`   En el archivo: ${filePath}`);
        console.error('   Razón:', error.message);
    }
};

// --- 2. Configure middleware ---
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

// --- 3. Define basic routes ---
app.get('/', (req, res) => {
    res.json({ message: 'Value365 Backend API' });
});

// --- 4. Call your function to register all module routes ---
loadAndRegisterRoutes('/api/auth', './modules/auth/auth.routes');
loadAndRegisterRoutes('/api/media', './modules/media/media.routes');
loadAndRegisterRoutes('/api/users', './modules/users/users.routes');
loadAndRegisterRoutes('/api/messaging', './modules/messaging/messaging.routes');
loadAndRegisterRoutes('/api/v1/templates', './modules/templates/templates.routes');
loadAndRegisterRoutes('/api/campaigns', './modules/campaigns/campaigns.routes');
// Registrar rutas v2 para campañas y SMS
loadAndRegisterRoutes('/api', './modules/campaigns/campaigns.routes');
// Registrar endpoint absoluto para SMS
loadAndRegisterRoutes('/api/v2', './modules/campaigns/sms.routes');
loadAndRegisterRoutes('/api/v1/campaigns/:campaignId/forms', './modules/forms/forms.routes');

loadAndRegisterRoutes('/api/v1/forms/:formId/questions', './modules/questions/questions.routes');
// Registrar rutas de grupos
loadAndRegisterRoutes('/api/groups', './modules/groups/groups.routes');
// Registrar rutas de contactos
loadAndRegisterRoutes('/api/contacts', './modules/contacts/contacts.routes');


// --- 5. Add final middleware (like error handlers) ---
// Registrar rutas de formularios bajo /forms para acceso directo
loadAndRegisterRoutes('/forms', './modules/forms/forms.routes');
app.use(errorHandler);

// --- 6. Export the app ---
module.exports = app;