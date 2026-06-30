import { body, param, validationResult } from 'express-validator';

// Fix segun feedback de la segunda entrega, creadas validaciones de pacientes

const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ ok: false, errors: errores.array() });
  }
  next();
};

export const actualizarObraSocialValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID de paciente inválido'),
  body('id_obra_social').isInt({ min: 1 }).withMessage('ID de obra social inválido'),
  validarCampos,
];