-- Procedimiento almacenado: especialidades_x_turnos
-- Devuelve la cantidad de turnos activos agrupada por especialidad.
-- Uso: importar en phpMyAdmin o consola MySQL/MariaDB (la app también lo instala en automatico al arrancar).

DROP PROCEDURE IF EXISTS especialidades_x_turnos;

DELIMITER $$

CREATE PROCEDURE especialidades_x_turnos()
BEGIN
  SELECT e.nombre AS especialidad, COUNT(t.id_turno_reserva) AS cantidad
  FROM turnos_reservas t
  JOIN medicos m ON t.id_medico = m.id_medico
  JOIN especialidades e ON m.id_especialidad = e.id_especialidad
  WHERE t.activo = 1
  GROUP BY e.id_especialidad, e.nombre
  ORDER BY cantidad DESC;
END$$

DELIMITER ;