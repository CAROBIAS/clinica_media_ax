import { pool } from '../config/db.js';

// Fix segun feedback de la segunda entrega, creado modelo pacientes

class PacienteModel {
  async findAll() {
    const [rows] = await pool.execute(`
      SELECT p.id_paciente, u.apellido, u.nombres, u.email, u.documento,
             os.id_obra_social, os.nombre as obra_social_nombre
      FROM pacientes p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      LEFT JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
      WHERE u.activo = 1
      ORDER BY u.apellido, u.nombres
    `);
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.id_paciente, p.id_obra_social
       FROM pacientes p
       JOIN usuarios u ON p.id_usuario = u.id_usuario
       WHERE p.id_paciente = ? AND u.activo = 1`,
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async actualizarObraSocial(idPaciente, idObraSocial) {
    await pool.execute(
      'UPDATE pacientes SET id_obra_social = ? WHERE id_paciente = ?',
      [idObraSocial, idPaciente]
    );
  }

  async obtenerPacientePorUsuarioId(usuarioId) {
    const [rows] = await pool.execute(
      `SELECT p.id_paciente
       FROM pacientes p
       JOIN usuarios u ON p.id_usuario = u.id_usuario
       WHERE u.id_usuario = ? AND u.activo = 1`,
      [usuarioId]
    );
    return rows.length > 0 ? rows[0].id_paciente : null;
  }
}

export default PacienteModel;