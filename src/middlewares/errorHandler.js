// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    ok: false,
    status,
    message: err.message || 'Error interno del servidor',
    data: null,
  });
};

module.exports = errorHandler;