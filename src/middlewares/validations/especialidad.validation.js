const { body, param } = require('express-validator');
const { validationResult } = require('express-validator');

// Middleware que junta errores y responde 400 si hay
const validarResultados = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }
  next();
};

// Nombre obligatorio, max 120 caracteres, trim y uppercase
const crearEspecialidadValidation = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 120 }).withMessage('El nombre no debe superar los 120 caracteres')
    .trim()
    .customSanitizer(value => value.toUpperCase()),
  validarResultados
];

// Id debe ser valido, nombre obligatorio, max 120 caracteres, trim y uppercase
const actualizarEspecialidadValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 120 }).withMessage('El nombre no debe superar los 120 caracteres')
    .trim()
    .customSanitizer(value => value.toUpperCase()),
  validarResultados
];

// Validación para Id
const idEspecialidadValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  validarResultados
];

module.exports = {
  crearEspecialidadValidation,
  actualizarEspecialidadValidation,
  idEspecialidadValidation
};