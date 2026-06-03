import express from 'express';
import { updateObraSocial, getAllPacientes } from '../controllers/paciente.controller.js';
import { authMiddleware, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: Endpoints para gestión de pacientes
 */

/**
 * @swagger
 * /api/v2/pacientes:
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
 * /api/v2/pacientes/{id}/obra-social:
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
router.put('/pacientes/:id/obra-social', authMiddleware, authorize(3), updateObraSocial);

export default router;