/* CRUD MySQL pur (taula `esportista`) */
const { getPool } = require('../db');

class EsportistaRepository {
  async findAll() {
    const [rows] = await getPool().query('SELECT * FROM esportista');
    return rows;
  }

  async findByDni(dni) {
    const [rows] = await getPool().query(
      'SELECT * FROM esportista WHERE dni = :dni',
      { dni },
    );
    return rows[0];
  }

  async create(data) {
    const { dni, nom, cognom, email, telefon } = data;
    await getPool().query(
      `INSERT INTO esportista (dni, nom, cognom, email, telefon)
       VALUES (:dni, :nom, :cognom, :email, :telefon)`,
      { dni, nom, cognom, email, telefon },
    );
    return this.findByDni(dni);
  }

  async update(dni, { email, telefon }) {
    await getPool().query(
      `UPDATE esportista
         SET email = COALESCE(:email,email),
             telefon = COALESCE(:telefon,telefon)
       WHERE dni = :dni`,
      { dni, email, telefon },
    );
    return this.findByDni(dni);
  }

  async delete(dni) {
    const [res] = await getPool().query(
      'DELETE FROM esportista WHERE dni = :dni',
      { dni },
    );
    return { deletedCount: res.affectedRows };
  }
}

module.exports = new EsportistaRepository();
