const { body } = require('express-validator');

const crearComprasRules = () => [
  body('pedidoId')
    .notEmpty().withMessage('pedidoId es obligatorio')
    .isInt({ min: 1 }).withMessage('pedidoId debe ser un número entero positivo'),

  body('productoId')
    .notEmpty().withMessage('productoId es obligatorio')
    .isInt({ min: 1 }).withMessage('productoId debe ser un número entero positivo'),

  body('cantidad')
    .notEmpty().withMessage('cantidad es obligatoria')
    .isInt({ min: 1 }).withMessage('cantidad debe ser un número entero positivo'),

  body('precioUnitario')
    .notEmpty().withMessage('precioUnitario es obligatorio')
    .isFloat({ min: 0 }).withMessage('precioUnitario debe ser un número positivo')
];

module.exports = crearComprasRules;