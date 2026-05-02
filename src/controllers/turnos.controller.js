const { pool } = require('../db/conexion');
const { validationResult } = require('express-validator');

// GET 
const getTurnos = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM turnos_reservas WHERE activo = 1"
  );
  res.json(rows);
};

// GET por ID
const getTurnoById = async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query(
    "SELECT * FROM turnos_reservas WHERE id_turno_reserva = ? AND activo = 1",
    [id]
  );

  if (!rows.length) {
    return res.status(404).json({ msg: "No encontrado" });
  }

  res.json(rows[0]);
};

// CREATE
const createTurno = async (req, res) => {
  const {
    id_medico,
    id_paciente,
    id_obra_social,
    fecha_hora,
    valor_total
  } = req.body;

  // VALIDAR FK médico
  const [medico] = await pool.query(
    "SELECT * FROM medicos WHERE id_medico = ? AND activo = 1",
    [id_medico]
  );

  if (!medico.length) {
    return res.status(400).json({ msg: "Médico inválido" });
  }

  // VALIDAR FK paciente
  const [paciente] = await pool.query(
    "SELECT * FROM pacientes WHERE id_paciente = ? AND activo = 1",
    [id_paciente]
  );

  if (!paciente.length) {
    return res.status(400).json({ msg: "Paciente inválido" });
  }

  // DISPONIBILIDAD
  const [ocupado] = await pool.query(
    `SELECT * FROM turnos_reservas 
     WHERE id_medico = ? AND fecha_hora = ? AND activo = 1`,
    [id_medico, fecha_hora]
  );

  if (ocupado.length) {
    return res.status(400).json({ msg: "Horario no disponible" });
  }

  // INSERT
  const [result] = await pool.query(
    `INSERT INTO turnos_reservas
     (id_medico,id_paciente,id_obra_social,fecha_hora,valor_total,atendido,activo)
     VALUES (?,?,?,?,?,0,1)`,
    [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total]
  );

  res.status(201).json({ id: result.insertId });
};

// UPDATE
const updateTurno = async (req, res) => {
  const { id } = req.params;
  const { fecha_hora } = req.body;

  await pool.query(
    "UPDATE turnos_reservas SET fecha_hora=? WHERE id_turno_reserva=?",
    [fecha_hora, id]
  );

  res.json({ msg: "Actualizado" });
};

// DELETE 
const deleteTurno = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "UPDATE turnos_reservas SET activo=0 WHERE id_turno_reserva=?",
    [id]
  );

  res.json({ msg: "Eliminado" });
};

// MARCAR ATENDIDO
const marcarAtendido = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "UPDATE turnos_reservas SET atendido=1 WHERE id_turno_reserva=?",
    [id]
  );

  res.json({ msg: "Atendido" });
};

// STORED PROCEDURE
const estadisticasTurnos = async (req, res) => {
  const [rows] = await pool.query("CALL especialidades_x_turnos()");
  res.json(rows[0]);
};

// VIEW 
const reportePDF = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM v_pacientes");
  res.json(rows);
};

module.exports = {
  getTurnos,
  getTurnoById,
  createTurno,
  updateTurno,
  deleteTurno,
  marcarAtendido,
  estadisticasTurnos,
  reportePDF
};
