const pool = require('../config/db');

module.exports = {
  async crear(usuarioId, estado = 'pendiente') {
    const result = await pool.query(
      `INSERT INTO pedidos (usuario_id, estado)
       VALUES ($1, $2) RETURNING *`,
      [usuarioId, estado]
    );
    return result.rows[0];
  },

  async listar() {
    const result = await pool.query('SELECT * FROM pedidos ORDER BY id');
    return result.rows;
  },

  async buscarPorId(id) {
    const result = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
    return result.rows[0];
  }
};
// Modelo de pedidos con funciones para crear, listar y buscar pedidos por ID