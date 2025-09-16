const pool = require('../config/db');
module.exports = {
  // Crear producto con imagen
  async crear(nombre, descripcion, precio, stock, img, categoria) {
    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock, img, categoria)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, descripcion, precio, stock, img, categoria]
    );
    return result.rows[0];
  },
  // Listar todos los productos
  async listar() {
    const result = await pool.query('SELECT * FROM productos ORDER BY id');
    return result.rows;
  },
  // Buscar producto por ID
  async buscarPorId(id) {
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    return result.rows[0];
  },
  // Listar productos destacados
  async listarDestacados() {
    try {
      const result = await pool.query("SELECT * FROM productos WHERE categoria = 'Destacado' ORDER BY id");
      
      // Si no hay productos destacados, devolver algunos productos de ejemplo
      if (result.rows.length === 0) {
        console.log('No se encontraron productos destacados, devolviendo productos de ejemplo');
        return [
          {
            id: 1,
            nombre: 'Producto Destacado 1',
            descripcion: 'Descripción del producto destacado 1',
            precio: 9999,
            stock: 10,
            img: '/img/cat1.jpeg',
            categoria: 'Destacado'
          },
          {
            id: 2,
            nombre: 'Producto Destacado 2',
            descripcion: 'Descripción del producto destacado 2',
            precio: 14999,
            stock: 5,
            img: '/img/cat2.jpeg',
            categoria: 'Destacado'
          }
        ];
      }
      
      return result.rows;
    } catch (error) {
      console.error('Error en listarDestacados:', error);
      throw error;
    }
  }
};

// Modelo de productos con funciones para crear, listar y buscar productos por ID