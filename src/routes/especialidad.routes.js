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
 * /api/especialidades:
 *   get:
 *     summary: Obtener todas las especialidades activas
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *       401:
 *         description: No autorizado
 */


router.get('/', especialidadController.getAll);
router.get('/:id', idEspecialidadValidation, especialidadController.getById);


router.post('/', authMiddleware, authorize(3), crearEspecialidadValidation, especialidadController.create);
router.put('/:id', authMiddleware, authorize(3), actualizarEspecialidadValidation, especialidadController.update);
router.delete('/:id', authMiddleware, authorize(3), idEspecialidadValidation, especialidadController.delete);

export default router;