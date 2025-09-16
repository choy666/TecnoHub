//librería de logging en Node.js.
const { createLogger, format, transports } = require('winston');

// Determinar si estamos en producción (Vercel)
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

// Configuración base del logger
const loggerConfig = {
  level: isProduction ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  // Por defecto solo usamos consola
  transports: [
    new transports.Console({ 
      format: format.combine(
        format.colorize(),
        format.simple()
      ) 
    })
  ]
};

// Solo agregar archivos de log en desarrollo local
if (!isProduction) {
  const fs = require('fs');
  const path = require('path');
  
  // Crear directorio de logs si no existe (solo en desarrollo)
  const logDir = 'logs';
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  
  // Agregar transportes de archivo solo en desarrollo
  loggerConfig.transports.push(
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDir, 'combined.log') })
  );
}

// Crear el logger
const logger = createLogger(loggerConfig);

// Exportar el logger
module.exports = logger;
