import { pool } from '../config/db.js';

// Fix segun feedback de la segunda entrega, creado modelo turnos

class TurnoModel {
  async findAll(filtros = {}) {
    let sql = `
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
    if (filtros.idMedico) {
      sql += ' AND t.id_medico = ?';
      params.push(filtros.idMedico);
    }
    if (filtros.idPaciente) {
      sql += ' AND t.id_paciente = ?';
      params.push(filtros.idPaciente);
    }
    if (filtros.idTurno) {
      sql += ' AND t.id_turno_reserva = ?';
      params.push(filtros.idTurno);
    }
    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT t.*,
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
       WHERE t.id_turno_reserva = ? AND t.activo = 1
         AND u_med.activo = 1 AND u_pac.activo = 1`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async verificarOcupado(idMedico, fechaHora) {
    const [rows] = await pool.execute(
      'SELECT id_turno_reserva FROM turnos_reservas WHERE id_medico = ? AND fecha_hora = ? AND activo = 1',
      [idMedico, fechaHora]
    );
    return rows.length > 0;
  }

  async create(data) {
    const [result] = await pool.execute(
      `INSERT INTO turnos_reservas
       (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido, activo)
       VALUES (?, ?, ?, ?, ?, 0, 1)`,
      [data.id_medico, data.id_paciente, data.id_obra_social, data.fecha_hora, data.valor_total]
    );
    return result.insertId;
  }

  async updateFecha(id, fechaHora) {
    await pool.execute(
      'UPDATE turnos_reservas SET fecha_hora = ? WHERE id_turno_reserva = ? AND activo = 1',
      [fechaHora, id]
    );
  }

  async marcarAtendido(id) {
    await pool.execute('UPDATE turnos_reservas SET atentido = 1 WHERE id_turno_reserva = ?', [id]);
  }

  async softDelete(id) {
    await pool.execute('UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?', [id]);
  }

  async obtenerEstadisticas() {
    const [rows] = await pool.execute('CALL especialidades_x_turnos()');
    return rows[0];
  }

  async obtenerValorConsultaMedico(idMedico) {
    const [rows] = await pool.execute(
      `SELECT valor_consulta
       FROM medicos
       WHERE id_medico = ?`,
      [idMedico]
    );
    return rows.length > 0 ? parseFloat(rows[0].valor_consulta) : null;
  }

  async obtenerMedicoPorUsuarioId(usuarioId) {
    const [rows] = await pool.execute(
      `SELECT m.id_medico
      FROM medicos m
      JOIN usuarios u ON m.id_usuario = u.id_usuario
      WHERE u.id_usuario = ? AND u.activo = 1`,
      [usuarioId]
    );
    return rows.length > 0 ? rows[0].id_medico : null;
  }

  async obtenerPacienteActivo(idPaciente) {
    const [rows] = await pool.execute(
      `SELECT p.id_paciente
       FROM pacientes p
       JOIN usuarios u ON p.id_usuario = u.id_usuario
       WHERE p.id_paciente = ? AND u.activo = 1`,
      [idPaciente]
    );
    return rows.length > 0;
  }

  async obtenerObraSocial(idObraSocial) {
    const [rows] = await pool.execute(
      'SELECT porcentaje_descuento, es_particular FROM obras_sociales WHERE id_obra_social = ? AND activo = 1',
      [idObraSocial]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async obtenerObraSocialPaciente(idPaciente) {
    const [rows] = await pool.execute(
      'SELECT id_obra_social FROM pacientes WHERE id_paciente = ?',
      [idPaciente]
    );
    return rows.length > 0 ? rows[0].id_obra_social : null;
  }

  async obtenerObraSocialParticular() {
    const [rows] = await pool.execute(
      'SELECT id_obra_social FROM obras_sociales WHERE es_particular = 1 AND activo = 1 LIMIT 1'
    );
    return rows.length > 0 ? rows[0].id_obra_social : null;
  }
}

export default TurnoModel;