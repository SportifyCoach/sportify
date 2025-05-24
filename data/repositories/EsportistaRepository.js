/* CRUD MySQL pur (taula `esportista`) */
const { getPool } = require('../db');

class EsportistaRepository {
  async findAll() {
    const [rows] = await getPool().query('SELECT * FROM esportista ORDER BY dni ASC');
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
    const { dni, nom, cognom, tlf, email } = data;
    await getPool().query(
      `INSERT INTO esportista (dni, nom, cognom, tlf, email)
       VALUES (:dni, :nom, :cognom, :tlf, :email)`,
      { dni, nom, cognom, tlf, email },
    );
    return this.findByDni(dni);
  }

  async update(dni, { email, tlf }) {
    await getPool().query(
      `UPDATE esportista
         SET email = COALESCE(:email,email),
             tlf = COALESCE(:tlf,tlf)
       WHERE dni = :dni`,
      { dni, email, tlf },
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
