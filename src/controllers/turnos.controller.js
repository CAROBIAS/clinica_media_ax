import { pool } from '../config/db.js';
import { generarPdfEstadisticas } from '../services/reporteService.js';

export const getTurnos = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM turnos_reservas WHERE activo = 1");
  res.json(rows);
};

export const getTurnoById = async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query("SELECT * FROM turnos_reservas WHERE id_turno_reserva = ? AND activo = 1", [id]);
  if (!rows.length) return res.status(404).json({ msg: "No encontrado" });
  res.json(rows[0]);
};

export const createTurno = async (req, res) => {
  const { id_medico, id_paciente, id_obra_social, fecha_hora } = req.body;

  const [medicos] = await pool.query("SELECT valor_consulta FROM medicos WHERE id_medico = ? AND activo = 1", [id_medico]);
  if (!medicos.length) return res.status(400).json({ msg: "Médico inválido" });
  const valorConsulta = parseFloat(medicos[0].valor_consulta);

  const [pacientes] = await pool.query("SELECT * FROM pacientes WHERE id_paciente = ? AND activo = 1", [id_paciente]);
  if (!pacientes.length) return res.status(400).json({ msg: "Paciente inválido" });

  let valorTotalCalculado = valorConsulta; 
  if (id_obra_social) {
    const [obras] = await pool.query("SELECT porcentaje_descuento, es_particular FROM obras_sociales WHERE id_obra_social = ? AND activo = 1", [id_obra_social]);
    if (!obras.length) return res.status(400).json({ msg: "Obra social inválida" });
    
    const obraSocial = obras[0];
    if (obraSocial.es_particular === 0) {
       const descuento = parseFloat(obraSocial.porcentaje_descuento);
       valorTotalCalculado = valorConsulta - (valorConsulta * (descuento / 100));
    }
  }

  const [ocupado] = await pool.query(
    "SELECT * FROM turnos_reservas WHERE id_medico = ? AND fecha_hora = ? AND activo = 1",
    [id_medico, fecha_hora]
  );
  if (ocupado.length) return res.status(400).json({ msg: "Horario no disponible" });

  const [result] = await pool.query(
    `INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido, activo) VALUES (?,?,?,?,?,0,1)`,
    [id_medico, id_paciente, id_obra_social, fecha_hora, valorTotalCalculado]
  );
  res.status(201).json({ id: result.insertId, valor_total: valorTotalCalculado, msg: "Turno creado" });
};

export const updateTurno = async (req, res) => {
  const { id } = req.params;
  const { fecha_hora } = req.body;
  await pool.query("UPDATE turnos_reservas SET fecha_hora=? WHERE id_turno_reserva=?", [fecha_hora, id]);
  res.json({ msg: "Actualizado" });
};

export const deleteTurno = async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE turnos_reservas SET activo=0 WHERE id_turno_reserva=?", [id]);
  res.json({ msg: "Eliminado" });
};

export const marcarAtendido = async (req, res) => {
  const { id } = req.params;
  await pool.query("UPDATE turnos_reservas SET atentido=1 WHERE id_turno_reserva=?", [id]);
  res.json({ msg: "Atendido" });
};

export const estadisticasTurnos = async (req, res) => {
  const [rows] = await pool.query("CALL especialidades_x_turnos()");
  res.json(rows[0]);
};

export const reportePDF = async (req, res) => {
  try {
    const [[{ total }]] = await pool.query("SELECT COUNT(*) as total FROM turnos_reservas WHERE activo = 1");

    const [porObra] = await pool.query(`
      SELECT os.nombre AS obra_social, COUNT(t.id_turno_reserva) AS cantidad 
      FROM turnos_reservas t
      JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
      WHERE t.activo = 1
      GROUP BY os.id_obra_social
    `);

    const [porEspecialidad] = await pool.query(`
      SELECT e.nombre AS especialidad, COUNT(t.id_turno_reserva) AS cantidad 
      FROM turnos_reservas t
      JOIN medicos m ON t.id_medico = m.id_medico
      JOIN especialidades e ON m.id_especialidad = e.id_especialidad
      WHERE t.activo = 1
      GROUP BY e.id_especialidad
    `);

    const datosParaPdf = {
      totalTurnos: total,
      porObraSocial: porObra,
      porEspecialidad: porEspecialidad
    };

    generarPdfEstadisticas(datosParaPdf, res);

  } catch (error) {
    console.error("Error en reportePDF:", error);
    res.status(500).json({ ok: false, msg: "Error al generar el reporte PDF" });
  }
};