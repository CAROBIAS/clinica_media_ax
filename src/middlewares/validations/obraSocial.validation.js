import { body, param, validationResult } from 'express-validator';

// Fix segun feedback de la segunda entrega, creadas validaciones de obras sociales

const validarResultados = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }
  next();
};

export const crearObraSocialValidation = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no debe superar los 100 caracteres')
    .trim()
    .customSanitizer(value => value.toUpperCase()),
  body('porcentaje_descuento')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('El descuento debe ser un número entre 0 y 100'),
  body('es_particular')
    .optional()
    .isBoolean().withMessage('es_particular debe ser booleano (true/false)'),
  validarResultados,
  body('descripcion')
  .optional()
  .isString()
  .isLength({ max: 255 }).withMessage('La descripción no debe superar los 255 caracteres'),
];

export const actualizarObraSocialValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no debe superar los 100 caracteres')
    .trim()
    .customSanitizer(value => value.toUpperCase()),
  body('porcentaje_descuento')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('El descuento debe ser un número entre 0 y 100'),
  body('es_particular')
    .optional()
    .isBoolean().withMessage('es_particular debe ser booleano (true/false)'),
  validarResultados,
  body('descripcion')
  .optional()
  .isString()
  .isLength({ max: 255 }).withMessage('La descripción no debe superar los 255 caracteres'),
];

export const idObraSocialValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  validarResultados
];

export const asignarObrasValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID de médico inválido'),
  body('obras_sociales')
    .isArray({ min: 1 }).withMessage('obras_sociales debe ser un array no vacío')
    .custom((value) => value.every(v => Number.isInteger(v) && v > 0))
    .withMessage('Cada ID de obra social debe ser un número entero positivo'),
  validarResultados
];

export const validarTurnoIdParam = [
  param('turno_id').isInt({ min: 1 }).withMessage('ID de turno inválido'),
  validarResultados
];