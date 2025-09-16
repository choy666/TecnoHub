const usuarios = require('../models/usuarios');
const AppError = require('../utils/AppError');
const logger = require('../logger');
async function crear(req, res, next) {
  try {
    const { nombre, email, passwordHash, rol } = req.body;
    if (!nombre || !email || !passwordHash || !rol) {
      throw new AppError('Todos los campos son obligatorios', 400);
    }
    const nuevoUsuario = await usuarios.crear(nombre, email, passwordHash, rol);
    logger.info(`Usuario creado: ${nuevoUsuario.email}`);
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    logger.error(`Error creando usuario: ${err.message}`);
    next(err);
  }
}
async function listar(req, res, next) {
  try {
    const lista = await usuarios.listar();
    res.json(lista);
  } catch (err) {
    next(err);
  }
}
module.exports = { crear, listar };