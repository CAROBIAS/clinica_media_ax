import service from '../services/medico.service.js';
import { ok, created, notFound } from '../utils/response.js';

class MedicoController {
  async getAll(req, res, next) {
    try {
      const especialidadId = req.query.especialidadId;
      const data = await service.findAll(especialidadId);
      return ok(res, data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await service.findById(id);
      if (!data) return notFound(res, 'Médico no encontrado');
      return ok(res, data);
    } catch (error) {
      next(error);
    }
  }
  
  async create(req, res, next) {
    try {
      const data = await service.create(req.dto);
      return created(res, data);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = await service.update(id, req.dto);
      return ok(res, data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await service.delete(id);
      return ok(res, null, 'Médico eliminado');
    } catch (error) {
      next(error);
    }
  }
}

export default new MedicoController();