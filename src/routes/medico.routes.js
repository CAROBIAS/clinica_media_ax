const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medico.controller');
const { authMiddleware, authorize } = require('../middlewares/authMiddleware');
const {
  createValidation,
  updateValidation,
  idValidation
} = require('../middlewares/validations/medico.validation');

// Rutas públicas (consulta)
router.get('/', medicoController.getAll);
router.get('/:id', idValidation, medicoController.getById);

// Rutas protegidas solo para administradores (rol 3)
router.post('/', authMiddleware, authorize(3), createValidation, medicoController.create);
router.put('/:id', authMiddleware, authorize(3), updateValidation, medicoController.update);
router.delete('/:id', authMiddleware, authorize(3), idValidation, medicoController.delete);

module.exports = router;