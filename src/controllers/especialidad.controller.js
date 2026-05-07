import service from '../services/especialidad.service.js';
import { ok, created, notFound } from '../utils/response.js';

class EspecialidadController {
  async getAll(req, res, next) {
    try {
      const data = await service.findAll();
      return ok(res, data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await service.findById(id);
      if (!data) return notFound(res, 'Especialidad no encontrada');
      return ok(res, data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { nombre } = req.body;
      const data = await service.create(nombre);
      return created(res, data);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre } = req.body;
      const data = await service.update(id, nombre);
      return ok(res, data);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await service.delete(id);
      return ok(res, null, 'Especialidad eliminada');
    } catch (error) {
      next(error);
    }
  }
}

export default new EspecialidadController();