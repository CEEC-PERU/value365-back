const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error:', err.message);

  if (err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      message: 'Origen no permitido por CORS',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
