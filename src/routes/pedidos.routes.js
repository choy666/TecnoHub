// traza la ruta a dicha tabla
const express = require('express');
const { crear, listar } = require('../controllers/pedidos.controller');
const crearPedidoRules = require('../validators/pedidos');
const validate = require('../middlewares/validate');
const router = express.Router();
// Definición de rutas para get y post de usuarios
router.post('/', crearPedidoRules(), validate, crear);
router.get('/', listar);
//exporta el router a server.js
module.exports = router;