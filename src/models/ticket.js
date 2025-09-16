// models/tickets.js
const pool = require('../config/db');

async function crear({ pedido_id, cliente_nombre, cliente_email, total, pago = 'efectivo', estado = 'pendiente' }) {
  const result = await pool.query(
    `INSERT INTO tickets (pedido_id, cliente_nombre, cliente_email, total, pago, estado)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [pedido_id, cliente_nombre, cliente_email, total, pago, estado]
  );
  return result.rows[0];
}

async function listar() {
  const result = await pool.query('SELECT * FROM tickets ORDER BY fecha DESC');
  return result.rows;
}

async function actualizarPago(id, { pago, estado }) {
  const result = await pool.query(
    `UPDATE tickets SET pago = $1, estado = $2 WHERE id = $3 RETURNING *`,
    [pago, estado, id]
  );
  return result.rows[0];
}

module.exports = { crear, listar, actualizarPago };