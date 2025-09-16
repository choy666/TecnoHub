const pedidos = require('../models/pedidos');
const AppError = require('../utils/AppError');
const logger = require('../logger');
async function crear(req, res, next) {
  try {
    const { usuarioId } = req.body;
    if (!usuarioId) throw new AppError('usuarioId es obligatorio', 400);

    const nuevoPedido = await pedidos.crear(usuarioId); // estado por defecto en DB
    logger.info(`Pedido creado: ID ${nuevoPedido.id} para usuario ${usuarioId}`);
    res.json(nuevoPedido);
  } catch (err) {
    logger.error(`Error creando pedido: ${err.message}`);
    next(err);
  }
}
async function listar(req, res, next) {
  try {
    const lista = await pedidos.listar();
    res.json(lista);
  } catch (err) {
    next(err);
  }
}
module.exports = { crear, listar };