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

router.get("/obras-sociales", getObras);
router.post("/obras-sociales", createObra);
router.put("/obras-sociales/:id", updateObra);
router.delete("/obras-sociales/:id", deleteObra);

router.post("/medicos/:id/obras-sociales", asignarObrasAMedico);
router.get("/turnos/:turno_id/validar-calculo", validarCalculoTurno);

export default router;
