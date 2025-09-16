const { body } = require('express-validator');

const crearPedidosRules = () => [
  body('usuarioId')
    .notEmpty().withMessage('usuarioId es obligatorio')
    .isInt({ min: 1 }).withMessage('usuarioId debe ser un número entero positivo')
];

module.exports = crearPedidosRules;
