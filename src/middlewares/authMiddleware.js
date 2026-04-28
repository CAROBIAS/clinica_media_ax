// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return next({ statusCode: 401, message: 'Token requerido' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next({ statusCode: 401, message: 'Token inválido o expirado' });
  }
};

const checkRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.rol)) {
    return next({ statusCode: 403, message: 'No tenés permisos para esto' });
  }
  next();
};

module.exports = { verifyToken, checkRole };