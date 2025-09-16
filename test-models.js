const usuarios = require('./src/models/usuarios');
const productos = require('./src/models/productos');
const pedidos = require('./src/models/pedidos');
const compra = require('./src/models/compra');
const tickets = require('./src/models/ticket'); // ✅ nuevo

(async () => {
  try {
    // 1️⃣ Crear usuario
    const u = await usuarios.crear('Cliewnte Test', 'clienwqte@test.com', 'hash123');

    // 2️⃣ Crear producto
    const p = await productos.crear(
      'Producto Test',
      'Descripción',
      100,
      5,
      'https://i.postimg.cc/NGCgPVrn/1.png',
      'Test'
    );

    // 3️⃣ Crear pedido
    const ped = await pedidos.crear(u.id, 'pendiente');

    // 4️⃣ Crear compra (línea del pedido)
    const c = await compra.crear(ped.id, p.id, 2, p.precio);

    // 5️⃣ Crear ticket (fase 3)
    const t = await tickets.crear({
      pedido_id: ped.id,
      cliente_nombre: u.nombre,
      cliente_email: u.email,
      total: p.precio * 2,
      pago: 'efectivo',
      estado: 'pendiente'
    });

    console.log({ u, p, ped, c, t });
  } catch (err) {
    console.error(err);
  }
})();
// test-models.js
// ejecutar el codigo en consola para probar los modelos y sus funciones
// node test-models.js
// npm run test:cov