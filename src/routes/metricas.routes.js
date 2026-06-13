import express from 'express';
import { reporteMetricasPDF } from '../controllers/metricas.controller.js';
import { authMiddleware, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Métricas v3
 *   description: Reporte estadístico completo con métricas de turnos
 */

/**
 * @swagger
 * /metricas/reporte:
 *   get:
 *     summary: Descargar reporte PDF completo con métricas estadísticas
 *     tags: [Métricas v3]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo PDF generado con estadísticas y métricas
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */

router.get('/metricas/reporte', authMiddleware, authorize(3), reporteMetricasPDF);

export default router;