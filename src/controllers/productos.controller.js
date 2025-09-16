const productos = require('../models/productos');
const AppError = require('../utils/AppError');
const logger = require('../logger');
async function crear(req, res, next) {
  try {
    const { nombre, descripcion, precio, stock, img, categoria } = req.body;
    if (!nombre || precio == null || stock == null || !categoria) {
      throw new AppError('nombre, precio, stock y categoria son obligatorios', 400);
    }
    const nuevoProducto = await productos.crear(nombre, descripcion, precio, stock, img, categoria);
    logger.info(`Producto creado: ${nuevoProducto.nombre}`);
    res.json(nuevoProducto);
  } catch (err) {
    logger.error(`Error creando producto: ${err.message}`);
    next(err);
  }
}
async function listar(req, res, next) {
  try {
    const lista = await productos.listar();
    res.json(lista);
  } catch (err) {
    next(err);
  }
}
async function listarDestacados(req, res, next) {
  try {
    const lista = await productos.listarDestacados();
    res.json(lista);
  } catch (err) {
    next(err);
  }
}

async function buscarPorId(req, res) {
  const { id } = req.params;
  const producto = await productos.buscarPorId(id);
  if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
  res.json(producto);
}
module.exports = { crear, listar, listarDestacados, buscarPorId };