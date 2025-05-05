const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "ubiwan.epsevg.upc.edu",
    port: '3306',
    user: "amep10",
    password: "iKae6iePa7aiH6",
    database: "amep10"
})

function connect() {
    return connection
      .promise()
      .connect()
      .then(() => {
        console.log('[DB] Connexió MySQL correcta');
        return connection;          // retornem la connexió per si la vols usar
      });
  }
  
module.exports = { connect, connection };