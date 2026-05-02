const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medico.controller');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const {
  createValidation,
  updateValidation,
  idValidation
} = require('../middlewares/validations/medico.validation');

// Endpoints solo GET sin autenticación
router.get('/', medicoController.getAll); // Listar todos
router.get('/:id', idValidation, medicoController.getById); // Obtener por id

// Rutas protegidas solo para admin (rol 3)
// Temporalmente sin autenticación para pruebas, agregar cuando haya login y roles
// router.post('/', verifyToken, checkRole(3), createValidation, medicoController.create);
// router.put('/:id', verifyToken, checkRole(3), updateValidation, medicoController.update);
// router.delete('/:id', verifyToken, checkRole(3), idValidation, medicoController.delete);
router.post('/', createValidation, medicoController.create); // Crear
router.put('/:id', updateValidation, medicoController.update); // Actualizar
router.delete('/:id', idValidation, medicoController.delete); // Eliminar
module.exports = router;