const { getTalleres, getTallerById, addTaller, updateTaller, deleteTaller } = require('../data/talleres');
const { getInscripcionesByTaller } = require('../data/inscripciones');

const getAllTalleres = (req, res) => {
  res.json(getTalleres());
};

const getTaller = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const taller = getTallerById(id);
  if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
  res.json(taller);
};

const createTaller = (req, res) => {
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
};

const updateTallerController = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tallerActualizado = updateTaller(id, req.body);
  if (!tallerActualizado) return res.status(404).json({ error: 'Taller no encontrado' });
  res.json(tallerActualizado);
};

const deleteTallerController = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const borrado = deleteTaller(id);
  if (!borrado) return res.status(404).json({ error: 'Taller no encontrado' });
  res.status(204).send();
};

const getInscripcionesDelTaller = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const taller = getTallerById(id);
  if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
  res.json(getInscripcionesByTaller(id));
};

module.exports = {
  getAllTalleres,
  getTaller,
  createTaller,
  updateTallerController,
  deleteTallerController,
  getInscripcionesDelTaller
};