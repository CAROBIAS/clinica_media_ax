const { pool } = require('../config/db');

class MedicoModel {
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
        return rows;
    }

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
        return rows.length > 0 ? rows[0] : null;
    }

    async findByMatricula(matricula, excludeId = null) {
        let sql = 'SELECT id_medico FROM medicos WHERE matricula = ?';
        const params = [matricula];
        if (excludeId) {
            sql += ' AND id_medico != ?';
            params.push(excludeId);
        }
        const [rows] = await pool.execute(sql, params);
        return rows;
    }

    async findByUsuarioId(id_usuario) {
        const [rows] = await pool.execute(
            'SELECT id_medico FROM medicos WHERE id_usuario = ?',
            [id_usuario]
        );
        return rows;
    }

    async findUsuarioMedico(id_usuario) {
        const [rows] = await pool.execute(
            'SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND rol = 1 AND activo = 1',
            [id_usuario]
        );
        return rows;
    }

    async findEspecialidadActiva(id_especialidad) {
        const [rows] = await pool.execute(
            'SELECT id_especialidad FROM especialidades WHERE id_especialidad = ? AND activo = 1',
            [id_especialidad]
        );
        return rows;
    }

    async create(data) {
        const [result] = await pool.execute(
            `INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta)
       VALUES (?, ?, ?, ?, ?)`,
            [data.id_usuario, data.id_especialidad, data.matricula, data.descripcion || null, data.valor_consulta]
        );
        return result.insertId;
    }

    async update(id, data) {
        const updates = [];
        const params = [];
        if (data.id_especialidad !== undefined) {
            updates.push('id_especialidad = ?');
            params.push(data.id_especialidad);
        }
        if (data.matricula !== undefined) {
            updates.push('matricula = ?');
            params.push(data.matricula);
        }
        if (data.descripcion !== undefined) {
            updates.push('descripcion = ?');
            params.push(data.descripcion);
        }
        if (data.valor_consulta !== undefined) {
            updates.push('valor_consulta = ?');
            params.push(data.valor_consulta);
        }
        if (updates.length === 0) return;
        params.push(id);
        const sql = `UPDATE medicos SET ${updates.join(', ')} WHERE id_medico = ?`;
        await pool.execute(sql, params);
    }

    async getUsuarioIdByMedicoId(id) {
        const [rows] = await pool.execute(
            'SELECT id_usuario FROM medicos WHERE id_medico = ?',
            [id]
        );
        return rows.length > 0 ? rows[0].id_usuario : null;
    }
}

module.exports = MedicoModel;