import { body, param } from 'express-validator';

export const validarTurno = [
  body('id_medico')
    .notEmpty().withMessage('id_medico es obligatorio')
    .isInt().withMessage('id_medico debe ser número'),

  body('id_paciente')
    .notEmpty().withMessage('id_paciente es obligatorio')
    .isInt().withMessage('id_paciente debe ser número'),

  body('id_obra_social')
    .optional()
    .isInt().withMessage('id_obra_social debe ser número'),

  body('fecha_hora')
    .notEmpty().withMessage('fecha_hora es obligatoria')
    .isISO8601().withMessage('fecha_hora debe ser una fecha válida'),

  body('valor_total')
    .optional()
    .isDecimal().withMessage('valor_total debe ser decimal')
];

export const validarId = [
  param('id')
    .notEmpty().withMessage('ID requerido')
    .isInt().withMessage('El ID debe ser un número')
];