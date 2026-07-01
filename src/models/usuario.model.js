import { pool } from '../config/db.js';

class UsuarioModel {
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id_usuario, documento, apellido, nombres, email, foto_path, rol, activo FROM usuarios WHERE id_usuario = ? AND activo = 1',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async actualizarFotoPath(id, fotoPath) {
    await pool.execute(
      'UPDATE usuarios SET foto_path = ? WHERE id_usuario = ?',
      [fotoPath, id]
    );
  }
}

export default UsuarioModel;