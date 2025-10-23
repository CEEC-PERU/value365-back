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
        console.error(`   En el archivo: ${filePath}`);
        console.error('   Razón:', error.message);
    }
};

// --- 2. Configure middleware ---
const allowedOrigins = [
    'https://encuestas-olive.vercel.app',
    'http://localhost:3000',
    'https://main.d3n0qdnme5u0gx.amplifyapp.com/',
    'https://value-cx.com',
    'https://www.value-cx.com'
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
// Ruta pública para formularios (sin autenticación)
loadAndRegisterRoutes('/api/forms', './modules/forms/forms.routes');
loadAndRegisterRoutes('/api/v1/campaigns/:campaignId/forms', './modules/forms/forms.routes');
loadAndRegisterRoutes('/api/v1/forms/:formId/questions', './modules/questions/questions.routes');


// --- WEBHOOKS DE WHATSAPP ---

// ESTE CÓDIGO ES PARA QUE META VERIFIQUE TU URL (SOLO SE USA UNA VEZ)
app.get('/webhook', (req, res) => {
    // Lee el token secreto desde tu archivo .env
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

    // Parsea los parámetros que Meta te envía
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Revisa si el modo y el token son correctos
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            // Si todo está bien, responde con el 'challenge'
            console.log('✅ ¡WEBHOOK VERIFICADO POR META!');
            res.status(200).send(challenge);
        } else {
            // Si el token no coincide, rechaza
            console.log('❌ WEBHOOK RECHAZADO: Token incorrecto.');
            res.sendStatus(403);
        }
    }
});

// ESTE CÓDIGO ES PARA RECIBIR LOS MENSAJES DE TUS CLIENTES
app.post('/webhook', (req, res) => {
    let body = req.body;

    // Imprime el mensaje recibido en tu consola
    console.log('MENSAJE DE WHATSAPP RECIBIDO:', JSON.stringify(body, null, 2));

    // Aquí puedes agregar la lógica para guardar el mensaje en tu base de datos
    
    // Responde 200 OK para que Meta sepa que lo recibiste
    res.sendStatus(200);
});

// --- FIN DE WEBHOOKS DE WHATSAPP ---

// --- 5. Add final middleware (like error handlers) ---
app.use(errorHandler);

// --- 6. Export the app ---
module.exports = app;