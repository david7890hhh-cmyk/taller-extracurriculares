const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { getTalleres, getTallerById, addTaller, updateTaller, deleteTaller } = require('../data/talleres');

// GET /api/talleres
router.get('/', (req, res) => {
  res.json(getTalleres());
});

// GET /api/talleres/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const taller = getTallerById(id);
  if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
  res.json(taller);
});

// POST /api/talleres
router.post('/', (req, res) => {
  const { nombre, descripcion, cupoMaximo, instructor, horario, salon } = req.body;
  if (!nombre || !cupoMaximo) {
    return res.status(400).json({ error: 'El nombre y el cupo máximo son obligatorios' });
  }
  const nuevoTaller = addTaller({
    nombre,
    descripcion: descripcion || '',
    cupoMaximo: parseInt(cupoMaximo, 10),
    cuposDisponibles: parseInt(cupoMaximo, 10),
    instructor: instructor || '',
    horario: horario || '',
    salon: salon || ''
  });
  res.status(201).json(nuevoTaller);
});

// PUT /api/talleres/:id
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tallerActualizado = updateTaller(id, req.body);
  if (!tallerActualizado) return res.status(404).json({ error: 'Taller no encontrado' });
  res.json(tallerActualizado);
});

// DELETE /api/talleres/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const borrado = deleteTaller(id);
  if (!borrado) return res.status(404).json({ error: 'Taller no encontrado' });
  res.status(204).send();
});

// GET /api/talleres/:id/inscripciones
router.get('/:id/inscripciones', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const taller = getTallerById(id);
  if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
  const inscripciones = store.inscripciones.filter(i => i.tallerId === id);
  res.json(inscripciones);
});

module.exports = router;