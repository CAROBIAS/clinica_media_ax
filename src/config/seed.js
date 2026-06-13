import { pool } from './db.js';

const seedData = [
  { id_medico: 3, id_paciente: 1, id_obra_social: 1, fecha_hora: '2026-06-01 09:00:00', valor_total: 9000.00 },
  { id_medico: 3, id_paciente: 2, id_obra_social: 2, fecha_hora: '2026-06-01 10:00:00', valor_total: 9000.00 },
  { id_medico: 1, id_paciente: 3, id_obra_social: 3, fecha_hora: '2026-06-02 09:00:00', valor_total: 4450.00 },
  { id_medico: 4, id_paciente: 1, id_obra_social: 1, fecha_hora: '2026-06-02 13:00:00', valor_total: 13500.00 },
  { id_medico: 3, id_paciente: 2, id_obra_social: 2, fecha_hora: '2026-06-03 13:30:00', valor_total: 9000.00 },
  { id_medico: 2, id_paciente: 3, id_obra_social: 3, fecha_hora: '2026-06-03 14:00:00', valor_total: 4450.00 },
  { id_medico: 1, id_paciente: 1, id_obra_social: 1, fecha_hora: '2026-06-04 08:00:00', valor_total: 4500.00 },
  { id_medico: 4, id_paciente: 2, id_obra_social: 2, fecha_hora: '2026-06-04 17:00:00', valor_total: 13500.00 },
  { id_medico: 3, id_paciente: 3, id_obra_social: 3, fecha_hora: '2026-06-05 18:00:00', valor_total: 8900.00 },
  { id_medico: 2, id_paciente: 1, id_obra_social: 1, fecha_hora: '2026-06-05 22:00:00', valor_total: 4500.00 },
  { id_medico: 1, id_paciente: 2, id_obra_social: 2, fecha_hora: '2026-06-06 09:30:00', valor_total: 4500.00 },
  { id_medico: 4, id_paciente: 3, id_obra_social: 3, fecha_hora: '2026-06-06 10:00:00', valor_total: 13350.00 },
  { id_medico: 3, id_paciente: 1, id_obra_social: 1, fecha_hora: '2026-06-07 12:00:00', valor_total: 9000.00 },
  { id_medico: 2, id_paciente: 2, id_obra_social: 2, fecha_hora: '2026-06-07 23:00:00', valor_total: 4500.00 },
  { id_medico: 1, id_paciente: 3, id_obra_social: 3, fecha_hora: '2026-06-08 19:00:00', valor_total: 4450.00 },
  { id_medico: 4, id_paciente: 1, id_obra_social: 1, fecha_hora: '2026-06-08 06:00:00', valor_total: 13500.00 },
  { id_medico: 3, id_paciente: 2, id_obra_social: 2, fecha_hora: '2026-06-09 11:00:00', valor_total: 9000.00 },
  { id_medico: 2, id_paciente: 3, id_obra_social: 3, fecha_hora: '2026-06-09 15:00:00', valor_total: 4450.00 },
  { id_medico: 1, id_paciente: 1, id_obra_social: 1, fecha_hora: '2026-06-10 21:00:00', valor_total: 4500.00 },
  { id_medico: 4, id_paciente: 2, id_obra_social: 2, fecha_hora: '2026-06-10 14:30:00', valor_total: 13500.00 },
];

export async function runSeed() {
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) as total FROM turnos_reservas WHERE activo = 1'
  );

  if (total >= 15) return;

  const [existing] = await pool.query(
    'SELECT id_medico, fecha_hora FROM turnos_reservas'
  );

  const existingSet = new Set(
    existing.map(r => `${r.id_medico}_${new Date(r.fecha_hora).toISOString()}`)
  );

  const candidatos = seedData.filter(r =>
    !existingSet.has(`${r.id_medico}_${new Date(r.fecha_hora).toISOString()}`)
  );

  if (candidatos.length === 0) return;

  await pool.query(
    `INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido, activo) VALUES ?`,
    [candidatos.map(r => [r.id_medico, r.id_paciente, r.id_obra_social, r.fecha_hora, r.valor_total, 0, 1])]
  );
}