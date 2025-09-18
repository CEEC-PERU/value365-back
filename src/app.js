const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const app = express();


const allowedOrigins = [
  'https://encuestas-olive.vercel.app',
  'http://localhost:3000',
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log('🌐 Origin recibido:', origin); 
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const err = new Error('No permitido');
    err.status = 403;
    return callback(err);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Value365 Backend API' });
});

try {
  const authRoutes = require('./modules/auth/auth.routes');
  app.use('/api/auth', authRoutes);
} catch (error) {
  console.error('Error cargando authRoutes:', error.message);
}

try {
  const templatesRoutes = require('./modules/templates/templates.routes');
  app.use('/api/v1', templatesRoutes);
} catch (error) {
  console.error('Error cargando templatesRoutes:', error.message);
}

try {
  const campaignsRoutes = require('./modules/campaigns/campaigns.routes');
  app.use('/api/v1/campaigns', campaignsRoutes); 
} catch (error) {
  console.error('Error cargando campaignsRoutes:', error.message);
}

app.use(errorHandler);

module.exports = app;