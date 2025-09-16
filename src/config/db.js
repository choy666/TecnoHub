require('dotenv').config();
const { Pool } = require('pg');
const logger = require('../logger');

// Validar la variable de entorno DATABASE_URL
if (!process.env.DATABASE_URL) {
  const errorMsg = 'Falta la variable de entorno crítica para la base de datos: DATABASE_URL';
  logger.error(errorMsg);
  throw new Error(errorMsg);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  keepAlive: true, // Mantener conexiones vivas en un entorno de contenedor
  ssl: {
    rejectUnauthorized: false, // Necesario para algunas conexiones serverless como Neon
  },
});

// Loguear estado de la conexión
pool.on('connect', () => {
  logger.info('Conexión a la base de datos establecida.');
});

pool.on('error', (err) => {
  logger.error(`Error inesperado en el cliente de la base de datos: ${err}`);
  process.exit(-1);
});

module.exports = pool;