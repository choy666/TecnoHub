//Manejo de errores centralizados
const logger = require('../logger');

function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const payload = {
    error: err.isOperational ? err.message : 'Error interno del servidor'
  };
  if (!err.isOperational) logger.error(err.stack || err);
  res.status(status).json(payload);
}

function notFound(req, res, next) {
  res.status(404).json({ error: 'Recurso no encontrado' });
}

module.exports = { errorHandler, notFound };
