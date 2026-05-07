import PDFDocument from 'pdfkit';

export const generarPdfEstadisticas = (estadisticas, res) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-estadisticas-clinica.pdf');

    doc.pipe(res);

    doc.fontSize(20).text('CLÍNICA MÉDICA AX', { align: 'center', b: true });
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

    doc.moveDown(4);
    doc.fontSize(10).fillColor('gray').text(
        `Reporte generado automáticamente el ${new Date().toLocaleDateString()}`,
        50, 700, { align: 'center' }
    );

    doc.end();
};