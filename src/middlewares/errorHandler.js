const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error:', err); 

  const statusCode = err.status || 500;
  let message = err.message || 'Error interno del servidor';

  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Ha ocurrido un error inesperado en el servidor.';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = errorHandler;