// traza la ruta a dicha tabla
const express = require('express');
const { crear, listar } = require('../controllers/usuarios.controller');
const crearUsuarioRules = require('../validators/usuarios');
const validate = require('../middlewares/validate');
const router = express.Router();
// Definición de rutas para get y post de usuarios
router.get('/', listar); //devuelve datos 
router.post('/', crearUsuarioRules(), validate, crear); //envia datos
//exporta el router a server.js
module.exports = router;