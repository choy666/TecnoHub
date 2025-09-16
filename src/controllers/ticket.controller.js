const pedidos = require('../models/pedidos');
const compra = require('../models/compra');
const tickets = require('../models/ticket'); // ✅ plural

/**
 * Crear ticket (checkout completo)
 * Recibe: { clienteNombre, clienteEmail, items: [{ productoId, cantidad, precio }], pago }
 */
async function crear(req, res, next) {
  try {
    const { clienteNombre, clienteEmail, items, pago } = req.body;

    // Debug para ver qué llega desde el frontend
    console.log("DEBUG - Valor de pago recibido desde frontend:", pago);

    // Validaciones básicas
    if (!clienteNombre || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cliente y items son obligatorios' });
    }

    // 🧪 MODO PRUEBA: usar usuario genérico
    // En producción, reemplazar por: const usuarioId = req.user.id;
    const PUBLICO_GENERAL_ID = 49; // ID real del usuario "Público General" en tu tabla usuarios
    const pedido = await pedidos.crear(PUBLICO_GENERAL_ID, 'pendiente');

    // Crear compras asociadas al pedido
    for (const item of items) {
      if (!item.productoId || !item.cantidad || !item.precio) {
        return res.status(400).json({ error: 'Cada item debe tener productoId, cantidad y precio' });
      }
      await compra.crear(pedido.id, item.productoId, item.cantidad, item.precio);
    }

    // Calcular total
    const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

    // Crear ticket vinculado al pedido real
    // Forzamos pago a 'efectivo' para evitar error del CHECK constraint
    const ticket = await tickets.crear({
      pedido_id: pedido.id,
      cliente_nombre: clienteNombre,
      cliente_email: clienteEmail || null,
      total,
      pago: 'efectivo', // ← siempre válido en tu constraint actual
      estado: 'pendiente'
    });

    res.status(201).json(ticket);

  } catch (err) {
    next(err);
  }
}

/**
 * Listar todos los tickets
 */
async function listar(req, res, next) {
  try {
    const lista = await tickets.listar();
    res.json(lista);
  } catch (err) {
    next(err);
  }
}

module.exports = { crear, listar };