const http = require('http');

function hacerPeticion(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data ? JSON.parse(data) : {} }));
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function ejecutarPruebas() {
  console.log('=== INICIANDO PRUEBAS DE LA API ===\n');

  console.log('1. GET /api/talleres');
  const t1 = await hacerPeticion('/api/talleres');
  console.log('Status:', t1.status, '| Talleres encontrados:', t1.body.length);

  console.log('\n2. POST /api/talleres (Crear nuevo taller)');
  const nuevoTaller = { nombre: "Ajedrez Pro", descripcion: "Estrategia", cupoMaximo: 10, instructor: "Ana", horario: "Viernes", salon: "101" };
  const t2 = await hacerPeticion('/api/talleres', 'POST', nuevoTaller);
  console.log('Status:', t2.status, '| Taller creado:', t2.body.nombre);

  console.log('\n3. POST /api/inscripciones (Inscribir estudiante)');
  const nuevaInscripcion = { tallerId: t2.body.id, estudianteNombre: "Carlos D.", estudianteCorreo: "carlos@test.com" };
  const t3 = await hacerPeticion('/api/inscripciones', 'POST', nuevaInscripcion);
  console.log('Status:', t3.status, '| Inscripción id:', t3.body.id);

  console.log('\n=== PRUEBAS FINALIZADAS EXITOSAMENTE ===');
}

ejecutarPruebas().catch(err => console.error('Error en la prueba:', err.message));