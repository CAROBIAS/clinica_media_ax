const express = require('express');
const router = express.Router();

const {
  getTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno,
  marcarAtendido,
  estadisticasTurnos,
  reportePDF
} = require('../controllers/turnos.controller');

const { validarTurno, validarId } = require('../middlewares/turnos.validator');
const { validationResult } = require('express-validator');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

//  Middleware valida errores
const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

// GET todos los turnos (usuario logueado)
router.get(
  '/',
  verifyToken,
  getTurnos
);

// GET turno por ID
router.get(
  '/:id',
  verifyToken,
  validarId,
  validarCampos,
  getTurnoById
);

// POST crear turno (admin / recepcionista)
router.post(
  '/',
  verifyToken,
  checkRole('admin', 'recepcionista'),
  validarTurno,
  validarCampos,
  createTurno
);

// PUT actualizar turno (admin)
router.put(
  '/:id',
  verifyToken,
  checkRole('admin'),
  validarId,
  validarCampos,
  updateTurno
);

//  DELETE lógico (admin)
router.delete(
  '/:id',
  verifyToken,
  checkRole('admin'),
  validarId,
  validarCampos,
  deleteTurno
);

// MARCAR COMO  ATENDIDO (médico)
router.put(
  '/atendido/:id',
  verifyToken,
  checkRole('medico'),
  validarId,
  validarCampos,
  marcarAtendido
);

// ESTADÍSTICAS (admin)

router.get(
  '/estadisticas/resumen',
  verifyToken,
  checkRole('admin'),
  estadisticasTurnos
);

// REPORTE PDF (admin)
router.get(
  '/reporte',
  verifyToken,
  checkRole('admin'),
  reportePDF
);

module.exports = router;
