const mysql = require('mysql2/promise');

let pool;

function connect() {
  pool = mysql.createPool({
    host: "ubiwan.epsevg.upc.edu",
    port: '3306',
    user: "amep10",
    password: "iKae6iePa7aiH6",
    database: "amep10",
    namedPlaceholders: true, // para poder usar ":dni", etc.
  });

  return pool.getConnection()
    .then(conn => {
      console.log('[DB] Connexió MySQL correcta');
      conn.release();
    });
}

function getPool() {
  if (!pool) throw new Error('DB no inicialitzada!');
  return pool;
}

module.exports = { connect, getPool };