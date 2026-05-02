const { pool } = require('../config/db');
const MedicoResponseDTO = require('../dtos/medico.response.dto');

// Contiene la lógica de negocio de medicos y acceso a la base de datos
class MedicoService {
  // Select con join a usuarios y especialidades, que esten activos y opcionalmente filtrar por id_especialidad
  async findAll(especialidadId = null) {
    let sql = `
      SELECT m.id_medico, m.id_usuario, u.apellido, u.nombres, u.email, u.foto_path,
             m.matricula, m.descripcion, m.valor_consulta,
             m.id_especialidad, e.nombre AS nombre_especialidad
      FROM medicos m
      JOIN usuarios u ON m.id_usuario = u.id_usuario
      JOIN especialidades e ON m.id_especialidad = e.id_especialidad
      WHERE u.activo = 1 AND e.activo = 1
    `;
    const params = [];
    if (especialidadId) {
      sql += ' AND m.id_especialidad = ?';
      params.push(especialidadId);
    }
    const [rows] = await pool.execute(sql, params);
    return rows.map(row => new MedicoResponseDTO(row));
  }

  // Select por id con join a usuario y especialidad, solo si ambos activos
  async findById(id) {
    const sql = `
      SELECT m.id_medico, m.id_usuario, u.apellido, u.nombres, u.email, u.foto_path,
             m.matricula, m.descripcion, m.valor_consulta,
             m.id_especialidad, e.nombre AS nombre_especialidad
      FROM medicos m
      JOIN usuarios u ON m.id_usuario = u.id_usuario
      JOIN especialidades e ON m.id_especialidad = e.id_especialidad
      WHERE m.id_medico = ? AND u.activo = 1 AND e.activo = 1
    `;
    const [rows] = await pool.execute(sql, [id]);
    if (rows.length === 0) return null;
    return new MedicoResponseDTO(rows[0]);
  }

  // Insert con validación de matrícula única, existencia y estado del usuario y especialidad
  async create(data) {
    const { id_usuario, id_especialidad, matricula, descripcion, valor_consulta } = data;
    const [exist] = await pool.execute('SELECT id_medico FROM medicos WHERE matricula = ?', [matricula]);
    if (exist.length) throw new Error('Matrícula ya registrada');

    // Verificar que usuario tenga rol médico y esté activo
    const [userCheck] = await pool.execute('SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND rol = 1 AND activo = 1', [id_usuario]);
    if (userCheck.length === 0) throw new Error('Usuario no válido o no es médico');

    // Verificar especialidad activa
    const [espCheck] = await pool.execute('SELECT id_especialidad FROM especialidades WHERE id_especialidad = ? AND activo = 1', [id_especialidad]);
    if (espCheck.length === 0) throw new Error('Especialidad no existe o está inactiva');

    const [result] = await pool.execute(
      `INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta)
       VALUES (?, ?, ?, ?, ?)`,
      [id_usuario, id_especialidad, matricula, descripcion || null, valor_consulta]
    );
    return this.findById(result.insertId);
  }

  // Update parcial evitando duplicado de matricula, verificando existencia de medico, usuario y especialidad
  async update(id, data) {
    const { id_especialidad, matricula, descripcion, valor_consulta } = data;
    const existing = await this.findById(id);
    if (!existing) throw new Error('Médico no encontrado');

    if (matricula && matricula !== existing.matricula) {
      const [exist] = await pool.execute('SELECT id_medico FROM medicos WHERE matricula = ? AND id_medico != ?', [matricula, id]);
      if (exist.length) throw new Error('Matrícula ya registrada');
    }

    if (id_especialidad) {
      const [espCheck] = await pool.execute('SELECT id_especialidad FROM especialidades WHERE id_especialidad = ? AND activo = 1', [id_especialidad]);
      if (espCheck.length === 0) throw new Error('Especialidad no válida');
    }

    const updates = [];
    const params = [];
    if (id_especialidad !== undefined) { updates.push('id_especialidad = ?'); params.push(id_especialidad); }
    if (matricula !== undefined) { updates.push('matricula = ?'); params.push(matricula); }
    if (descripcion !== undefined) { updates.push('descripcion = ?'); params.push(descripcion); }
    if (valor_consulta !== undefined) { updates.push('valor_consulta = ?'); params.push(valor_consulta); }
    params.push(id);

    if (updates.length === 0) return existing;

    const sql = `UPDATE medicos SET ${updates.join(', ')} WHERE id_medico = ?`;
    await pool.execute(sql, params);
    return this.findById(id);
  }

  // Update para soft delete, primero verifica que no tenga médicos activos asociados
  async delete(id) {
    const existing = await this.findById(id);
    if (!existing) throw new Error('Médico no encontrado');
    // Soft delete: desactivar el usuario asociado
    const userId = existing.idUsuario; // o existing.id_usuario según tu DTO
    if (!userId) throw new Error('Usuario asociado no encontrado');
    await pool.execute('UPDATE usuarios SET activo = 0 WHERE id_usuario = ?', [userId]);
    return true;
  }
}

module.exports = MedicoService;