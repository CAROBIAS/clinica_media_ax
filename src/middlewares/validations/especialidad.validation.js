import { body, param, validationResult } from 'express-validator';

const validarResultados = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }
  next();
};

export const crearEspecialidadValidation = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 120 }).withMessage('El nombre no debe superar los 120 caracteres')
    .trim()
    .customSanitizer(value => value.toUpperCase()),
  validarResultados
];

export const actualizarEspecialidadValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 120 }).withMessage('El nombre no debe superar los 120 caracteres')
    .trim()
    .customSanitizer(value => value.toUpperCase()),
  validarResultados
];

export const idEspecialidadValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  validarResultados
];