// DTO para creación de médico, con validación de campos necesarios
class MedicoCreateDTO {
  constructor(body) {
    this.id_usuario = body.id_usuario;
    this.id_especialidad = body.id_especialidad;
    this.matricula = body.matricula;
    this.descripcion = body.descripcion || null;
    this.valor_consulta = body.valor_consulta;
  }
}

module.exports = MedicoCreateDTO;