const { pool } = require('../config/db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // ✅ CORREGIDO: Usar pool.query en lugar de db.query
    const [rows] = await pool.query(
      'SELECT id_usuario, email, contrasenia, rol FROM usuarios WHERE email = ? AND activo = 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas o usuario inactivo' });
    }

    const usuario = rows[0];
    const passwordHash = hashPassword(password);

    if (passwordHash !== usuario.contrasenia) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '8h' }
    );

    res.json({
      ok: true,
      token,
      user: { id: usuario.id_usuario, email: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };