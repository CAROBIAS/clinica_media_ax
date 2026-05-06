const EspecialidadModel = require('../models/especialidad.model');
const EspecialidadResponseDTO = require('../dtos/especialidad.response.dto');

// Contiene la lógica de negocio de especialidades
class EspecialidadService {
  constructor() {
    this.especialidadModel = new EspecialidadModel();
  }

  // Obtiene todas las especialidades activas
  async findAll() {
    const rows = await this.especialidadModel.findAll();
    return rows.map(row => new EspecialidadResponseDTO(row));
  }

  // Obtiene una especialidad por id
  async findById(id) {
    const row = await this.especialidadModel.findById(id);
    if (!row) return null;
    return new EspecialidadResponseDTO(row);
  }

  // Crea una nueva especialidad
  async create(nombre) {
    const nombreUpper = nombre.trim().toUpperCase();

    // Buscar si ya existe (activo o inactivo)
    const existe = await this.especialidadModel.findByName(nombreUpper);

    if (existe.length > 0) {
      const especialidadExistente = existe[0];

      // Si está inactiva, la reactivamos
      if (especialidadExistente.activo === 0) {
        await this.especialidadModel.reactivate(especialidadExistente.id_especialidad);
        return this.findById(especialidadExistente.id_especialidad);
      }

      // Si está activa, error
      const err = new Error('El nombre de especialidad ya existe');
      err.statusCode = 400;
      throw err;
    }

    // No existe, crear nueva
    const newId = await this.especialidadModel.create(nombreUpper);
    return this.findById(newId);
  }

  // Actualiza una especialidad existente
  async update(id, nombre) {
    // Verificar que la especialidad exista
    const especialidad = await this.findById(id);
    if (!especialidad) {
      const err = new Error('Especialidad no encontrada');
      err.statusCode = 404;
      throw err;
    }

    const nombreUpper = nombre.trim().toUpperCase();

    // Verificar que el nuevo nombre no esté en uso por otra especialidad
    const existe = await this.especialidadModel.findByName(nombreUpper);
    if (existe.length > 0 && existe[0].id_especialidad !== id) {
      const err = new Error('El nombre de especialidad ya está en uso');
      err.statusCode = 400;
      throw err;
    }

    await this.especialidadModel.update(id, nombreUpper);
    return this.findById(id);
  }

  // Elimina (soft delete) una especialidad
  async delete(id) {
    // Verificar que la especialidad exista
    const especialidad = await this.findById(id);
    if (!especialidad) {
      const err = new Error('Especialidad no encontrada');
      err.statusCode = 404;
      throw err;
    }

    // No elimina si tiene médicos activos asociados
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

module.exports = new EspecialidadService();