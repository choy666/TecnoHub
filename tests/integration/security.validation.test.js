const request = require('supertest');
const { app } = require('../../src/server');
const pool = require('../../src/config/db');

// Mock a nivel de módulo para 'pg'
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    connect: jest.fn(),
    on: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

let server;

beforeAll(() => {
  server = app.listen(0);
});

afterAll(async () => {
  await new Promise(resolve => server.close(resolve));
  await pool.end();
});

describe('🛡️ Seguridad y validación', () => {
  test('bloquea NoSQL injection en nombre y categoria', async () => {
    const res = await request(app).post('/api/productos').send({
      nombre: { $gt: '' },
      descripcion: 'Intento malicioso',
      precio: 100,
      stock: 1,
      imagen: 'https://i.postimg.cc/NCgcPVvn/1.png',
      categoria:{ $gt: '' }
    });

    expect([400, 422]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('error');
  });

  test('bloquea XSS básico en nombre y categoria', async () => {
    const res = await request(app).post('/api/productos').send({
      nombre: '<script>alert("xss")</script>',
      descripcion: 'Malicioso',
      precio: 100,
      stock: 1,
      imagen: 'https://i.postimg.cc/NCgcPVvn/1.png',
      categoria: '<script>alert("xss")</script>'
    });

    expect([400, 422]).toContain(res.statusCode); // ← antes decía 200
    expect(res.body).toHaveProperty('error');
  });

  test('bloquea tipos incorrectos en precio y stock', async () => {
    const res = await request(app).post('/api/productos').send({
      nombre: 'Producto seguro',
      descripcion: 'Test',
      precio: 'caro',
      stock: 'mucho',
      imagen: 'https://i.postimg.cc/NCgcPVvn/1.png',
      categoria: "Test"
    });

    expect([400, 422]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('error');
  });
});