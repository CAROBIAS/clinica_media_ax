import { pool } from '../config/db.js';

export const updateObraSocial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_obra_social } = req.body;

    if (!id_obra_social) {
      return res.status(400).json({ ok: false, message: 'id_obra_social es requerido' });
    }

    const [paciente] = await pool.query(
      `SELECT p.id_paciente 
       FROM pacientes p
       JOIN usuarios u ON p.id_usuario = u.id_usuario
       WHERE p.id_paciente = ? AND u.activo = 1`,
      [id]
    );
    if (paciente.length === 0) {
      return res.status(404).json({ ok: false, message: 'Paciente no encontrado o inactivo' });
    }

    const [obra] = await pool.query(
      'SELECT id_obra_social FROM obras_sociales WHERE id_obra_social = ? AND activo = 1',
      [id_obra_social]
    );
    if (obra.length === 0) {
      return res.status(400).json({ ok: false, message: 'Obra social inválida o inactiva' });
    }

    await pool.query(
      'UPDATE pacientes SET id_obra_social = ? WHERE id_paciente = ?',
      [id_obra_social, id]
    );

    res.json({ ok: true, message: 'Obra social actualizada correctamente' });
  } catch (error) {
    next(error);
  }
};

export const getAllPacientes = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id_paciente, u.apellido, u.nombres, u.email, u.documento, 
             os.id_obra_social, os.nombre as obra_social_nombre
      FROM pacientes p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      LEFT JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
      WHERE u.activo = 1
      ORDER BY u.apellido, u.nombres
    `);
    res.json({ ok: true, data: rows });
  } catch (error) {
    next(error);
  }
};