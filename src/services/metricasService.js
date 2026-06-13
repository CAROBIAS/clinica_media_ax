import { pool } from '../config/db.js';
import { calcularMedia, calcularMediana, calcularModa } from '../utils/estadistica.js';

async function obtenerPorMedico() {
  const [rows] = await pool.query(`
    SELECT
      CONCAT(u.apellido, ', ', u.nombres) AS nombre,
      COUNT(t.id_turno_reserva) AS cantidad
    FROM turnos_reservas t
    JOIN medicos m ON t.id_medico = m.id_medico
    JOIN usuarios u ON m.id_usuario = u.id_usuario
    WHERE t.activo = 1
    GROUP BY t.id_medico, u.apellido, u.nombres
    ORDER BY cantidad DESC
  `);
  return rows;
}

async function obtenerPorEspecialidad() {
  const [rows] = await pool.query(`
    SELECT
      e.nombre AS nombre,
      COUNT(t.id_turno_reserva) AS cantidad
    FROM turnos_reservas t
    JOIN medicos m ON t.id_medico = m.id_medico
    JOIN especialidades e ON m.id_especialidad = e.id_especialidad
    WHERE t.activo = 1
    GROUP BY e.id_especialidad, e.nombre
    ORDER BY cantidad DESC
  `);
  return rows;
}

async function obtenerPorObraSocial() {
  const [rows] = await pool.query(`
    SELECT
      os.nombre AS nombre,
      COUNT(t.id_turno_reserva) AS cantidad
    FROM turnos_reservas t
    JOIN obras_sociales os ON t.id_obra_social = os.id_obra_social
    WHERE t.activo = 1
    GROUP BY os.id_obra_social, os.nombre
    ORDER BY cantidad DESC
  `);
  return rows;
}

async function obtenerPorFranja() {
  const [rows] = await pool.query(`
    SELECT
      CASE
        WHEN HOUR(t.fecha_hora) BETWEEN 8  AND 11 THEN 'Mañana'
        WHEN HOUR(t.fecha_hora) BETWEEN 12 AND 15 THEN 'Mediodía'
        WHEN HOUR(t.fecha_hora) BETWEEN 16 AND 20 THEN 'Tarde'
        ELSE 'Noche'
      END AS nombre,
      COUNT(t.id_turno_reserva) AS cantidad
    FROM turnos_reservas t
    WHERE t.activo = 1
    GROUP BY nombre
    ORDER BY FIELD(
      CASE
        WHEN HOUR(t.fecha_hora) BETWEEN 8  AND 11 THEN 'Mañana'
        WHEN HOUR(t.fecha_hora) BETWEEN 12 AND 15 THEN 'Mediodía'
        WHEN HOUR(t.fecha_hora) BETWEEN 16 AND 20 THEN 'Tarde'
        ELSE 'Noche'
      END,
      'Mañana', 'Mediodía', 'Tarde', 'Noche'
    )
  `);
  return rows;
}

function calcularSeccion(items) {
  return {
    items,
    media: calcularMedia(items),
    mediana: calcularMediana(items),
    moda: calcularModa(items),
  };
}

export async function obtenerMetricas() {
  const [porMedico, porEspecialidad, porObraSocial, porFranja] = await Promise.all([
    obtenerPorMedico(),
    obtenerPorEspecialidad(),
    obtenerPorObraSocial(),
    obtenerPorFranja(),
  ]);

  return {
    porMedico: calcularSeccion(porMedico),
    porEspecialidad: calcularSeccion(porEspecialidad),
    porObraSocial: calcularSeccion(porObraSocial),
    porFranja: calcularSeccion(porFranja),
  };
}