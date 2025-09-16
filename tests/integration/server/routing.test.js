const request = require('supertest');
const { app } = require('../../../src/server');

describe('Routing', () => {
  test('404 para rutas desconocidas', async () => {
    const res = await request(app).get('/no-existe');
    expect(res.status).toBe(404);
  });
});