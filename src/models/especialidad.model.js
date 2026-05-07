import { pool } from '../config/db.js';

class EspecialidadModel {
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT id_especialidad, nombre, activo FROM especialidades WHERE activo = 1 ORDER BY nombre'
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id_especialidad, nombre, activo FROM especialidades WHERE id_especialidad = ? AND activo = 1',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findByName(nombre) {
    const [rows] = await pool.execute(
      'SELECT id_especialidad, activo FROM especialidades WHERE nombre = ?',
      [nombre]
    );
    return rows;
  }

  async create(nombre) {
    const [result] = await pool.execute(
      'INSERT INTO especialidades (nombre, activo) VALUES (?, 1)',
      [nombre]
    );
    return result.insertId;
  }

  async update(id, nombre) {
    await pool.execute(
      'UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?',
      [nombre, id]
    );
  }

  async reactivate(id) {
    const [result] = await pool.execute(
      'UPDATE especialidades SET activo = 1 WHERE id_especialidad = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async delete(id) {
    await pool.execute(
      'UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?',
      [id]
    );
  }

  async findMedicosActivosByEspecialidad(id) {
    const [rows] = await pool.execute(
      `SELECT m.id_medico
       FROM medicos m
       JOIN usuarios u ON m.id_usuario = u.id_usuario
       WHERE m.id_especialidad = ? AND u.activo = 1`,
      [id]
    );
    return rows;
  }
}

export default EspecialidadModel;