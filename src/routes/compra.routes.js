// traza la ruta a dicha tabla
const express = require('express');
const { crear, listar } = require('../controllers/compra.controller');
const crearCompraRules = require('../validators/compra');
const validate = require('../middlewares/validate');
const router = express.Router();
// Definición de rutas para get y post de usuarios
router.post('/', crearCompraRules(), validate, crear);
router.get('/', listar);
//exporta el router a server.js
module.exports = router;