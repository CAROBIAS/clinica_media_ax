const EspecialidadService = require('../services/especialidad.service');
const { ok, created, notFound } = require('../utils/response');

const service = new EspecialidadService();

// Recibe la petición, llama al servicio y da formato de respuesta usando el helper response
class EspecialidadController {
  // Obtiene todas las epecialidades activas
  async getAll(req, res, next) {
    try {
      const data = await service.findAll();
      return ok(res, data);
    } catch (error) {
      next(error);
    }
  }

  // Obtiene especialidad por id
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

  // Crea nueva especialidad
  async create(req, res, next) {
    try {
      const { nombre } = req.body;
      const data = await service.create(nombre);
      return created(res, data);
    } catch (error) {
      next(error);
    }
  }

  // Actualiza especialidad por id
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

  // Elimina especialidad por id (soft delete)
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

module.exports = new EspecialidadController();