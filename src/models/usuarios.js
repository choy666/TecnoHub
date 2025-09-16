const pool = require('../config/db');
module.exports = {
  async crear(nombre, email, passwordHash, rol = 'cliente') {
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [nombre, email, passwordHash, rol]
    );
    return result.rows[0];
  },
  async listar() {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id');
    return result.rows;
  },
  async buscarPorId(id) {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
  }
};
// Modelo de usuarios con funciones para crear, listar y buscar usuarios por ID