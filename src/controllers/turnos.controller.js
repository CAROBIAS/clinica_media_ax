import turnoService from '../services/turno.service.js';
import pacienteService from '../services/paciente.service.js';
import { generarPdfEstadisticas, obtenerDatosReporte } from '../services/reporteService.js';


// Fix segun feedback de la segunda entrega, se agregan los controladores de turno y validaciones

export const getTurnos = async (req, res, next) => {
  try {
    const user = req.user;
    const rol = user.rol;
    let filtros = {};

    if (rol === 1) {
      const idMedico = await turnoService.obtenerIdMedicoPorUsuario(user.id);
      if (!idMedico) {
        return res.status(403).json({ ok: false, message: 'Usuario no corresponde a un médico activo' });
      }
      filtros.idMedico = idMedico;
    } else if (rol === 2) {
      const idPaciente = await pacienteService.obtenerIdPacientePorUsuario(user.id);
      if (!idPaciente) {
        return res.status(403).json({ ok: false, message: 'Usuario no corresponde a un paciente activo' });
      }
      filtros.idPaciente = idPaciente;
    } else if (rol === 3) {
    } else {
      return res.status(403).json({ ok: false, message: 'Rol no autorizado' });
    }

    const turnos = await turnoService.obtenerTurnos(filtros);
    res.json({ ok: true, data: turnos });
  } catch (error) {
    next(error);
  }
};

export const getTurnoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const turno = await turnoService.obtenerTurnoPorId(id);
    if (!turno) {
      return res.status(404).json({ ok: false, message: 'Turno no encontrado' });
    }

    if (user.rol === 1) {
      const idMedico = await turnoService.obtenerIdMedicoPorUsuario(user.id);
      if (turno.id_medico !== idMedico) {
        return res.status(403).json({ ok: false, message: 'No tienes permiso para ver este turno' });
      }
    } else if (user.rol === 2) {
      const idPaciente = await pacienteService.obtenerIdPacientePorUsuario(user.id);
      if (turno.id_paciente !== idPaciente) {
        return res.status(403).json({ ok: false, message: 'No tienes permiso para ver este turno' });
      }
    } else if (user.rol !== 3) {
      return res.status(403).json({ ok: false, message: 'Rol no autorizado' });
    }

    res.json({ ok: true, data: turno });
  } catch (error) {
    next(error);
  }
};

export const createTurno = async (req, res, next) => {
  try {
    let { id_medico, id_paciente, id_obra_social, fecha_hora } = req.body;
    const user = req.user;

    if (!id_medico || !fecha_hora) {
      return res.status(400).json({
        ok: false,
        message: 'Faltan campos obligatorios: id_medico, fecha_hora',
      });
    }

    if (user.rol === 2) {
      const idPaciente = await pacienteService.obtenerIdPacientePorUsuario(user.id);
      if (!idPaciente) {
        return res.status(403).json({ ok: false, message: 'No eres un paciente registrado' });
      }
      id_paciente = idPaciente;
    } else if (user.rol === 3) {
      if (!id_paciente) {
        return res.status(400).json({ ok: false, message: 'id_paciente es requerido para administradores' });
      }
    } else {
      return res.status(403).json({ ok: false, message: 'Rol no autorizado para crear turnos' });
    }

    const resultado = await turnoService.crearTurno({
      id_medico,
      id_paciente,
      id_obra_social,
      fecha_hora,
    });

    res.status(201).json({
      ok: true,
      id: resultado.id,
      valor_total: resultado.valor_total,
      message: 'Turno creado',
    });
  } catch (error) {
    next(error);
  }
};

export const updateTurno = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fecha_hora } = req.body;
    const user = req.user;

    if (!fecha_hora) {
      return res.status(400).json({ ok: false, message: 'fecha_hora es requerida' });
    }

    const turno = await turnoService.obtenerTurnoPorId(id);
    if (!turno) {
      return res.status(404).json({ ok: false, message: 'Turno no encontrado' });
    }

    if (user.rol === 1) {
      const idMedico = await turnoService.obtenerIdMedicoPorUsuario(user.id);
      if (turno.id_medico !== idMedico) {
        return res.status(403).json({ ok: false, message: 'No puedes modificar un turno que no te pertenece' });
      }
    } else {
      return res.status(403).json({ ok: false, message: 'No tienes permiso para actualizar este turno' });
    }

    await turnoService.actualizarFechaTurno(id, fecha_hora);
    res.json({ ok: true, message: 'Turno actualizado' });
  } catch (error) {
    next(error);
  }
};

export const deleteTurno = async (req, res, next) => {
  try {
    const { id } = req.params;
    const turno = await turnoService.obtenerTurnoPorId(id);
    if (!turno) {
      return res.status(404).json({ ok: false, message: 'Turno no encontrado' });
    }

    await turnoService.eliminarTurno(id);
    res.json({ ok: true, message: 'Turno eliminado (soft delete)' });
  } catch (error) {
    next(error);
  }
};

export const marcarAtendido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const idMedico = await turnoService.obtenerIdMedicoPorUsuario(user.id);
    if (!idMedico) {
      return res.status(403).json({ ok: false, message: 'No eres un médico registrado' });
    }

    const turno = await turnoService.obtenerTurnoPorId(id);
    if (!turno) {
      return res.status(404).json({ ok: false, message: 'Turno no encontrado' });
    }
    if (turno.id_medico !== idMedico) {
      return res.status(403).json({ ok: false, message: 'No puedes marcar un turno que no te pertenece' });
    }

    await turnoService.marcarAtendido(id, idMedico);
    res.json({ ok: true, message: 'Turno marcado como atendido' });
  } catch (error) {
    next(error);
  }
};

export const estadisticasTurnos = async (req, res, next) => {
  try {
    const data = await turnoService.obtenerEstadisticas();
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

export const reportePDF = async (req, res, next) => {
  try {
    const datosParaPdf = await obtenerDatosReporte();
    generarPdfEstadisticas(datosParaPdf, res);
  } catch (error) {
    console.error('Error en reportePDF:', error);
    res.status(500).json({ ok: false, message: 'Error al generar el reporte PDF' });
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