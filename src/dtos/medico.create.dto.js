// DTO para creación de médico, con validación de campos necesarios
class MedicoCreateDTO {
  constructor({ idUsuario, idEspecialidad, matricula, valorConsulta, descripcion }) {
    this.id_usuario = idUsuario;
    this.id_especialidad = idEspecialidad;
    this.matricula = matricula;
    this.valor_consulta = valorConsulta;
    this.descripcion = descripcion || null;
  }
}

module.exports = MedicoCreateDTO;