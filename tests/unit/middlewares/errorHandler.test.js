require('../../helpers/env');
const express = require('express');
const request = require('supertest');
const logger = require('../../../src/logger');
const { errorHandler } = require('../../../src/middlewares/errorHandler');
const AppError = require('../../../src/utils/AppError');

jest.spyOn(logger, 'error').mockImplementation(() => {});

const buildApp = (routeHandler) => {
  const app = express();
  app.get('/boom', routeHandler);
  app.use(errorHandler);
  return app;
};

describe('errorHandler', () => {
  test('maneja errores operativos', async () => {
    const app = buildApp((req, res, next) => {
      next(new AppError('Recurso no encontrado', 404));
    });
    const res = await request(app).get('/boom');
    expect(res.status).toBe(404);
  });

  test('oculta detalles en producción', async () => {
    process.env.NODE_ENV = 'production';
    const app = buildApp(() => { throw new Error('Interno'); });
    const res = await request(app).get('/boom');
    expect(res.status).toBe(500);
  });
});