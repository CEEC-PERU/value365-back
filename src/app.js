const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Value365 Backend API' });
});

console.log('Intentando cargar authRoutes...');

try {
  const authRoutes = require('./modules/auth/auth.routes');
  console.log('authRoutes cargado:', typeof authRoutes);
  app.use('/api/auth', authRoutes);
  console.log('Rutas auth registradas exitosamente');
} catch (error) {
  console.error('Error cargando authRoutes:', error.message);
}

module.exports = app;