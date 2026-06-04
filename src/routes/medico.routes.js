import express from 'express';
import medicoController from '../controllers/medico.controller.js';
import { authMiddleware, authorize } from '../middlewares/authMiddleware.js';
import {  createValidation,  updateValidation,  idValidation} from '../middlewares/validations/medico.validation.js';
import { transformToMedicoDTO } from '../middlewares/transform.dto.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Médicos v1
 *   description: Endpoints para gestión de médicos
 */

/**
 * @swagger
 * /medicos:
 *   get:
 *     summary: Obtener todos los médicos
 *     tags: [Médicos v1]
 *     responses:
 *       200:
 *         description: Lista de médicos
 *
 *   post:
 *     summary: Crear un nuevo médico
 *     tags: [Médicos v1]
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
 *         description: Médico creado exitosamente
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /medicos/{id}:
 *   get:
 *     summary: Obtener médico por ID
 *     tags: [Médicos v1]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Médico encontrado
 *       404:
 *         description: Médico no encontrado
 *
 *   put:
 *     summary: Actualizar médico
 *     tags: [Médicos v1]
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
 *         description: Médico actualizado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Médico no encontrado
 *
 *   delete:
 *     summary: Eliminar médico
 *     tags: [Médicos v1]
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
 *         description: Médico eliminado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Médico no encontrado
 */


router.get('/', medicoController.getAll);
router.get('/:id', idValidation, medicoController.getById);


router.post('/', authMiddleware, authorize(3), createValidation, transformToMedicoDTO, medicoController.create);
router.put('/:id', authMiddleware, authorize(3), updateValidation, transformToMedicoDTO, medicoController.update);
router.delete('/:id', authMiddleware, authorize(3), idValidation, medicoController.delete);

export default router;