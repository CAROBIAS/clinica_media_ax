import express from 'express';
import medicoController from '../controllers/medico.controller.js';
import { authMiddleware, authorize } from '../middlewares/authMiddleware.js';
import {
  createValidation,
  updateValidation,
  idValidation
} from '../middlewares/validations/medico.validation.js';
import { transformToMedicoDTO } from '../middlewares/transform.dto.js';

const router = express.Router();

/**
 * @swagger
 * /api/medicos:
 *   get:
 *     summary: Obtener todos los médicos
 *     tags: [Médicos]
 *     responses:
 *       200:
 *         description: Lista de médicos
 *   post:
 *     summary: Crear un nuevo médico
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Médico creado exitosamente
 */


router.get('/', medicoController.getAll);
router.get('/:id', idValidation, medicoController.getById);


router.post('/', authMiddleware, authorize(3), createValidation, transformToMedicoDTO, medicoController.create);
router.put('/:id', authMiddleware, authorize(3), updateValidation, transformToMedicoDTO, medicoController.update);
router.delete('/:id', authMiddleware, authorize(3), idValidation, medicoController.delete);

export default router;