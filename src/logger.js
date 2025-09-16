//librería de logging en Node.js.
const { createLogger, format, transports } = require('winston');
//configuración del logger
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  //formato del msj
  format: format.combine(
    format.timestamp(),  //agrega fecha y hora
    format.errors({ stack: true }),  //detalles del error si ocurre
    format.json()  //convierte el log en JSON, ideal para guardar o enviar
  ),
  //destinos del log 
  transports: [
    new transports.Console({ format: format.simple() }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});
//exporta el log
module.exports = logger;
