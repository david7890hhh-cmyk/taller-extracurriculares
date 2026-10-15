const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Base de datos en memoria
const store = {
  talleres: [
    {
      id: 1,
      nombre: "Música y Guitarra",
      descripcion: "Aprende fundamentos de música y práctica de guitarra.",
      cupoMaximo: 15,
      cuposDisponibles: 15,
      instructor: "Carlos Pérez",
      horario: "Lunes y Miércoles 14:00 - 16:00",
      salon: "Salón de Música"
    },
    {
      id: 2,
      nombre: "Teatro y Expresión",
      descripcion: "Taller de expresión corporal y actuación.",
      cupoMaximo: 20,
      cuposDisponibles: 20,
      instructor: "María Gómez",
      horario: "Martes y Jueves 15:00 - 17:00",
      salon: "Auditorio Principal"
    }
  ],
  inscripciones: []
};

let nextTallerId = 3;
let nextInscripcionId = 1;

// --- ENDPOINTS DE LA API ---

// GET /api/talleres
app.get('/api/talleres', (req, res) => {
  res.json(store.talleres);
});

// GET /api/talleres/:id
app.get('/api/talleres/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const taller = store.talleres.find(t => t.id === id);
  if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
  res.json(taller);
});

// POST /api/talleres
app.post('/api/talleres', (req, res) => {
  const { nombre, descripcion, cupoMaximo, instructor, horario, salon } = req.body;
  if (!nombre || !cupoMaximo) {
    return res.status(400).json({ error: 'El nombre y el cupo máximo son obligatorios' });
  }
  const nuevoTaller = {
    id: nextTallerId++,
    nombre,
    descripcion: descripcion || '',
    cupoMaximo: parseInt(cupoMaximo, 10),
    cuposDisponibles: parseInt(cupoMaximo, 10),
    instructor: instructor || '',
    horario: horario || '',
    salon: salon || ''
  };
  store.talleres.push(nuevoTaller);
  res.status(201).json(nuevoTaller);
});

// PUT /api/talleres/:id
app.put('/api/talleres/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = store.talleres.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Taller no encontrado' });
  store.talleres[index] = { ...store.talleres[index], ...req.body };
  res.json(store.talleres[index]);
});

// DELETE /api/talleres/:id
app.delete('/api/talleres/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = store.talleres.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Taller no encontrado' });
  store.talleres.splice(index, 1);
  res.status(204).send();
});

// GET /api/inscripciones
app.get('/api/inscripciones', (req, res) => {
  res.json(store.inscripciones);
});

// POST /api/inscripciones
app.post('/api/inscripciones', (req, res) => {
  const { tallerId, estudianteNombre, estudianteCorreo } = req.body;
  if (!tallerId || !estudianteNombre || !estudianteCorreo) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }

  const taller = store.talleres.find(t => t.id === parseInt(tallerId, 10));
  if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
  if (taller.cuposDisponibles <= 0) return res.status(400).json({ error: 'Sin cupos disponibles' });

  const nuevaInscripcion = {
    id: nextInscripcionId++,
    tallerId: parseInt(tallerId, 10),
    estudianteNombre,
    estudianteCorreo,
    fechaInscripcion: new Date().toISOString()
  };

  store.inscripciones.push(nuevaInscripcion);
  taller.cuposDisponibles -= 1;
  res.status(201).json(nuevaInscripcion);
});

// DELETE /api/inscripciones/:id
app.delete('/api/inscripciones/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = store.inscripciones.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Inscripción no encontrada' });

  const borrada = store.inscripciones.splice(index, 1)[0];
  const taller = store.talleres.find(t => t.id === borrada.tallerId);
  if (taller) taller.cuposDisponibles += 1;

  res.status(200).json({ mensaje: 'Inscripción cancelada' });
});

// --- ARCHIVOS ESTÁTICOS Y FRONTEND ---
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://127.0.0.1:${PORT}`);
});