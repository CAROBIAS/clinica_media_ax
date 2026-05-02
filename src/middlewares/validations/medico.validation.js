const { body, param, query } = require('express-validator');
const { validationResult } = require('express-validator');
const { pool } = require('../../config/db');

// Middleware que junta errores y responde 400 si hay
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }
  next();
};

// Validación para creación de médico, con validación de existencia y estado de especialidad
const createValidation = [
  body('id_usuario').isInt({ min: 1 }).withMessage('Usuario inválido'),
  body('id_especialidad')
    .isInt({ min: 1 })
    .withMessage('Especialidad inválida')
    .custom(async (value) => {
      const [rows] = await pool.execute('SELECT id_especialidad FROM especialidades WHERE id_especialidad = ? AND activo = 1', [value]);
      if (rows.length === 0) throw new Error('Especialidad no existe o está inactiva');
      return true;
    }),
  body('matricula').isInt({ min: 1 }).withMessage('Matrícula inválida'),
  body('valor_consulta').isDecimal({ decimal_digits: '0,2' }).withMessage('Valor inválido'),
  body('descripcion').optional().isString(),
  validateResult
];

// Validación para actualización de médico, con validación de existencia y estado de especialidad
const updateValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  body('id_usuario').optional().isInt({ min: 1 }).withMessage('Usuario inválido'),
  body('id_especialidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Especialidad inválida')
    .custom(async (value) => {
      const [rows] = await pool.execute('SELECT id_especialidad FROM especialidades WHERE id_especialidad = ? AND activo = 1', [value]);
      if (rows.length === 0) throw new Error('Especialidad no existe o está inactiva');
      return true;
    }),
  body('matricula').optional().isInt({ min: 1 }).withMessage('Matrícula inválida'),
  body('valor_consulta').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Valor inválido'),
  body('descripcion').optional().isString(),
  validateResult
];

// Validación para ID de médico
const idValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  validateResult
];

module.exports = { createValidation, updateValidation, idValidation };