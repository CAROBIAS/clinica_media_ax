const { pool } = require('../config/db');
const EspecialidadResponseDTO = require('../dtos/especialidad.response.dto');

// Contiene la lógica de negocio de especialidades y acceso a la base de datos
class EspecialidadService {
  // Select de especialidades con activo =1
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT id_especialidad, nombre, activo FROM especialidades WHERE activo = 1 ORDER BY nombre'
    );
    return rows.map(row => new EspecialidadResponseDTO(row));
  }

  // Select por id con activo = 1
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id_especialidad, nombre, activo FROM especialidades WHERE id_especialidad = ? AND activo = 1',
      [id]
    );
    if (rows.length === 0) return null;
    return new EspecialidadResponseDTO(rows[0]);
  }

  // Insert con validación de nombre unico
  async create(nombre) {
    const nombreUpper = nombre.trim().toUpperCase();
    // Validar nombre único (incluso entre inactivos, pero por regla debería ser único siempre)
    const [existe] = await pool.execute(
      'SELECT id_especialidad FROM especialidades WHERE nombre = ?',
      [nombreUpper]
    );
    if (existe.length > 0) throw new Error('El nombre de especialidad ya existe');

    const [result] = await pool.execute(
      'INSERT INTO especialidades (nombre, activo) VALUES (?, 1)',
      [nombreUpper]
    );
    return this.findById(result.insertId);
  }

  // Update con validacion de nombre unico
  async update(id, nombre) {
    const especialidad = await this.findById(id);
    if (!especialidad) throw new Error('Especialidad no encontrada');

    const nombreUpper = nombre.trim().toUpperCase();
    // Verificar conflicto con otra especialidad (activa o inactiva)
    const [conflicto] = await pool.execute(
      'SELECT id_especialidad FROM especialidades WHERE nombre = ? AND id_especialidad != ?',
      [nombreUpper, id]
    );
    if (conflicto.length > 0) throw new Error('El nombre de especialidad ya está en uso');

    await pool.execute(
      'UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?',
      [nombreUpper, id]
    );
    return this.findById(id);
  }

  // Update para soft delete, primero verifica que no tenga médicos activos asociados
  async delete(id) {
    const especialidad = await this.findById(id);
    if (!especialidad) throw new Error('Especialidad no encontrada');

    const [medicosActivos] = await pool.execute(
      `SELECT m.id_medico 
   FROM medicos m
   JOIN usuarios u ON m.id_usuario = u.id_usuario
   WHERE m.id_especialidad = ? AND u.activo = 1`,
      [id]
    );
    if (medicosActivos.length > 0) {
      const err = new Error('No se puede eliminar la especialidad porque tiene médicos activos asociados');
      err.statusCode = 400;
      throw err;
    }

    await pool.execute(
      'UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?',
      [id]
    );
    return true;
  }
}

module.exports = EspecialidadService;