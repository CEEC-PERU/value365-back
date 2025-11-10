const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const loadAndRegisterRoutes = (path, filePath) => {
    try {
        const router = require(filePath);
        app.use(path, router);
        console.log(`✅ Ruta registrada: ${path} -> ${filePath}`);
    } catch (error) {
        console.error(`❌ ERROR: No se pudieron cargar las rutas para: ${path}`);
        console.error(`   En el archivo: ${filePath}`);
        console.error('   Razón:', error.message);
    }
};

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

app.get('/', (req, res) => {
    res.json({ message: 'Value365 Backend API' });
});

loadAndRegisterRoutes('/api/auth', './modules/auth/auth.routes');
loadAndRegisterRoutes('/api/voicebot', './modules/voicebot/voicebot.routes');
loadAndRegisterRoutes('/api/ivr', './modules/ivr/ivr.routes');
loadAndRegisterRoutes('/api/media', './modules/media/media.routes');
loadAndRegisterRoutes('/api/users', './modules/users/users.routes');
loadAndRegisterRoutes('/api/messaging', './modules/messaging/messaging.routes');
loadAndRegisterRoutes('/api/v1/templates', './modules/templates/templates.routes');
loadAndRegisterRoutes('/api/campaigns', './modules/campaigns/campaigns.routes');
loadAndRegisterRoutes('/api/responses', './modules/responses/responses.routes');
loadAndRegisterRoutes('/api/forms', './modules/forms/forms.routes');
loadAndRegisterRoutes('/api/v1/campaigns/:campaignId/forms', './modules/forms/forms.routes');
loadAndRegisterRoutes('/api/v1/forms/:formId/questions', './modules/questions/questions.routes');
loadAndRegisterRoutes('/api/whatsapp', './modules/whatsapp_chattigo/chattigo.routes');



app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('✅ ¡WEBHOOK VERIFICADO POR META!');
            res.status(200).send(challenge);
        } else {
            console.log('❌ WEBHOOK RECHAZADO: Token incorrecto.');
            res.sendStatus(403);
        }
    }
});

app.post('/webhook', (req, res) => {
    let body = req.body;

    console.log('MENSAJE DE WHATSAPP RECIBIDO:', JSON.stringify(body, null, 2));

    
    res.sendStatus(200);
});

// --- FIN DE WEBHOOKS DE WHATSAPP ---

// --- 5. Add final middleware (like error handlers) ---
app.use(errorHandler);

// --- 6. Export the app ---
module.exports = app;