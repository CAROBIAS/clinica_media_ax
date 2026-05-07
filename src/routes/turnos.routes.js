import express from 'express';
import {
  getTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno,
  marcarAtendido,
  estadisticasTurnos,
  reportePDF
} from '../controllers/turnos.controller.js';

import { validarTurno, validarId } from '../middlewares/turnos.validator.js';
import { validationResult } from 'express-validator';
import { authMiddleware, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

/**
 * @swagger
 * /api/turnos:
 *   get:
 *     summary: Obtener todos los turnos activos
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos
 *       401:
 *         description: No autorizado
 */


router.get('/', authMiddleware, getTurnos);


router.get('/:id', authMiddleware, validarId, validarCampos, getTurnoById);


router.post('/', authMiddleware, authorize(2, 3), validarTurno, validarCampos, createTurno);


router.put('/:id', authMiddleware, authorize(3), validarId, validarCampos, updateTurno);


router.delete('/:id', authMiddleware, authorize(3), validarId, validarCampos, deleteTurno);


router.put('/atendido/:id', authMiddleware, authorize(1), validarId, validarCampos, marcarAtendido);


router.get('/estadisticas/resumen', authMiddleware, authorize(3), estadisticasTurnos);


/**
 * @swagger
 * /api/turnos/reporte/estadisticas:
 *   get:
 *     summary: Descargar reporte PDF con estadísticas de la clínica
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo PDF generado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */

router.get('/reporte/estadisticas', authMiddleware, authorize(3), reportePDF);

export default router;