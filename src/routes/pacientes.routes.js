import express from 'express';
import { updateObraSocial, getAllPacientes } from '../controllers/paciente.controller.js';
import { authMiddleware, authorize } from '../middlewares/authMiddleware.js';
// Fix segun feedback de la segunda entrega, se importa la validacion de obra social
import { actualizarObraSocialValidation } from '../middlewares/validations/paciente.validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pacientes v2
 *   description: Endpoints para gestión de pacientes
 */

/**
 * @swagger
 * /pacientes:
 *   get:
 *     summary: Obtener todos los pacientes (Admin)
 *     tags: [Pacientes v2]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes
 *       403:
 *         description: No autorizado
 */
router.get('/pacientes', authMiddleware, authorize(3), getAllPacientes);

/**
 * @swagger
 * /pacientes/{id}/obra-social:
 *   put:
 *     summary: Asignar obra social a un paciente (Admin)
 *     tags: [Pacientes v2]
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
 *             properties:
 *               id_obra_social:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Obra social actualizada
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Paciente u obra social no encontrados
 */

// Fix segun feedback de la segunda entrega, se agrega la validacion de obra social

router.put( '/pacientes/:id/obra-social', authMiddleware, authorize(3), actualizarObraSocialValidation, updateObraSocial );

export default router;