import MedicoModel from '../models/medico.model.js';
import { pool } from '../config/db.js';
import MedicoResponseDTO from '../dtos/medico.response.dto.js';

class MedicoService {
  constructor() {
    this.medicoModel = new MedicoModel();
  }

  async findAll(especialidadId = null) {
    const rows = await this.medicoModel.findAll(especialidadId);
    return rows.map(row => new MedicoResponseDTO(row));
  }

  async findById(id) {
    const row = await this.medicoModel.findById(id);
    if (!row) return null;
    return new MedicoResponseDTO(row);
  }

  async create(data) {
    const yaEsMedico = await this.medicoModel.findByUsuarioId(data.id_usuario);
    if (yaEsMedico.length > 0) {
      const err = new Error('El usuario ya está registrado como médico');
      err.statusCode = 400;
      throw err;
    }

    const existMatricula = await this.medicoModel.findByMatricula(data.matricula);
    if (existMatricula.length > 0) {
      const err = new Error('Matrícula ya registrada');
      err.statusCode = 400;
      throw err;
    }

    const userCheck = await this.medicoModel.findUsuarioMedico(data.id_usuario);
    if (userCheck.length === 0) {
      const err = new Error('Usuario no válido o no es médico');
      err.statusCode = 400;
      throw err;
    }

    const espCheck = await this.medicoModel.findEspecialidadActiva(data.id_especialidad);
    if (espCheck.length === 0) {
      const err = new Error('Especialidad no existe o está inactiva');
      err.statusCode = 400;
      throw err;
    }

    const newId = await this.medicoModel.create(data);
    return this.findById(newId);
  }

  async update(id, data) {
    const existing = await this.findById(id);
    if (!existing) {
      const err = new Error('Médico no encontrado');
      err.statusCode = 404;
      throw err;
    }

    if (data.matricula && data.matricula !== existing.matricula) {
      const exist = await this.medicoModel.findByMatricula(data.matricula, id);
      if (exist.length > 0) {
        const err = new Error('Matrícula ya registrada');
        err.statusCode = 400;
        throw err;
      }
    }

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

export default new MedicoService();