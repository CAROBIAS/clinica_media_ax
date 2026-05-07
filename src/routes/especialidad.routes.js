import express from 'express';
import especialidadController from '../controllers/especialidad.controller.js';
import { authMiddleware, authorize } from '../middlewares/authMiddleware.js';
import {
  crearEspecialidadValidation,
  actualizarEspecialidadValidation,
  idEspecialidadValidation
} from '../middlewares/validations/especialidad.validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Especialidades
 *   description: Endpoints para gestión de especialidades
 */

/**
 * @swagger
 * /api/especialidades:
 *   get:
 *     summary: Obtener todas las especialidades
 *     tags: [Especialidades]
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *
 *   post:
 *     summary: Crear una nueva especialidad
 *     tags: [Especialidades]
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
 *         description: Especialidad creada exitosamente
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/especialidades/{id}:
 *   get:
 *     summary: Obtener especialidad por ID
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Especialidad encontrada
 *       404:
 *         description: Especialidad no encontrada
 *
 *   put:
 *     summary: Actualizar especialidad
 *     tags: [Especialidades]
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
 *         description: Especialidad actualizada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Especialidad no encontrada
 *
 *   delete:
 *     summary: Eliminar especialidad
 *     tags: [Especialidades]
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
 *         description: Especialidad eliminada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Especialidad no encontrada
 */


router.get('/', especialidadController.getAll);
router.get('/:id', idEspecialidadValidation, especialidadController.getById);


router.post('/', authMiddleware, authorize(3), crearEspecialidadValidation, especialidadController.create);
router.put('/:id', authMiddleware, authorize(3), actualizarEspecialidadValidation, especialidadController.update);
router.delete('/:id', authMiddleware, authorize(3), idEspecialidadValidation, especialidadController.delete);

export default router;