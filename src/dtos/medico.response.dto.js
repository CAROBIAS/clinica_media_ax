// Cambia la fila de la base de datos a un objeto con nombres mas claros
class MedicoResponseDTO {
  constructor(row) {
    this.idMedico = row.id_medico;
    this.idUsuario = row.id_usuario;
    this.apellido = row.apellido;
    this.nombres = row.nombres;
    this.email = row.email;
    this.fotoPath = row.foto_path;
    this.matricula = row.matricula;
    this.descripcion = row.descripcion || null;
    this.valorConsulta = Number(row.valor_consulta);
    this.idEspecialidad = row.id_especialidad;
    this.nombreEspecialidad = row.nombre_especialidad;
  }
}

module.exports = MedicoResponseDTO;