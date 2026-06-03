import { Router } from "express";

import {  getObras,  createObra,  updateObra,  deleteObra,  asignarObrasAMedico,  validarCalculoTurno} from "../controllers/obrasSociales.controller.js";

import { authMiddleware, authorize } from "../middlewares/authMiddleware.js";

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

router.get("/obras-sociales", getObras);

router.post(  "/obras-sociales",  authMiddleware,  authorize(3),  createObra);

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

router.put(  "/obras-sociales/:id",  authMiddleware,  authorize(3),  updateObra);

router.delete(  "/obras-sociales/:id",  authMiddleware,  authorize(3),  deleteObra);

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

router.post(  "/medicos/:id/obras-sociales",  authMiddleware,  authorize(3),  asignarObrasAMedico);

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

router.get(  "/turnos/:turno_id/validar-calculo",  authMiddleware,  validarCalculoTurno);

export default router;