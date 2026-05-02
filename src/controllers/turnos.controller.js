const { pool } = require('../db/conexion');
const { validationResult } = require('express-validator');

// GET todos los turnos
const getTurnos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM turnos_reservas WHERE activo = 1"
    );

    res.json({
      estado: "ok",
      data: rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener turnos" });
  }
};

// GET turno por ID
const getTurnoById = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM turnos_reservas WHERE id_turno_reserva = ? AND activo = 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Turno no encontrado" });
    }

    res.json({
      estado: "ok",
      data: rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener turno" });
  }
};

// POST
const createTurno = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const {
      id_medico,
      id_paciente,
      id_obra_social,
      fecha_hora,
      valor_total
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO turnos_reservas 
      (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atendido, activo) 
      VALUES (?, ?, ?, ?, ?, 0, 1)`,
      [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total]
    );

    res.status(201).json({
      estado: "ok",
      mensaje: "Turno creado",
      id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear turno" });
  }
};

// PUT
const updateTurno = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { id } = req.params;

    const {
      id_medico,
      id_paciente,
      id_obra_social,
      fecha_hora,
      valor_total,
      atendido
    } = req.body;

    const [result] = await pool.query(
      `UPDATE turnos_reservas 
       SET id_medico = ?, id_paciente = ?, id_obra_social = ?, 
           fecha_hora = ?, valor_total = ?, atendido = ?
       WHERE id_turno_reserva = ? AND activo = 1`,
      [
        id_medico,
        id_paciente,
        id_obra_social,
        fecha_hora,
        valor_total,
        atendido,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Turno no encontrado" });
    }

    res.json({
      estado: "ok",
      mensaje: "Turno actualizado"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar turno" });
  }
};

// DELETE 
const deleteTurno = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { id } = req.params;

    const [result] = await pool.query(
      "UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Turno no encontrado" });
    }

    res.json({
      estado: "ok",
      mensaje: "Turno eliminado (borrado lógico)"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar turno" });
  }
};

module.exports = {
  getTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno
};
