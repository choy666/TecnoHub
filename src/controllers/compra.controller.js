const compras = require('../models/compra');
const AppError = require('../utils/AppError');
const logger = require('../logger');
async function crear(req, res, next) {
  try {
    const { pedidoId, productoId, cantidad, precioUnitario } = req.body;
    if (!pedidoId || !productoId || !cantidad || precioUnitario == null) {
      throw new AppError('Todos los campos son obligatorios', 400);
    }
    const nuevaCompra = await compras.crear(pedidoId, productoId, cantidad, precioUnitario);
    logger.info(`Compra creada: Pedido ${pedidoId}, Producto ${productoId}, Cantidad ${cantidad}`);
    res.json(nuevaCompra);
  } catch (err) {
    logger.error(`Error creando compra: ${err.message}`);
    next(err);
  }
}
async function listar(req, res, next) {
  try {
    const lista = await compras.listar();
    res.json(lista);
  } catch (err) {
    next(err);
  }
}
module.exports = { crear, listar };