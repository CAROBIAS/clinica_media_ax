import UsuarioModel from '../models/usuario.model.js';

class UsuarioService {
  constructor() {
    this.usuarioModel = new UsuarioModel();
  }

  async actualizarFoto(id, fotoPath) {
    const usuario = await this.usuarioModel.findById(id);
    if (!usuario) {
      const err = new Error('Usuario no encontrado');
      err.statusCode = 404;
      throw err;
    }
    await this.usuarioModel.actualizarFotoPath(id, fotoPath);
    return { ...usuario, foto_path: fotoPath };
  }
}

export default new UsuarioService();
