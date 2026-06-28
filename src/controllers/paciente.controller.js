import pacienteService from '../services/paciente.service.js';

// Fix segun feedback de la segunda entrega, se agregan los controladores de paciente y validacion de obra social

export const updateObraSocial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_obra_social } = req.body;
    if (!id_obra_social) {
      return res.status(400).json({ ok: false, message: 'id_obra_social es requerido' });
    }
    await pacienteService.actualizarObraSocial(id, id_obra_social);
    res.json({ ok: true, message: 'Obra social actualizada correctamente' });
  } catch (error) {
    next(error);
  }
};

export const getAllPacientes = async (req, res, next) => {
  try {
    const pacientes = await pacienteService.listarTodos();
    res.json({ ok: true, data: pacientes });
  } catch (error) {
    next(error);
  }
};