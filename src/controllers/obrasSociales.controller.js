import obraSocialService from '../services/obraSocial.service.js';
import turnoService from '../services/turno.service.js';

// Fix segun feedback de la segunda entrega, se agregan los controladores de obra social y validacion de calculo de turno

export const getObras = async (req, res, next) => {
  try {
    const obras = await obraSocialService.listarTodas();
    res.json(obras);
  } catch (error) {
    next(error);
  }
};

export const createObra = async (req, res, next) => {
  try {
    const { nombre, porcentaje_descuento, es_particular } = req.body;
    const nueva = await obraSocialService.crear({
      nombre: nombre.trim().toUpperCase(),
      porcentaje_descuento: parseFloat(porcentaje_descuento) || 0,
      es_particular: es_particular ? 1 : 0,
    });
    res.status(201).json({ ok: true, data: nueva });
  } catch (error) {
    next(error);
  }
};

export const updateObra = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, porcentaje_descuento, es_particular } = req.body;
    const actualizada = await obraSocialService.actualizar(id, {
      nombre: nombre.trim().toUpperCase(),
      porcentaje_descuento: parseFloat(porcentaje_descuento) || 0,
      es_particular: es_particular ? 1 : 0,
    });
    res.json({ ok: true, data: actualizada });
  } catch (error) {
    next(error);
  }
};

export const deleteObra = async (req, res, next) => {
  try {
    const { id } = req.params;
    await obraSocialService.eliminar(id);
    res.json({ ok: true, message: 'Obra social eliminada' });
  } catch (error) {
    next(error);
  }
};

export const asignarObrasAMedico = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { obras_sociales } = req.body;
    if (!Array.isArray(obras_sociales) || obras_sociales.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de IDs de obras sociales' });
    }
    await obraSocialService.asignarAMedico(id, obras_sociales);
    res.json({ ok: true, message: 'Obras sociales asignadas correctamente' });
  } catch (error) {
    next(error);
  }
};

export const validarCalculoTurno = async (req, res, next) => {
  try {
    const { turno_id } = req.params;
    const resultado = await turnoService.validarCalculo(turno_id);
    if (!resultado.coincide) {
      return res.status(400).json({
        error: 'El cálculo NO coincide',
        calculado: resultado.calculado,
        valor_bd: resultado.guardado,
      });
    }
    res.json({ ok: true, mensaje: 'Cálculo correcto' });
  } catch (error) {
    next(error);
  }
};