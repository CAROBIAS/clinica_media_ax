const express = require('express');
const router = express.Router();
const especialidadController = require('../controllers/especialidad.controller');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const {
  crearEspecialidadValidation,
  actualizarEspecialidadValidation,
  idEspecialidadValidation
} = require('../middlewares/validations/especialidad.validation');

// Rutas públicas (solo lectura, sin autenticación) - para pacientes
router.get('/', especialidadController.getAll);
router.get('/:id', idEspecialidadValidation, especialidadController.getById);

// Rutas protegidas solo para admin (rol 3)
// Temporalmente sin autenticación para facilitar pruebas, se agregarán luego
// router.post('/', verifyToken, checkRole(3), crearEspecialidadValidation, especialidadController.create);
// router.put('/:id', verifyToken, checkRole(3), actualizarEspecialidadValidation, especialidadController.update);
// router.delete('/:id', verifyToken, checkRole(3), idEspecialidadValidation, especialidadController.delete);
// Temporal para pruebas sin autenticación ni autorización
router.post('/', crearEspecialidadValidation, especialidadController.create); // Crear
router.put('/:id', actualizarEspecialidadValidation, especialidadController.update); // Actualizar
router.delete('/:id', idEspecialidadValidation, especialidadController.delete); // Eliminar
module.exports = router;