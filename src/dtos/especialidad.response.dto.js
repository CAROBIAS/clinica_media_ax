export default class EspecialidadResponseDTO {
  constructor({ id_especialidad, nombre, activo }) {
    this.id = id_especialidad;
    this.nombre = nombre;
    this.activo = activo === 1; 
  }
}