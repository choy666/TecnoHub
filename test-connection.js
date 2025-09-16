// test-connection.js
const pool = require('./src/config/db');

(async () => {
  try {
    const res = await pool.query('SELECT NOW() AS now, version() AS version');
    console.log('✅ Conexión exitosa');
    console.log('Fecha/hora:', res.rows[0].now);
    console.log('Postgres:', res.rows[0].version);
  } catch (err) {
    console.error('❌ Error de conexión:');
    console.error('Mensaje:', err.message);
    console.error('Código:', err.code);
  } finally {
    await pool.end();
  }
})();
// node test-connection.js
// ejecutar el codigo en consola para comprobar la conexion a la base de datos