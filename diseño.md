Diseño — Sistema de Talleres Extracurriculares
1. Modelo de datos
Entidad: Taller
Campo	Tipo	Notas
id	número	autogenerado
nombre	texto	obligatorio
instructor	texto	obligatorio
cupoMaximo	número entero > 0	obligatorio
fecha	texto `AAAA-MM-DD`	obligatorio, debe ser una fecha real
Datos calculados que la API agrega al responder (no se guardan en el archivo):
`inscritos`: cantidad de inscripciones del taller.
`cuposDisponibles`: `cupoMaximo - inscritos`.
Entidad: Inscripción
Campo	Tipo	Notas
id	número	autogenerado
tallerId	número	llave foránea → `Taller.id`, obligatorio
estudiante	texto	obligatorio
fechaInscripcion	fecha ISO	se genera automáticamente
Relación
Taller 1 ——— N Inscripción. Un taller tiene muchas inscripciones; cada inscripción pertenece a un solo taller mediante `tallerId`.
Los cupos disponibles no se guardan, se calculan contando las inscripciones del taller. Así, al cancelar una inscripción el cupo se libera solo y no hay riesgo de que el número guardado quede desactualizado.
2. Persistencia
Los datos se guardan en `src/data/db.json` (se crea solo al iniciar el servidor):
```json
{
  "talleres": \[
    { "id": 1, "nombre": "Fotografía", "instructor": "Laura Gómez", "cupoMaximo": 20, "fecha": "2026-11-20" }
  ],
  "inscripciones": \[
    { "id": 1, "tallerId": 1, "estudiante": "Ana Pérez", "fechaInscripcion": "2026-10-10T15:30:00.000Z" }
  ]
}
```
`store.js` lee y escribe el archivo. `talleres.js` e `inscripciones.js` usan `store.js` para sus operaciones.
3. Rutas de la API
Método	Ruta	Qué hace	Códigos
GET	/talleres	Lista todos los talleres con `inscritos` y `cuposDisponibles`	200
GET	/talleres/:id	Obtiene un taller	200, 404
POST	/talleres	Crea un taller	201, 400
PUT	/talleres/:id	Edita un taller (valida que el cupo no baje de los inscritos)	200, 400, 404
DELETE	/talleres/:id	Elimina un taller (solo si no tiene inscripciones)	200, 400, 404
GET	/talleres/:id/inscripciones	Lista los inscritos de un taller y sus cupos disponibles	200, 404
GET	/inscripciones	Lista todas las inscripciones	200
POST	/inscripciones	Inscribe a un estudiante (valida taller, cupo y duplicado)	201, 400, 404
DELETE	/inscripciones/:id	Cancela una inscripción y libera el cupo	200, 404
Ejemplos de cuerpo (JSON):
`POST /talleres` → `{ "nombre": "Cerámica", "instructor": "Marta Ríos", "cupoMaximo": 15, "fecha": "2026-11-20" }`
`POST /inscripciones` → `{ "tallerId": 1, "estudiante": "Ana Pérez" }`
4. Regla de negocio de la relación (inscribir)
Orden de las validaciones al llamar `POST /inscripciones`:
Faltan `tallerId` o `estudiante` → 400.
El taller no existe → 404.
Inscritos ≥ `cupoMaximo` → 400 «El taller ya no tiene cupos disponibles».
El estudiante ya está inscrito en ese taller → 400.
Todo correcto → se crea la inscripción y responde 201.
5. Errores
Todas las respuestas de error tienen la forma `{ "error": "mensaje claro" }`. Un JSON mal escrito en la petición también responde en JSON con código 400.
6. Interfaz web (`public/index.html`)
Una sola página que consume la API con `fetch` y construye el DOM con JavaScript:
Inicio: contadores de talleres, cupos libres e inscritos.
Talleres: tarjetas con barra de cupos, buscador, botón para ver los inscritos (con opción de cancelar), editar y eliminar.
Inscribirse: formulario con la lista de talleres y el nombre del estudiante; muestra si la operación tuvo éxito o el error de la API.
Gestionar: formulario para crear o editar talleres.
Después de cada acción la página vuelve a pedir los datos a la API, para mostrar siempre el estado real.
7. Estructura de carpetas
```
/proyecto
  /src
    /data
      db.json                     (se crea solo)
      store.js
      talleres.js
      inscripciones.js
    /controllers
      talleresController.js
      inscripcionesController.js
    /routes
      talleres.js
      inscripciones.js
  /public
    index.html
  /scripts
    probar.js                     (pruebas automáticas de la API)
  index.js
  package.json
  requisitos.md
  planeacion.md
  diseño.md
  pruebas.md
  README.md
```