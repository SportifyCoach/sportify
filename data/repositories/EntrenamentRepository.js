/* CRUD MySQL pur (taula `entrenament`) */
const { getPool } = require('../db');

class EntrenamentRepository {
  async findAll() {
    const [rows] = await getPool().query('SELECT * FROM entrenament ORDER BY id ASC');
    return rows;
  }

  async findById(id) {
    const [rows] = await getPool().query(
      'SELECT * FROM entrenament WHERE id = :id',
      { id },
    );
    return rows[0];
  }

  async findBySessionId(id) {
    //console.log("-------------",id,"-----------------");
    const [rows] = await getPool().query(
      'SELECT * FROM entrenament WHERE id = :id',
      { id },
    );
    return rows;
  }

  async create(data) {
    const { valoracio, sessio_id, esportista_dni } = data;
    await getPool().query(
      `INSERT INTO entrenament (valoracio, sessio_id, esportista_dni)
       VALUES (:valoracio, :sessio_id, :esportista_dni)`,
      { valoracio, sessio_id, esportista_dni },
    );
    const newId = result.insertId;
    return this.findById(newId);
  }
}

module.exports = new EntrenamentRepository();