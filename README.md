# API Clínica Médica AX

API REST del lado del servidor para la gestión de una clínica médica: usuarios, médicos, especialidades, obras sociales, pacientes y turnos. Desarrollada como Trabajo Final Integrador de **Programación III – UNER (2026, 1er cuatrimestre)**, Tecnicatura Universitaria en Desarrollo Web.

---

## Descripción

El sistema permite administrar la operación diaria de la clínica a través de una API organizada por roles. Cada usuario (médico, paciente o administrador) accede únicamente a las funcionalidades que le corresponden, y la información se persiste en una base de datos relacional.

Las funcionalidades principales incluyen:

- Inicio de sesión con autenticación segura mediante **JWT**.
- Gestión de **especialidades**, **médicos** y **obras sociales**.
- Asociación de médicos con especialidades y con obras sociales.
- Asignación de obras sociales a pacientes.
- Registro y gestión de **turnos**, con cálculo automático del valor según la obra social.
- Marcado de turnos como atendidos por parte del profesional.
- **Estadísticas y reportes** de atención, incluyendo un reporte en **PDF**.
- **Métricas avanzadas** de turnos (media, mediana y moda) agrupadas por distintas dimensiones.

---

## Tecnologías

- **Node.js** con **Express 5**
- **MySQL / MariaDB** (driver `mysql2`)
- **JWT** (`jsonwebtoken`) para autenticación y autorización por roles
- **PDFKit** para la generación de reportes en PDF
- **Swagger** (`swagger-jsdoc` + `swagger-ui-express`) para documentación interactiva
- **express-validator** para validación de datos de entrada
- **Morgan** para registro de solicitudes
- **CORS** para el control de orígenes
- **dotenv** para el manejo de variables de entorno

---

## Roles del sistema

| Rol | Valor | Puede |
|-----|-------|-------|
| Médico | `1` | Iniciar sesión, listar sus turnos, marcar turnos como atendidos |
| Paciente | `2` | Iniciar sesión, crear y listar sus turnos, listar especialidades y médicos |
| Administrador | `3` | Gestionar especialidades, médicos y obras sociales; asociaciones; registrar turnos; obtener estadísticas |

---

## Versionado de la API

La API está organizada en versiones para mantener separadas las distintas etapas de funcionalidad:

- **`/api/v1`** — Endpoints principales: autenticación, especialidades, médicos, obras sociales y turnos.
- **`/api/v2`** — Gestión de pacientes.
- **`/api/v3`** — Métricas estadísticas avanzadas.

---

## Endpoints principales

> Todos los endpoints (salvo el login) requieren enviar el token JWT en la cabecera:
> `Authorization: Bearer <token>`

### Autenticación — `v1`
- `POST /api/v1/auth/login` — Iniciar sesión y obtener el token.

### Especialidades — `v1`
- `GET /api/v1/especialidades` — Listar.
- `GET /api/v1/especialidades/:id` — Obtener por ID.
- `POST /api/v1/especialidades` — Crear (admin).
- `PUT /api/v1/especialidades/:id` — Editar (admin).
- `DELETE /api/v1/especialidades/:id` — Eliminar (admin).

### Médicos — `v1`
- `GET /api/v1/medicos` — Listar (admite filtro por especialidad).
- `GET /api/v1/medicos/:id` — Obtener por ID.
- `POST /api/v1/medicos` — Crear (admin).
- `PUT /api/v1/medicos/:id` — Editar (admin).
- `DELETE /api/v1/medicos/:id` — Eliminar (admin).
- `POST /api/v1/medicos/:id/obras-sociales` — Asociar obras sociales a un médico (admin).

### Obras sociales — `v1`
- `GET /api/v1/obras-sociales` — Listar.
- `POST /api/v1/obras-sociales` — Crear (admin).
- `PUT /api/v1/obras-sociales/:id` — Editar (admin).
- `DELETE /api/v1/obras-sociales/:id` — Eliminar (admin).

### Turnos — `v1`
- `GET /api/v1/turnos` — Listar turnos (filtrados según el rol).
- `GET /api/v1/turnos/:id` — Obtener por ID.
- `POST /api/v1/turnos` — Crear turno (paciente o admin).
- `PUT /api/v1/turnos/:id` — Editar turno (admin).
- `DELETE /api/v1/turnos/:id` — Eliminar turno (admin).
- `PUT /api/v1/turnos/atendido/:id` — Marcar como atendido (médico).
- `GET /api/v1/turnos/estadisticas/resumen` — Resumen estadístico (admin).
- `GET /api/v1/turnos/reporte/estadisticas` — Descargar reporte PDF (admin).

### Pacientes — `v2`
- `GET /api/v2/pacientes` — Listar pacientes (admin).
- `PUT /api/v2/pacientes/:id/obra-social` — Asignar obra social a un paciente (admin).

### Métricas — `v3`
- `GET /api/v3/metricas/reporte` — Descargar el reporte PDF con métricas avanzadas (admin).

---

## Documentación interactiva (Swagger)

Con el servidor en ejecución, la documentación completa y probable de la API está disponible en:

```
http://localhost:3000/api-docs
```

Desde allí se pueden ver todos los endpoints, sus parámetros y respuestas, y probarlos directamente. Para los endpoints protegidos, primero se obtiene el token con el login y se carga en el botón **Authorize**.

---

## Instalación y ejecución

### Requisitos previos
- Node.js (versión 18 o superior)
- MySQL o MariaDB con la base de datos `prog3_turnos` creada a partir del script de estructura provisto.

### Pasos

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar las variables de entorno.** Crear un archivo `.env` en la raíz tomando como base `.env.example`:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=
   DB_PASSWORD=
   DB_NAME=prog3_turnos
   JWT_SECRET=CAMBIAR_ESTA_CLAVE
   JWT_EXPIRES=8h
   ```

3. **Iniciar la aplicación:**
   ```bash
   # Modo desarrollo (con recarga automática)
   npm run dev

   # Modo producción
   npm start
   ```

4. El servidor quedará disponible en `http://localhost:3000` y la documentación en `http://localhost:3000/api-docs`.

---

## Datos de prueba (Seed)

Al iniciar el servidor, el sistema ejecuta un proceso de carga de datos de prueba para los turnos. Este proceso está diseñado para ser **seguro e idempotente**: solo agrega información cuando hace falta y evita duplicar registros que ya existen, de modo que se puede levantar el servidor varias veces sin alterar los datos previos. Su objetivo es contar con un volumen de turnos representativo para visualizar correctamente las estadísticas y métricas.

---

## Reportes y métricas

El sistema ofrece dos niveles de información sobre la actividad de la clínica:

- **Reporte estadístico (PDF):** resumen general de turnos, con totales por obra social y por especialidad.
- **Métricas avanzadas (v3):** además de los conteos, calcula **media, mediana y moda** de los turnos agrupados por médico, especialidad, obra social y franja horaria, y los presenta en un reporte PDF. La moda contempla los distintos casos posibles (valor único, varios valores empatados o resultado no determinable).

Las franjas horarias se clasifican en cuatro tramos: Mañana, Mediodía, Tarde y Noche.

---

## Reglas de negocio destacadas

- **Cálculo del valor del turno:** el valor se calcula a partir del valor de consulta del médico, aplicando el descuento de la obra social cuando corresponde. Si la obra social es particular, se cobra el valor completo de la consulta.
- **Borrado lógico (soft delete):** los registros no se eliminan físicamente; se marcan como inactivos mediante el campo `activo`. Todas las consultas trabajan únicamente con registros activos.
- **Seguridad por roles:** cada endpoint valida tanto la autenticación (token válido) como la autorización (rol habilitado) antes de ejecutar la operación.

---

## Estructura del proyecto

```
.
├── app.js                      # Punto de entrada y configuración del servidor
├── package.json
├── .env.example
└── src/
    ├── config/
    │   ├── db.js               # Conexión a la base de datos
    │   ├── swagger.js          # Configuración de Swagger
    │   └── seed.js             # Carga de datos de prueba
    ├── controllers/            # Lógica de cada recurso
    ├── services/               # Reglas de negocio y cálculos
    ├── models/                 # Acceso a datos
    ├── routes/                 # Definición de rutas y documentación Swagger
    ├── middlewares/            # Autenticación, validaciones y manejo de errores
    ├── dtos/                   # Objetos de transferencia de datos
    └── utils/                  # Utilidades (respuestas, estadística)
```

---

## Manejo de errores y respuestas

La API cuenta con un middleware central de manejo de errores que captura las excepciones y devuelve una respuesta con el código HTTP apropiado y un mensaje descriptivo, evitando exponer detalles internos del sistema.

---

*Trabajo Final Integrador — Programación III — UNER 2026.*
