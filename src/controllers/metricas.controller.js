import { obtenerMetricas } from '../services/metricasService.js';
import { obtenerDatosReporte, generarPdfMetricas } from '../services/reporteService.js';

export const reporteMetricasPDF = async (req, res, next) => {
  try {
    const [datosReporte, metricas] = await Promise.all([
      obtenerDatosReporte(),
      obtenerMetricas(),
    ]);

    generarPdfMetricas({ ...datosReporte, metricas }, res);
  } catch (error) {
    next(error);
  }
};