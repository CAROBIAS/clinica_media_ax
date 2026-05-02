const express = require('express');
const router = express.Router();
const especialidadController = require('../controllers/especialidad.controller');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');
const {
  crearEspecialidadValidation,
  actualizarEspecialidadValidation,
  idEspecialidadValidation
} = require('../middlewares/validations/especialidad.validation');

// Rutas públicas (solo lectura)
router.get('/', especialidadController.getAll);
router.get('/:id', idEspecialidadValidation, especialidadController.getById);

// Rutas protegidas solo para administradores (rol 3)
router.post('/', authMiddleware, authorize(3), crearEspecialidadValidation, especialidadController.create);
router.put('/:id', authMiddleware, authorize(3), actualizarEspecialidadValidation, especialidadController.update);
router.delete('/:id', authMiddleware, authorize(3), idEspecialidadValidation, especialidadController.delete);

module.exports = router;