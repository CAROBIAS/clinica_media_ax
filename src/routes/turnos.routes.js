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
 * tags:
 *   name: Turnos
 *   description: Gestión de turnos médicos
 */

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
 *
 *   post:
 *     summary: Crear un nuevo turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Turno creado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

router.get('/', authMiddleware, getTurnos);

router.post(
  '/',
  authMiddleware,
  authorize(2, 3),
  validarTurno,
  validarCampos,
  createTurno
);

/**
 * @swagger
 * /api/turnos/estadisticas/resumen:
 *   get:
 *     summary: Obtener estadísticas generales de turnos
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen estadístico
 *       401:
 *         description: No autorizado
 */

router.get(
  '/estadisticas/resumen',
  authMiddleware,
  authorize(3),
  estadisticasTurnos
);

/**
 * @swagger
 * /api/turnos/reporte/estadisticas:
 *   get:
 *     summary: Descargar reporte PDF con estadísticas
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

router.get(
  '/reporte/estadisticas',
  authMiddleware,
  authorize(3),
  reportePDF
);

/**
 * @swagger
 * /api/turnos/atendido/{id}:
 *   put:
 *     summary: Marcar turno como atendido
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno marcado como atendido
 *       404:
 *         description: Turno no encontrado
 */

router.put(
  '/atendido/:id',
  authMiddleware,
  authorize(1),
  validarId,
  validarCampos,
  marcarAtendido
);

/**
 * @swagger
 * /api/turnos/{id}:
 *   get:
 *     summary: Obtener turno por ID
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno encontrado
 *       404:
 *         description: Turno no encontrado
 *
 *   put:
 *     summary: Actualizar un turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Turno actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Turno no encontrado
 *
 *   delete:
 *     summary: Eliminar un turno
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno eliminado
 *       404:
 *         description: Turno no encontrado
 */

router.get(
  '/:id',
  authMiddleware,
  validarId,
  validarCampos,
  getTurnoById
);

router.put(
  '/:id',
  authMiddleware,
  authorize(3),
  validarId,
  validarCampos,
  updateTurno
);

router.delete(
  '/:id',
  authMiddleware,
  authorize(3),
  validarId,
  validarCampos,
  deleteTurno
);

export default router;