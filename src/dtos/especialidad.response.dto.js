// Pasa la fila de la base de datos a un objeto con nombres mas claros
class EspecialidadResponseDTO {
  constructor({ id_especialidad, nombre, activo }) {
    this.id = id_especialidad;
    this.nombre = nombre;
    this.activo = activo === 1; // convierte a booleano
  }
}

module.exports = EspecialidadResponseDTO;