const pool = require('../config/db');
async function crear(pedidoId, productoId, cantidad, precioUnitario) {
  const result = await pool.query(
    `INSERT INTO compra (pedido_id, producto_id, cantidad, precio_unitario)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [pedidoId, productoId, cantidad, precioUnitario]
  );
  return result.rows[0];
}
async function listar() {
  const result = await pool.query(
    `SELECT id, pedido_id, producto_id, cantidad, precio_unitario
     FROM compra
     ORDER BY id DESC`
  );
  return result.rows;
}
async function listaComprasPorPedido(pedidoId) {
  const result = await pool.query(
    `SELECT p.nombre AS producto, p.img, c.cantidad, c.precio_unitario
     FROM compra c
     JOIN producto p ON c.producto_id = p.id
     WHERE c.pedido_id = $1`,
    [pedidoId]
  );
  return result.rows;
}
module.exports = { crear, listar, listaComprasPorPedido };