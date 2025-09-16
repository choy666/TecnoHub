const { body } = require('express-validator');

const crearProductosRules = () => [
  body('nombre')
    .notEmpty().withMessage('nombre es obligatorio')
    .isString().withMessage('nombre debe ser un texto plano')
    .custom(value => {
      if (typeof value !== 'string') throw new Error('nombre no puede ser un objeto');
      if (/<script.*?>.*?<\/script>/i.test(value)) throw new Error('nombre contiene etiquetas peligrosas');
      return true;
    }),

  body('descripcion')
    .notEmpty().withMessage('descripcion es obligatoria'),

  body('precio')
    .notEmpty().withMessage('precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('precio debe ser un número positivo'),

  body('stock')
    .notEmpty().withMessage('stock es obligatorio')
    .isInt({ min: 0 }).withMessage('stock debe ser un número entero positivo'),

  body('imagen')
    .optional()
    .isString().withMessage('imagen debe ser una URL válida'),

  body('categoria')
    .notEmpty().withMessage('categoria es obligatorio')
    .isString().withMessage('categoria debe ser un texto plano')
    .custom(value => {
      if (typeof value !== 'string') throw new Error('categoria no puede ser un objeto');
      if (/<script.*?>.*?<\/script>/i.test(value)) throw new Error('categoria contiene etiquetas peligrosas');
      return true;
    })
];
module.exports = crearProductosRules;