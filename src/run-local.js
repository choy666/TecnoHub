const { app } = require('./server');
const logger = require('./logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`🚀 Servidor local escuchando en puerto ${PORT}`);
});
