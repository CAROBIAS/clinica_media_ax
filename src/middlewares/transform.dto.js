const MedicoCreateDTO = require('../dtos/medico.create.dto');

const transformToMedicoDTO = (req, res, next) => {
  try {
    req.dto = new MedicoCreateDTO(req.body);
    next();
  } catch (error) {
    next({ statusCode: 400, message: 'Error al transformar los datos' });
  }
};

module.exports = { transformToMedicoDTO };