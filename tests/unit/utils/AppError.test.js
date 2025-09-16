const AppError = require('../../../src/utils/AppError');

describe('AppError', () => {
  test('crea error operativo con status y mensaje', () => {
    const err = new AppError('No encontrado', 404);
    expect(err.statusCode).toBe(404);
    expect(err.isOperational).toBe(true);
  });

  test('usa 500 por defecto', () => {
    const err = new AppError('Fallo interno');
    expect(err.statusCode).toBe(500);
  });
});