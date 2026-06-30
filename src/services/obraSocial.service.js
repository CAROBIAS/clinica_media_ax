import ObraSocialModel from '../models/obraSocial.model.js';

// Fix segun feedback de la segunda entrega, creado el servicio de obra social

class ObraSocialService {
  constructor() {
    this.obraSocialModel = new ObraSocialModel();
  }

  async listarTodas() {
    return await this.obraSocialModel.findAll();
  }

  async obtenerPorId(id) {
    return await this.obraSocialModel.findById(id);
  }

  async crear(data) {
    const existentes = await this.obraSocialModel.findByName(data.nombre);
    if (existentes.length > 0) {
      if (existentes[0].activo === 0) {
        await this.obraSocialModel.update(existentes[0].id_obra_social, data);
        return this.obtenerPorId(existentes[0].id_obra_social);
      }
      const err = new Error('Ya existe una obra social con ese nombre');
      err.statusCode = 400;
      throw err;
    }
    const id = await this.obraSocialModel.create(data);
    return this.obtenerPorId(id);
  }

  async actualizar(id, data) {
    const existente = await this.obraSocialModel.findById(id);
    if (!existente) {
      const err = new Error('Obra social no encontrada');
      err.statusCode = 404;
      throw err;
    }

    const duplicados = await this.obraSocialModel.findByName(data.nombre, id);
    if (duplicados.length > 0) {
      const err = new Error('Ya existe otra obra social con ese nombre');
      err.statusCode = 400;
      throw err;
    }

    await this.obraSocialModel.update(id, data);
    return this.obtenerPorId(id);
  }

  async eliminar(id) {
    const existente = await this.obraSocialModel.findById(id);
    if (!existente) {
      const err = new Error('Obra social no encontrada');
      err.statusCode = 404;
      throw err;
    }
    await this.obraSocialModel.softDelete(id);
  }

  async asignarAMedico(idMedico, idsObras) {
    for (const osId of idsObras) {
      const obra = await this.obraSocialModel.findById(osId);
      if (!obra) {
        const err = new Error(`Obra social con ID ${osId} no existe o está inactiva`);
        err.statusCode = 400;
        throw err;
      }
    }
    await this.obraSocialModel.asignarAMedico(idMedico, idsObras);
  }
}

export default new ObraSocialService();