import TurnoModel from '../models/turno.model.js';
import { calcularTotal } from './calculo.service.js';

// Fix segun feedback de la segunda entrega, creado el servicio de turno y se agrega la validacion de obra social, paciente y medico

class TurnoService {
  constructor() {
    this.turnoModel = new TurnoModel();
  }

  async obtenerTurnos(filtros) {
    return await this.turnoModel.findAll(filtros);
  }

  async obtenerTurnoPorId(id) {
    return await this.turnoModel.findById(id);
  }

  async crearTurno(data) {
    const valorConsulta = await this.turnoModel.obtenerValorConsultaMedico(data.id_medico);
    if (valorConsulta === null) {
      const err = new Error('Médico inválido o inactivo');
      err.statusCode = 400;
      throw err;
    }

    const pacienteActivo = await this.turnoModel.obtenerPacienteActivo(data.id_paciente);
    if (!pacienteActivo) {
      const err = new Error('Paciente inválido o inactivo');
      err.statusCode = 400;
      throw err;
    }

    let idObraSocial = data.id_obra_social;
    if (!idObraSocial) {
      const particular = await this.turnoModel.obtenerObraSocialParticular();
      if (!particular) {
        const err = new Error('No hay obra social particular configurada');
        err.statusCode = 400;
        throw err;
      }
      idObraSocial = particular;
    }

    const obra = await this.turnoModel.obtenerObraSocial(idObraSocial);
    if (!obra) {
      const err = new Error('Obra social inválida o inactiva');
      err.statusCode = 400;
      throw err;
    }

    let valorTotal = valorConsulta;
    if (obra.es_particular === 0) {
      valorTotal = calcularTotal(valorConsulta, obra.porcentaje_descuento);
    }

    const ocupado = await this.turnoModel.verificarOcupado(data.id_medico, data.fecha_hora);
    if (ocupado) {
      const err = new Error('Horario no disponible');
      err.statusCode = 400;
      throw err;
    }

    const nuevoId = await this.turnoModel.create({
      id_medico: data.id_medico,
      id_paciente: data.id_paciente,
      id_obra_social: idObraSocial,
      fecha_hora: data.fecha_hora,
      valor_total: valorTotal,
    });

    return { id: nuevoId, valor_total: valorTotal };
  }

  async actualizarFechaTurno(id, fechaHora) {
    const turno = await this.turnoModel.findById(id);
    if (!turno) {
      const err = new Error('Turno no encontrado');
      err.statusCode = 404;
      throw err;
    }
    await this.turnoModel.updateFecha(id, fechaHora);
  }

  async marcarAtendido(id, idMedico) {
    const turno = await this.turnoModel.findById(id);
    if (!turno) {
      const err = new Error('Turno no encontrado');
      err.statusCode = 404;
      throw err;
    }
    if (turno.id_medico !== idMedico) {
      const err = new Error('No pertenece a este médico');
      err.statusCode = 403;
      throw err;
    }
    await this.turnoModel.marcarAtendido(id);
  }

  async eliminarTurno(id) {
    const turno = await this.turnoModel.findById(id);
    if (!turno) {
      const err = new Error('Turno no encontrado');
      err.statusCode = 404;
      throw err;
    }
    await this.turnoModel.softDelete(id);
  }

  async obtenerEstadisticas() {
    return await this.turnoModel.obtenerEstadisticas();
  }

  async obtenerIdMedicoPorUsuario(usuarioId) {
    return await this.turnoModel.obtenerMedicoPorUsuarioId(usuarioId);
  }

  async validarCalculo(turnoId) {
    const turno = await this.turnoModel.findById(turnoId);
    if (!turno) {
      const err = new Error('Turno no encontrado');
      err.statusCode = 404;
      throw err;
    }

    const valorConsulta = await this.turnoModel.obtenerValorConsultaMedico(turno.id_medico);
    if (valorConsulta === null) {
      const err = new Error('Médico no encontrado');
      err.statusCode = 404;
      throw err;
    }

    const obra = await this.turnoModel.obtenerObraSocial(turno.id_obra_social);
    if (!obra) {
      const err = new Error('Obra social no encontrada');
      err.statusCode = 404;
      throw err;
    }

    let calculado = valorConsulta;
    if (obra.es_particular === 0) {
      calculado = calcularTotal(valorConsulta, obra.porcentaje_descuento);
    }

    const guardado = parseFloat(turno.valor_total);
    const coincide = Math.abs(calculado - guardado) < 0.01;

    return { calculado, guardado, coincide };
  }
}

export default new TurnoService();