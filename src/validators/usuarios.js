const { body } = require('express-validator');

const crearUsuariosRules = () => [
  body('nombre')
    .notEmpty().withMessage('nombre es obligatorio')
    .isString().withMessage('nombre debe ser texto plano')
    .custom(value => {
      if (typeof value !== 'string') throw new Error('nombre no puede ser un objeto');
      return true;
    }),

  body('email')
    .notEmpty().withMessage('email es obligatorio')
    .isEmail().withMessage('email debe ser válido'),

  body('passwordHash')
    .notEmpty().withMessage('contraseña es obligatoria')
    .isString().withMessage('contraseña debe ser texto plano'),

  body('rol')
    .notEmpty().withMessage('rol es obligatorio')
    .isIn(['cliente', 'admin']).withMessage('rol debe ser cliente o admin')
];

module.exports = crearUsuariosRules;
