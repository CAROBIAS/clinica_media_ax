import PacienteModel from '../models/paciente.model.js';
import ObraSocialModel from '../models/obraSocial.model.js';

// Fix segun feedback de la segunda entrega, creado el servicio de paciente y se agrega la validacion de obra social

class PacienteService {
  constructor() {
    this.pacienteModel = new PacienteModel();
    this.obraSocialModel = new ObraSocialModel();
  }

  async listarTodos() {
    return await this.pacienteModel.findAll();
  }

  async obtenerPaciente(id) {
    return await this.pacienteModel.findById(id);
  }

  async actualizarObraSocial(idPaciente, idObraSocial) {
    const paciente = await this.pacienteModel.findById(idPaciente);
    if (!paciente) throw new Error('Paciente no encontrado o inactivo');

    const obra = await this.obraSocialModel.findById(idObraSocial);
    if (!obra) {
      const err = new Error('Obra social inválida o inactiva');
      err.statusCode = 400;
      throw err;
    }

    await this.pacienteModel.actualizarObraSocial(idPaciente, idObraSocial);
  }

  async obtenerIdPacientePorUsuario(usuarioId) {
    return await this.pacienteModel.obtenerPacientePorUsuarioId(usuarioId);
  }
}

export default new PacienteService();