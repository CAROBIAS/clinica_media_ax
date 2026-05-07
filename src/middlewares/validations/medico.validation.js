import { body, param, validationResult } from 'express-validator';
import { pool } from '../../config/db.js';

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errors.array() });
  }
  next();
};

export const createValidation = [
  body('idUsuario').isInt({ min: 1 }).withMessage('Usuario inválido'),
  body('idEspecialidad')
    .isInt({ min: 1 })
    .withMessage('Especialidad inválida')
    .custom(async (value) => {
      const [rows] = await pool.execute('SELECT id_especialidad FROM especialidades WHERE id_especialidad = ? AND activo = 1', [value]);
      if (rows.length === 0) throw new Error('Especialidad no existe o está inactiva');
      return true;
    }),
  body('matricula').isInt({ min: 1 }).withMessage('Matrícula inválida'),
  body('valorConsulta').isDecimal({ decimal_digits: '0,2' }).withMessage('Valor inválido'),
  body('descripcion').optional().isString(),
  validateResult
];

export const updateValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  body('idUsuario').optional().isInt({ min: 1 }).withMessage('Usuario inválido'),
  body('idEspecialidad')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Especialidad inválida')
    .custom(async (value) => {
      const [rows] = await pool.execute('SELECT id_especialidad FROM especialidades WHERE id_especialidad = ? AND activo = 1', [value]);
      if (rows.length === 0) throw new Error('Especialidad no existe o está inactiva');
      return true;
    }),
  body('matricula').optional().isInt({ min: 1 }).withMessage('Matrícula inválida'),
  body('valorConsulta').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Valor inválido'),
  body('descripcion').optional().isString(),
  validateResult
];

export const idValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  validateResult
];