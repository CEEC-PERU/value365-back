const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

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

try {
    const authRoutes = require('./modules/auth/auth.routes');
    app.use('/api/auth', authRoutes);

    const mediaRoutes = require('./modules/media/media.routes');
    app.use('/api/media', mediaRoutes);

    const userRoutes = require('./modules/users/users.routes');
    app.use('/api/users', userRoutes);

    const messagingRoutes = require('./modules/messaging/messaging.routes');
    app.use('/api/messaging', messagingRoutes);

    const templatesRoutes = require('./modules/templates/templates.routes');
    app.use('/api/v1/templates', templatesRoutes);

    const campaignsRoutes = require('./modules/campaigns/campaigns.routes');
    app.use('/api/v1/campaigns', campaignsRoutes);
    
    
    const formRoutes = require('./modules/forms/forms.routes');
    app.use('/api/v1/forms', formRoutes);
    app.use('/api/v1/campaigns/:campaignId/forms', formRoutes);


    const questionRoutes = require('./modules/questions/questions.routes');
    app.use('/api/v1/forms/:formId/questions', questionRoutes);
    

} catch (error) {
    console.error(error.message);
}

app.use(errorHandler);

module.exports = app;

