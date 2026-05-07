import EspecialidadModel from '../models/especialidad.model.js';
import EspecialidadResponseDTO from '../dtos/especialidad.response.dto.js';

class EspecialidadService {
  constructor() {
    this.especialidadModel = new EspecialidadModel();
  }

  async findAll() {
    const rows = await this.especialidadModel.findAll();
    return rows.map(row => new EspecialidadResponseDTO(row));
  }

  async findById(id) {
    const row = await this.especialidadModel.findById(id);
    if (!row) return null;
    return new EspecialidadResponseDTO(row);
  }

  async create(nombre) {
    const nombreUpper = nombre.trim().toUpperCase();
    const existe = await this.especialidadModel.findByName(nombreUpper);

    if (existe.length > 0) {
      const especialidadExistente = existe[0];
      if (especialidadExistente.activo === 0) {
        await this.especialidadModel.reactivate(especialidadExistente.id_especialidad);
        return this.findById(especialidadExistente.id_especialidad);
      }
      const err = new Error('El nombre de especialidad ya existe');
      err.statusCode = 400;
      throw err;
    }

    const newId = await this.especialidadModel.create(nombreUpper);
    return this.findById(newId);
  }

  async update(id, nombre) {
    const especialidad = await this.findById(id);
    if (!especialidad) {
      const err = new Error('Especialidad no encontrada');
      err.statusCode = 404;
      throw err;
    }

    const nombreUpper = nombre.trim().toUpperCase();
    const existe = await this.especialidadModel.findByName(nombreUpper);
    if (existe.length > 0 && existe[0].id_especialidad !== parseInt(id)) {
      const err = new Error('El nombre de especialidad ya está en uso');
      err.statusCode = 400;
      throw err;
    }

    await this.especialidadModel.update(id, nombreUpper);
    return this.findById(id);
  }

  async delete(id) {
    const especialidad = await this.findById(id);
    if (!especialidad) {
      const err = new Error('Especialidad no encontrada');
      err.statusCode = 404;
      throw err;
    }

    const medicosActivos = await this.especialidadModel.findMedicosActivosByEspecialidad(id);
    if (medicosActivos.length > 0) {
      const err = new Error('No se puede eliminar la especialidad porque tiene médicos activos asociados');
      err.statusCode = 400;
      throw err;
    }

    await this.especialidadModel.delete(id);
    return true;
  }
}

export default new EspecialidadService();