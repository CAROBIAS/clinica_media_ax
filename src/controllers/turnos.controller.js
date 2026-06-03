import { pool } from '../config/db.js';
import { generarPdfEstadisticas } from '../services/reporteService.js';

async function getPacienteIdByUsuarioId(usuarioId) {
  const [rows] = await pool.query(
    `SELECT p.id_paciente
     FROM pacientes p
     JOIN usuarios u ON p.id_usuario = u.id_usuario
     WHERE u.id_usuario = ? AND u.activo = 1`,
    [usuarioId]
  );
  return rows.length > 0 ? rows[0].id_paciente : null;
}

async function getMedicoIdByUsuarioId(usuarioId) {
  const [rows] = await pool.query(
    `SELECT m.id_medico
     FROM medicos m
     JOIN usuarios u ON m.id_usuario = u.id_usuario
     WHERE u.id_usuario = ? AND u.activo = 1`,
    [usuarioId]
  );
  return rows.length > 0 ? rows[0].id_medico : null;
}

export const getTurnos = async (req, res, next) => {
  try {
    const user = req.user;
    const rol = user.rol;

    let query = `
      SELECT t.*,
             m.id_medico,
             u_med.apellido as medico_apellido,
             u_med.nombres as medico_nombres,
             p.id_paciente,
             u_pac.apellido as paciente_apellido,
             u_pac.nombres as paciente_nombres,
             os.nombre as obra_social_nombre,
             os.porcentaje_descuento
      FROM turnos_reservas t
      JOIN medicos m ON t.id_medico = m.id_medico
      JOIN usuarios u_med ON m.id_usuario = u_med.id_usuario
      JOIN pacientes p ON t.id_paciente = p.id_paciente
      JOIN usuarios u_pac ON p.id_usuario = u_pac.id_usuario
      LEFT JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
      WHERE t.activo = 1
        AND u_med.activo = 1
        AND u_pac.activo = 1
    `;
    const params = [];

    if (rol === 1) {
      const idMedico = await getMedicoIdByUsuarioId(user.id);
      if (!idMedico) {
        return res.status(403).json({ ok: false, message: 'Usuario no corresponde a un médico activo' });
      }
      query += ' AND t.id_medico = ?';
      params.push(idMedico);
    } else if (rol === 2) {
      const idPaciente = await getPacienteIdByUsuarioId(user.id);
      if (!idPaciente) {
        return res.status(403).json({ ok: false, message: 'Usuario no corresponde a un paciente activo' });
      }
      query += ' AND t.id_paciente = ?';
      params.push(idPaciente);
    }

    const [rows] = await pool.query(query, params);
    res.json({ ok: true, data: rows });
  } catch (error) {
    next(error);
  }
};

export const getTurnoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `
      SELECT t.*,
             m.id_medico,
             u_med.apellido as medico_apellido,
             u_med.nombres as medico_nombres,
             p.id_paciente,
             u_pac.apellido as paciente_apellido,
             u_pac.nombres as paciente_nombres,
             os.nombre as obra_social_nombre
      FROM turnos_reservas t
      JOIN medicos m ON t.id_medico = m.id_medico
      JOIN usuarios u_med ON m.id_usuario = u_med.id_usuario
      JOIN pacientes p ON t.id_paciente = p.id_paciente
      JOIN usuarios u_pac ON p.id_usuario = u_pac.id_usuario
      LEFT JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
      WHERE t.id_turno_reserva = ?
        AND t.activo = 1
        AND u_med.activo = 1
        AND u_pac.activo = 1
      `,
      [id]
    );
    if (!rows.length)
      return res.status(404).json({ ok: false, message: 'Turno no encontrado' });
    res.json({ ok: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

export const createTurno = async (req, res, next) => {
  try {
    let { id_medico, id_paciente, id_obra_social, fecha_hora } = req.body;

    if (!id_medico || !id_paciente || !fecha_hora) {
      return res.status(400).json({
        ok: false,
        message: 'Faltan campos obligatorios: id_medico, id_paciente, fecha_hora',
      });
    }

    if (!id_obra_social) {
      const [particular] = await pool.query(
        'SELECT id_obra_social FROM obras_sociales WHERE es_particular = 1 AND activo = 1 LIMIT 1'
      );
      if (particular.length === 0) {
        return res.status(500).json({
          ok: false,
          message: "No hay una obra social marcada como 'particular'. Cree una con es_particular=1.",
        });
      }
      id_obra_social = particular[0].id_obra_social;
    }

    const [medico] = await pool.query(
      `SELECT m.valor_consulta
       FROM medicos m
       JOIN usuarios u ON m.id_usuario = u.id_usuario
       WHERE m.id_medico = ? AND u.activo = 1`,
      [id_medico]
    );
    if (medico.length === 0) {
      return res.status(400).json({ ok: false, message: 'Médico inválido o usuario inactivo' });
    }
    const valorConsulta = parseFloat(medico[0].valor_consulta);

    const [paciente] = await pool.query(
      `SELECT p.id_paciente
       FROM pacientes p
       JOIN usuarios u ON p.id_usuario = u.id_usuario
       WHERE p.id_paciente = ? AND u.activo = 1`,
      [id_paciente]
    );
    if (paciente.length === 0) {
      return res.status(400).json({ ok: false, message: 'Paciente inválido o usuario inactivo' });
    }

    const [obra] = await pool.query(
      'SELECT porcentaje_descuento, es_particular FROM obras_sociales WHERE id_obra_social = ? AND activo = 1',
      [id_obra_social]
    );
    if (obra.length === 0) {
      return res.status(400).json({ ok: false, message: 'Obra social inválida o inactiva' });
    }

    let valorTotalCalculado = valorConsulta;
    if (obra[0].es_particular === 0) {
      const descuento = parseFloat(obra[0].porcentaje_descuento);
      valorTotalCalculado = valorConsulta - (valorConsulta * (descuento / 100));
    }

    const [ocupado] = await pool.query(
      'SELECT id_turno_reserva FROM turnos_reservas WHERE id_medico = ? AND fecha_hora = ? AND activo = 1',
      [id_medico, fecha_hora]
    );
    if (ocupado.length) {
      return res.status(400).json({ ok: false, message: 'Horario no disponible' });
    }

    const [result] = await pool.query(
      `INSERT INTO turnos_reservas
       (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido, activo)
       VALUES (?, ?, ?, ?, ?, 0, 1)`,
      [id_medico, id_paciente, id_obra_social, fecha_hora, valorTotalCalculado]
    );

    res.status(201).json({
      ok: true,
      id: result.insertId,
      valor_total: valorTotalCalculado,
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
    if (!fecha_hora) {
      return res.status(400).json({ ok: false, message: 'fecha_hora es requerida' });
    }
    await pool.query(
      'UPDATE turnos_reservas SET fecha_hora = ? WHERE id_turno_reserva = ? AND activo = 1',
      [fecha_hora, id]
    );
    res.json({ ok: true, message: 'Turno actualizado' });
  } catch (error) {
    next(error);
  }
};

export const deleteTurno = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?', [id]);
    res.json({ ok: true, message: 'Turno eliminado (soft delete)' });
  } catch (error) {
    next(error);
  }
};

export const marcarAtendido = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const idMedico = await getMedicoIdByUsuarioId(userId);
    if (!idMedico) {
      return res.status(403).json({ ok: false, message: 'No eres un médico registrado' });
    }

    const [turno] = await pool.query(
      `SELECT id_turno_reserva
       FROM turnos_reservas
       WHERE id_turno_reserva = ? AND id_medico = ? AND activo = 1`,
      [id, idMedico]
    );
    if (turno.length === 0) {
      return res.status(404).json({
        ok: false,
        message: 'Turno no encontrado o no pertenece a este médico',
      });
    }

    await pool.query('UPDATE turnos_reservas SET atentido = 1 WHERE id_turno_reserva = ?', [id]);
    res.json({ ok: true, message: 'Turno marcado como atendido' });
  } catch (error) {
    next(error);
  }
};

export const estadisticasTurnos = async (req, res, next) => {
  try {
    const [rows] = await pool.query('CALL especialidades_x_turnos()');
    res.json({ ok: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
};

export const reportePDF = async (req, res, next) => {
  try {
    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) as total FROM turnos_reservas WHERE activo = 1'
    );

    const [porObra] = await pool.query(`
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

    const datosParaPdf = {
      totalTurnos: total,
      porObraSocial: porObra,
      porEspecialidad: porEspecialidad,
    };

    generarPdfEstadisticas(datosParaPdf, res);
  } catch (error) {
    console.error('Error en reportePDF:', error);
    res.status(500).json({ ok: false, message: 'Error al generar el reporte PDF' });
  }
};