// traza la ruta a dicha tabla
const express = require('express');
const { crear, listar, buscarPorId, listarDestacados } = require('../controllers/productos.controller');
const crearProductoRules = require('../validators/productos');
const validate = require('../middlewares/validate');
const router = express.Router();
// Definición de rutas para get y post de usuarios
router.post('/', crearProductoRules(), validate, crear);
router.get('/destacados', listarDestacados); // Debe ir antes de /:id
router.get('/:id', buscarPorId);
router.get('/', listar);
//exporta el router a server.js
module.exports = router;