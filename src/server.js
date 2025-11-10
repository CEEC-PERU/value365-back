const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 9080;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📋 API IVR disponible en http://localhost:${PORT}/api/ivr`);
  console.log(`✅ Servidor listo para recibir peticiones`);
});

module.exports = server;
