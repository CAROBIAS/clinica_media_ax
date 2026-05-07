import { Router } from "express";
import {
  getObras,
  createObra,
  updateObra,
  deleteObra,
  asignarObrasAMedico,
  validarCalculoTurno
} from "../controllers/obrasSociales.controller.js";

const router = Router();

/**
 * @swagger
 * /api/obras-sociales:
 *   get:
 *     summary: Obtener todas las obras sociales activas
 *     tags: [Obras Sociales]
 *     responses:
 *       200:
 *         description: Lista de obras sociales
 *   post:
 *     summary: Crear nueva obra social
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Obra social creada
 */

router.get("/obras-sociales", getObras);
router.post("/obras-sociales", createObra);
router.put("/obras-sociales/:id", updateObra);
router.delete("/obras-sociales/:id", deleteObra);

router.post("/medicos/:id/obras-sociales", asignarObrasAMedico);
router.get("/turnos/:turno_id/validar-calculo", validarCalculoTurno);

export default router;