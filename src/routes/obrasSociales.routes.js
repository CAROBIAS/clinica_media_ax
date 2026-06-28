import { Router } from "express";

import {  getObras,  createObra,  updateObra,  deleteObra,  asignarObrasAMedico,  validarCalculoTurno} from "../controllers/obrasSociales.controller.js";

import { authMiddleware, authorize } from "../middlewares/authMiddleware.js";
// Fix segun feedback de la segunda entrega, agregadas importaciones de validaciones de obras sociales y turnos
import { crearObraSocialValidation, actualizarObraSocialValidation, idObraSocialValidation, asignarObrasValidation, validarTurnoIdParam } from "../middlewares/validations/obraSocial.validation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Obras Sociales v1
 *   description: Gestión de obras sociales y validaciones
 */

/**
 * @swagger
 * /obras-sociales:
 *   get:
 *     summary: Obtener todas las obras sociales activas
 *     tags: [Obras Sociales v1]
 *     responses:
 *       200:
 *         description: Lista de obras sociales
 *
 *   post:
 *     summary: Crear una nueva obra social
 *     tags: [Obras Sociales v1]
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
 *         description: Obra social creada correctamente
 *       401:
 *         description: No autorizado
 */

// Fix segun feedback de la segunda entrega, agregadas validaciones de obras sociales y turnos

router.get("/obras-sociales", authMiddleware,  authorize(2, 3), getObras);

router.post('/obras-sociales', authMiddleware, authorize(3), crearObraSocialValidation, createObra);

/**
 * @swagger
 * /obras-sociales/{id}:
 *   put:
 *     summary: Actualizar una obra social
 *     tags: [Obras Sociales v1]
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
 *         description: Obra social actualizada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Obra social no encontrada
 *
 *   delete:
 *     summary: Eliminar una obra social
 *     tags: [Obras Sociales v1]
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
 *         description: Obra social eliminada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Obra social no encontrada
 */

// Fix segun feedback de la segunda entrega, agregadas validaciones de obras sociales y turnos

router.put('/obras-sociales/:id', authMiddleware, authorize(3), actualizarObraSocialValidation, updateObra);

router.delete('/obras-sociales/:id', authMiddleware, authorize(3), idObraSocialValidation, deleteObra);

/**
 * @swagger
 * /medicos/{id}/obras-sociales:
 *   post:
 *     summary: Asignar obras sociales a un médico
 *     tags: [Obras Sociales v1]
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
 *         description: Obras sociales asignadas correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Médico no encontrado
 */

// Fix segun feedback de la segunda entrega, agregadas validaciones de obras sociales y turnos

router.post('/medicos/:id/obras-sociales', authMiddleware, authorize(3), asignarObrasValidation, asignarObrasAMedico);

/**
 * @swagger
 * /turnos/{turno_id}/validar-calculo:
 *   get:
 *     summary: Validar cálculo de un turno
 *     tags: [Obras Sociales v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: turno_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Validación realizada correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Turno no encontrado
 */

// Fix segun feedback de la segunda entrega, agregadas validaciones de obras sociales y turnos

router.get('/turnos/:turno_id/validar-calculo', authMiddleware, validarTurnoIdParam, validarCalculoTurno);

export default router;