const productos = require('../models/productos');
const AppError = require('../utils/AppError');
const logger = require('../logger');

async function crear(req, res, next) {
  try {
    const { nombre, descripcion, precio, stock, img, categoria, destacado } = req.body;
    
    // Validación de campos obligatorios
    if (!nombre || precio == null || stock == null || !categoria) {
      throw new AppError('Nombre, precio, stock y categoría son campos obligatorios', 400);
    }

    // Validación de tipos de datos
    if (isNaN(precio) || isNaN(stock)) {
      throw new AppError('Precio y stock deben ser valores numéricos', 400);
    }

    const nuevoProducto = await productos.crear(
      nombre, 
      descripcion, 
      parseFloat(precio), 
      parseInt(stock, 10), 
      img || null, 
      categoria,
      Boolean(destacado)
    );
    
    logger.info(`Producto creado: ${nuevoProducto.id} - ${nuevoProducto.nombre}`);
    res.status(201).json({
      status: 'success',
      data: nuevoProducto
    });
  } catch (err) {
    logger.error(`Error creando producto: ${err.message}`, { error: err.stack });
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const lista = await productos.listar();
    res.json({
      status: 'success',
      results: lista.length,
      data: lista
    });
  } catch (err) {
    logger.error('Error listando productos', { error: err.stack });
    next(new AppError('Error al obtener la lista de productos', 500));
  }
}

async function listarDestacados(req, res, next) {
  try {
    const lista = await productos.listarDestacados();
    res.json({
      status: 'success',
      results: lista.length,
      data: lista
    });
  } catch (err) {
    logger.error('Error listando productos destacados', { error: err.stack });
    next(new AppError('Error al obtener productos destacados', 500));
  }
}

async function buscarPorId(req, res, next) {
  try {
    const { id } = req.params;
    
    if (!id) {
      throw new AppError('Se requiere un ID de producto', 400);
    }

    const producto = await productos.buscarPorId(id);
    
    if (!producto) {
      throw new AppError('Producto no encontrado', 404);
    }

    res.json({
      status: 'success',
      data: producto
    });
  } catch (err) {
    logger.error(`Error buscando producto ID: ${req.params.id}`, { error: err.stack });
    next(err);
  }
}

module.exports = { 
  crear, 
  listar, 
  listarDestacados, 
  buscarPorId 
};