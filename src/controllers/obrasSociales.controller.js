import { pool } from "../config/db.js";
import { calcularTotal } from "../services/calculo.service.js";

export const getObras = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM obras_sociales WHERE activo = 1");
  res.json(rows);
};

export const createObra = async (req, res) => {
  const { nombre, descuento } = req.body;

  const [result] = await pool.query(
    "INSERT INTO obras_sociales (nombre, porcentaje_descuento, activo) VALUES (?, ?, 1)",
    [nombre, descuento]
  );

  res.status(201).json({ id: result.insertId });
};

export const updateObra = async (req, res) => {
  const { id } = req.params;
  const { nombre, descuento } = req.body;

  await pool.query(
    "UPDATE obras_sociales SET nombre=?, porcentaje_descuento=? WHERE id_obra_social=?",
    [nombre, descuento, id]
  );

  res.json({ ok: true });
};

export const deleteObra = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?",
    [id]
  );

  res.json({ ok: true });
};

export const asignarObrasAMedico = async (req, res) => {
  const { id } = req.params;
  const { obras_sociales } = req.body;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    await conn.query("DELETE FROM medicos_obras_sociales WHERE id_medico = ?", [id]);

    for (let os of obras_sociales) {
      const [obra] = await conn.query(
        "SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1",
        [os]
      );

      if (obra.length === 0) {
        throw new Error("Obra social inválida o inactiva");
      }

      await conn.query(
        "INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?, ?)",
        [id, os]
      );
    }

    await conn.commit();
    res.json({ ok: true });

  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });

  } finally {
    conn.release();
  }
};

export const validarCalculoTurno = async (req, res) => {
  const { turno_id } = req.params;

  const [rows] = await pool.query(`
    SELECT t.valor_total as precio_base, o.porcentaje_descuento as descuento, t.valor_total
    FROM turnos_reservas t
    JOIN obras_sociales o ON t.id_obra_social = o.id_obra_social
    WHERE t.id_turno_reserva = ?
  `, [turno_id]);

  if (rows.length === 0) {
    return res.status(404).json({ error: "Turno no encontrado" });
  }

  const { precio_base, descuento, valor_total } = rows[0];
  const calculado = calcularTotal(precio_base, descuento);

  if (calculado !== valor_total) {
    return res.status(400).json({
      error: "El cálculo NO coincide",
      calculado,
      valor_bd: valor_total
    });
  }

  res.json({ ok: true, mensaje: "Cálculo correcto" });
};