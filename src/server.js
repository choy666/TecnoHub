// módulos y constantes
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./logger'); // Winston
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// rutas
const usuariosRoutes = require('./routes/usuarios.routes');
const productosRoutes = require('./routes/productos.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const compraRoutes = require('./routes/compra.routes');
const ticketRoutes = require('./routes/ticket.routes'); // 

// creación y activación del servidor
const app = express();

// middlewares globales
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como aplicaciones móviles o curl)
    if (!origin) return callback(null, true);
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200 // Algunos navegadores antiguos (IE11, varios SmartTVs) se bloquean con 204
};
app.use(cors(corsOptions));
app.use(express.json());

// Morgan para loguear cada request en consola
app.use(morgan('dev'));

// Middleware para registrar cada request en Winston
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Montaje de rutas con prefijo
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/compra', compraRoutes);
app.use('/api/tickets', ticketRoutes); // 

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Bienvenido a LumenCommerce API' });
});

// Healthcheck endpoint para Vercel/Docker
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Middlewares de error
app.use(notFound);
app.use(errorHandler);

// No se levanta el servidor aquí para que sea compatible con Vercel
module.exports = { app };