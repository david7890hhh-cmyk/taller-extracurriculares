const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { getTallerById, updateTaller } = require('../data/talleres');

let nextInscripcionId = 1;

// GET /api/inscripciones
router.get('/', (req, res) => {
  res.json(store.inscripciones);
});

// POST /api/inscripciones
router.post('/', (req, res) => {
  const { tallerId, estudianteNombre, estudianteCorreo } = req.body;
  if (!tallerId || !estudianteNombre || !estudianteCorreo) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }

  const taller = getTallerById(parseInt(tallerId, 10));
  if (!taller) {
    return res.status(404).json({ error: 'Taller no encontrado' });
  }

  if (taller.cuposDisponibles <= 0) {
    return res.status(400).json({ error: 'Sin cupos disponibles' });
  }

  const nuevaInscripcion = {
    id: nextInscripcionId++,
    tallerId: parseInt(tallerId, 10),
    estudianteNombre,
    estudianteCorreo,
    fechaInscripcion: new Date().toISOString()
  };

  store.inscripciones.push(nuevaInscripcion);
  updateTaller(taller.id, { cuposDisponibles: taller.cuposDisponibles - 1 });

  res.status(201).json(nuevaInscripcion);
});

// DELETE /api/inscripciones/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = store.inscripciones.findIndex(i => i.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Inscripción no encontrada' });
  }

  const borrada = store.inscripciones.splice(index, 1)[0];
  const taller = getTallerById(borrada.tallerId);
  if (taller) {
    updateTaller(taller.id, { cuposDisponibles: taller.cuposDisponibles + 1 });
  }

  res.status(200).json({ mensaje: 'Inscripción cancelada' });
});

module.exports = router;