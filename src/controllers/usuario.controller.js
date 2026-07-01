import service from '../services/usuario.service.js';
import { ok } from '../utils/response.js';

class UsuarioController {
  async actualizarFoto(req, res, next) {
    try {
      const { id } = req.params;
      const user = req.user;

      if (user.rol !== 3 && Number(user.id) !== Number(id)) {
        return res.status(403).json({ ok: false, message: 'Solo podés cambiar tu propia foto de perfil' });
      }

      if (!req.file) {
        return res.status(400).json({ ok: false, message: 'No se envió ningún archivo (campo "foto")' });
      }

      const fotoPath = `/uploads/${req.file.filename}`;
      const data = await service.actualizarFoto(id, fotoPath);
      return ok(res, data, 'Foto de perfil actualizada');
    } catch (error) {
      next(error);
    }
  }
}

export default new UsuarioController();