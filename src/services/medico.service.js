const MedicoModel = require('../models/medico.model');
const { pool } = require('../config/db');
const MedicoResponseDTO = require('../dtos/medico.response.dto');

// Contiene la lógica de negocio de médicos
class MedicoService {
  constructor() {
    this.medicoModel = new MedicoModel();
  }

  // Obtiene todos los médicos activos, con opción de filtrar por especialidad
  async findAll(especialidadId = null) {
    const rows = await this.medicoModel.findAll(especialidadId);
    return rows.map(row => new MedicoResponseDTO(row));
  }

  // Obtiene un médico por id
  async findById(id) {
    const row = await this.medicoModel.findById(id);
    if (!row) return null;
    return new MedicoResponseDTO(row);
  }

  // Crea un nuevo médico
  async create(data) {
    // Verificar que el usuario no esté ya registrado como médico
    const yaEsMedico = await this.medicoModel.findByUsuarioId(data.id_usuario);
    if (yaEsMedico.length > 0) {
      const err = new Error('El usuario ya está registrado como médico');
      err.statusCode = 400;
      throw err;
    }

    // Verificar matrícula única
    const existMatricula = await this.medicoModel.findByMatricula(data.matricula);
    if (existMatricula.length > 0) {
      const err = new Error('Matrícula ya registrada');
      err.statusCode = 400;
      throw err;
    }

    // Verificar que el usuario tenga rol médico y esté activo
    const userCheck = await this.medicoModel.findUsuarioMedico(data.id_usuario);
    if (userCheck.length === 0) {
      const err = new Error('Usuario no válido o no es médico');
      err.statusCode = 400;
      throw err;
    }

    // Verificar que la especialidad exista y esté activa
    const espCheck = await this.medicoModel.findEspecialidadActiva(data.id_especialidad);
    if (espCheck.length === 0) {
      const err = new Error('Especialidad no existe o está inactiva');
      err.statusCode = 400;
      throw err;
    }

    const newId = await this.medicoModel.create(data);
    return this.findById(newId);
  }

  // Actualiza un médico existente
  async update(id, data) {
    const existing = await this.findById(id);
    if (!existing) {
      const err = new Error('Médico no encontrado');
      err.statusCode = 404;
      throw err;
    }

    // Si cambia matrícula, verificar que no esté duplicada
    if (data.matricula && data.matricula !== existing.matricula) {
      const exist = await this.medicoModel.findByMatricula(data.matricula, id);
      if (exist.length > 0) {
        const err = new Error('Matrícula ya registrada');
        err.statusCode = 400;
        throw err;
      }
    }

    // Si cambia especialidad, verificar que exista y esté activa
    if (data.id_especialidad) {
      const espCheck = await this.medicoModel.findEspecialidadActiva(data.id_especialidad);
      if (espCheck.length === 0) {
        const err = new Error('Especialidad no existe o está inactiva');
        err.statusCode = 400;
        throw err;
      }
    }

    await this.medicoModel.update(id, data);
    return this.findById(id);
  }

  // Elimina (soft delete) un médico y desactivando su usuario asociado
  async delete(id) {
    const existing = await this.findById(id);
    if (!existing) {
      const err = new Error('Médico no encontrado');
      err.statusCode = 404;
      throw err;
    }

    const userId = await this.medicoModel.getUsuarioIdByMedicoId(id);
    if (!userId) {
      const err = new Error('Usuario asociado no encontrado');
      err.statusCode = 404;
      throw err;
    }

    await pool.execute('UPDATE usuarios SET activo = 0 WHERE id_usuario = ?', [userId]);
    return true;
  }
}

module.exports = new MedicoService();