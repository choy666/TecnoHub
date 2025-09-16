jest.setTimeout(30000);
const request = require('supertest');
const { app } = require('../../src/server');
const pool = require('../../src/config/db');

// Mock a nivel de módulo para 'pg'
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn().mockResolvedValue({ rows: [{ id: 1, nombre: 'Test' }], rowCount: 1 }),
    connect: jest.fn(),
    on: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

let server;

beforeAll(() => {
  server = app.listen(0); // Inicia en un puerto aleatorio
});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
  await pool.end();
});

describe('🔍 Pruebas básicas LumenCommerce', () => {
  test('✅ Crear usuario válido', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, nombre: 'Juan Pérez' }] });
    const res = await request(app)
      .post('/api/usuarios')
      .send({
        nombre: 'Juan Pérez',
        email: `juan${Date.now()}@test.com`,
        passwordHash: '123456',
        rol: 'cliente'
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('id');
  });

  test('❌ Usuario inválido (email mal formado)', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .send({
        nombre: 'Juan',
        email: 'juan',
        passwordHash: '123456',
        rol: 'cliente'
      });
    expect([400, 422]).toContain(res.statusCode);
  });

  test('❌ Ruta inexistente → 404', async () => {
    const res = await request(app).get('/ruta/que/no/existe');
    expect(res.statusCode).toBe(404);
  });
});