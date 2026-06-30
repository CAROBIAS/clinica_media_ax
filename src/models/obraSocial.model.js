import { pool } from '../config/db.js';

// Fix segun feedback de la segunda entrega, creado modelo obras sociales

class ObraSocialModel {
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM obras_sociales WHERE activo = 1 ORDER BY nombre'
    );
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findByName(nombre, excludeId = null) {
    let sql = 'SELECT id_obra_social, activo FROM obras_sociales WHERE nombre = ?';
    const params = [nombre];
    if (excludeId) {
      sql += ' AND id_obra_social != ?';
      params.push(excludeId);
    }
    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  async create(data) {
    const [result] = await pool.execute(
      'INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular, activo) VALUES (?, ?, ?, ?, 1)',
      [data.nombre, data.descripcion || '', data.porcentaje_descuento, data.es_particular || 0]
    );
    return result.insertId;
  }

  async update(id, data) {
    await pool.execute(
      'UPDATE obras_sociales SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? WHERE id_obra_social = ?',
      [data.nombre, data.descripcion || '', data.porcentaje_descuento, data.es_particular || 0, id]
    );
  }

  async softDelete(id) {
    await pool.execute('UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?', [id]);
  }

  async asignarAMedico(idMedico, idsObras) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query('DELETE FROM medicos_obras_sociales WHERE id_medico = ?', [idMedico]);
      for (const osId of idsObras) {
        await conn.query(
          'INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?, ?)',
          [idMedico, osId]
        );
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}

export default ObraSocialModel;