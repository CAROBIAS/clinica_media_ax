import express from 'express';
import usuarioController from '../controllers/usuario.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadFoto } from '../middlewares/upload.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios v1
 *   description: Gestión de perfil de usuario
 */

/**
 * @swagger
 * /usuarios/{id}/foto:
 *   put:
 *     summary: Subir o actualizar la foto de perfil de un usuario
 *     tags: [Usuarios v1]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto de perfil actualizada
 *       400:
 *         description: Archivo no enviado o formato inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No podés cambiar la foto de otro usuario
 */

router.put('/:id/foto', authMiddleware, uploadFoto.single('foto'), usuarioController.actualizarFoto);

export default router;
