import PDFDocument from 'pdfkit';
import { pool } from '../config/db.js';

export const obtenerDatosReporte = async () => {
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) as total FROM turnos_reservas WHERE activo = 1'
  );

  const [porObraSocial] = await pool.query(`
    SELECT os.nombre AS obra_social, COUNT(t.id_turno_reserva) AS cantidad
    FROM turnos_reservas t
    JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
    WHERE t.activo = 1
    GROUP BY os.id_obra_social
  `);

  const [porEspecialidad] = await pool.query(`
    SELECT e.nombre AS especialidad, COUNT(t.id_turno_reserva) AS cantidad
    FROM turnos_reservas t
    JOIN medicos m ON t.id_medico = m.id_medico
    JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    WHERE t.activo = 1
    GROUP BY e.id_especialidad
  `);

  return {
    totalTurnos: total,
    porObraSocial,
    porEspecialidad,
  };
};

export const generarPdfEstadisticas = (estadisticas, res) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=reporte-estadisticas-clinica.pdf');

  doc.pipe(res);

  doc.fontSize(20).text('CLÍNICA MÉDICA AX', { align: 'center' });
  doc.fontSize(12).fillColor('gray').text('Reporte Estadístico de Turnos', { align: 'center' });
  doc.moveDown(2);

  doc.rect(50, 100, 500, 2).fill('#2c3e50');
  doc.moveDown(2);

  doc.fontSize(16).fillColor('black').text('Resumen General', { underline: true });
  doc.fontSize(12).text(`Total de turnos registrados: ${estadisticas.totalTurnos}`);
  doc.moveDown();

  doc.fontSize(16).text('Turnos por Obra Social', { underline: true });
  estadisticas.porObraSocial.forEach(item => {
    doc.fontSize(12).text(`• ${item.obra_social}: ${item.cantidad} turnos`);
  });
  doc.moveDown();

  doc.fontSize(16).text('Turnos por Especialidad Médica', { underline: true });
  estadisticas.porEspecialidad.forEach(item => {
    doc.fontSize(12).text(`• ${item.especialidad}: ${item.cantidad} turnos`);
  });

  doc.moveDown(2);
  doc.fontSize(10).fillColor('gray').text(
    `Reporte generado automáticamente el ${new Date().toLocaleDateString()}`,
    { align: 'center' }
  );

  doc.end();
};

const formatearModa = (moda) => {
  if (moda.tipo === 'indeterminada') return `${moda.moda} (${moda.descripcion})`;
  if (moda.tipo === 'multiple') return `${moda.moda.join(', ')} (${moda.cantidad} turnos c/u)`;
  return `${moda.moda} (${moda.cantidad} turnos)`;
};

const escribirSeccionMetricas = (doc, titulo, seccion) => {
  doc.fontSize(14).fillColor('black').text(titulo, { underline: true });
  doc.moveDown(0.5);

  seccion.items.forEach(item => {
    doc.fontSize(11).text(`• ${item.nombre}: ${item.cantidad} turnos`);
  });

  doc.moveDown(0.5);
  doc.fontSize(11).text(`Media: ${seccion.media} turnos`);
  doc.fontSize(11).text(`Mediana: ${seccion.mediana} turnos`);
  doc.fontSize(11).text(`Moda: ${formatearModa(seccion.moda)}`);
  doc.moveDown();
};

export const generarPdfMetricas = (datos, res) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=reporte-metricas-clinica.pdf');

  doc.pipe(res);

  doc.fontSize(20).fillColor('black').text('CLÍNICA MÉDICA AX', { align: 'center' });
  doc.fontSize(12).fillColor('gray').text('Reporte Estadístico Completo', { align: 'center' });
  doc.moveDown(2);

  doc.rect(50, 100, 500, 2).fill('#2c3e50');
  doc.moveDown(2);

  doc.fontSize(16).fillColor('black').text('Resumen General', { underline: true });
  doc.fontSize(12).text(`Total de turnos registrados: ${datos.totalTurnos}`);
  doc.moveDown();

  doc.fontSize(16).text('Turnos por Obra Social', { underline: true });
  datos.porObraSocial.forEach(item => {
    doc.fontSize(12).text(`• ${item.obra_social}: ${item.cantidad} turnos`);
  });
  doc.moveDown();

  doc.fontSize(16).text('Turnos por Especialidad Médica', { underline: true });
  datos.porEspecialidad.forEach(item => {
    doc.fontSize(12).text(`• ${item.especialidad}: ${item.cantidad} turnos`);
  });

  doc.moveDown();
  doc.rect(50, doc.y, 500, 2).fill('#2c3e50');
  doc.moveDown(2);

  doc.fontSize(18).fillColor('black').text('Métricas Estadísticas', { align: 'center' });
  doc.moveDown();

  escribirSeccionMetricas(doc, 'Por Médico', datos.metricas.porMedico);
  escribirSeccionMetricas(doc, 'Por Especialidad', datos.metricas.porEspecialidad);
  escribirSeccionMetricas(doc, 'Por Obra Social', datos.metricas.porObraSocial);
  escribirSeccionMetricas(doc, 'Por Franja Horaria', datos.metricas.porFranja);

  doc.moveDown(2);
  doc.fontSize(10).fillColor('gray').text(
    `Reporte generado automáticamente el ${new Date().toLocaleDateString()}`,
    { align: 'center' }
  );

  doc.end();
};