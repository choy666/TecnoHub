const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const mapped = errors.array().map(e => ({ field: e.param, msg: e.msg }));
  return res.status(400).json({ error: 'Validación fallida', details: mapped });
}

module.exports = validate;