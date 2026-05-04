import { pool } from "../db.js";
import { calcularTotal } from "../services/calculo.service.js";

export const getObras = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM obras_sociales WHERE activo = 1"
  );
  res.json(rows);
};

export const createObra = async (req, res) => {
  const { nombre, descuento } = req.body;

  const [result] = await pool.query(
    "INSERT INTO obras_sociales (nombre, descuento, activo) VALUES (?, ?, 1)",
    [nombre, descuento]
  );

  res.json({ id: result.insertId });
};

export const updateObra = async (req, res) => {
  const { id } = req.params;
  const { nombre, descuento } = req.body;

  await pool.query(
    "UPDATE obras_sociales SET nombre=?, descuento=? WHERE id=?",
    [nombre, descuento, id]
  );

  res.json({ ok: true });
};

export const deleteObra = async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "UPDATE obras_sociales SET activo = 0 WHERE id = ?",
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

    await conn.query(
      "DELETE FROM medicos_obras_sociales WHERE medico_id = ?",
      [id]
    );

    for (let os of obras_sociales) {
      const [obra] = await conn.query(
        "SELECT * FROM obras_sociales WHERE id = ? AND activo = 1",
        [os]
      );

      if (obra.length === 0) {
        throw new Error("Obra social inválida o inactiva");
      }

      await conn.query(
        "INSERT INTO medicos_obras_sociales (medico_id, obra_social_id) VALUES (?, ?)",
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
    SELECT t.precio_base, o.descuento, t.valor_total
    FROM turnos_reservas t
    JOIN obras_sociales o ON t.obra_social_id = o.id
    WHERE t.id = ?
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

  res.json({
    ok: true,
    mensaje: "Cálculo correcto"
  });
};
