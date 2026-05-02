const express = require('express');
const router = express.Router();

const {
  getTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno
} = require('../controllers/turnos.controller');

const { body, param } = require('express-validator');

// GET
router.get('/turnos', getTurnos);

// GET  ID
router.get(
  '/turnos/:id',
  param('id').isInt().withMessage('El ID debe ser un número'),
  getTurnoById
);

// POST 
router.post(
  '/turnos',
  [
    body('id_medico').isInt().withMessage('id_medico debe ser número'),
    body('id_paciente').isInt().withMessage('id_paciente debe ser número'),
    body('id_obra_social').isInt().withMessage('id_obra_social debe ser número'),
    body('fecha_hora').notEmpty().withMessage('fecha_hora es obligatoria'),
    body('valor_total').isDecimal().withMessage('valor_total debe ser decimal')
  ],
  createTurno
);

// PUT
router.put(
  '/turnos/:id',
  [
    param('id').isInt().withMessage('El ID debe ser número'),
    body('id_medico').optional().isInt(),
    body('id_paciente').optional().isInt(),
    body('id_obra_social').optional().isInt(),
    body('fecha_hora').optional().notEmpty(),
    body('valor_total').optional().isDecimal()
  ],
  updateTurno
);

// DELETE
router.delete(
  '/turnos/:id',
  param('id').isInt().withMessage('El ID debe ser número'),
  deleteTurno
);

module.exports = router;
