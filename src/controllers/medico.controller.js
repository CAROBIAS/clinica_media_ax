const MedicoService = require('../services/medico.service');
const { ok, created, notFound } = require('../utils/response');

const service = new MedicoService();

// Recibe la petición, llama al servicio y da formato de respuesta usando el helper response, recibe filtros por query en getAll
class MedicoController {
  // Obtiene todas los medicos
  async getAll(req, res, next) {
    try {
      const especialidadId = req.query.especialidadId;
      const data = await service.findAll(especialidadId);
      return ok(res, data);
    } catch (error) {
      next(error);
    }
  }

  // Obtiene medico por id
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
  
  // Crea nuevo medico
  async create(req, res, next) {
    try {
      const data = await service.create(req.dto);
      return created(res, data);
    } catch (error) {
      next(error);
    }
  }

  // Actualiza medico por id
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const data = await service.update(id, req.dto);
      return ok(res, data);
    } catch (error) {
      next(error);
    }
  }

  // Elimina medico por id (soft delete)
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

module.exports = new MedicoController();