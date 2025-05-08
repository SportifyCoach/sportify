/* CRUD MySQL pur (taula `sessio`) */
const { getPool } = require('../db');

class SessioRepository {
  async findAll() {
    const [rows] = await getPool().query('SELECT * FROM sessio ORDER BY date ASC');
    return rows;
  }

  async findById(id) {
    const [rows] = await getPool().query(
      'SELECT * FROM sessio WHERE id = :id',
      { id },
    );
    return rows[0];
  }

  async create(data) {
    const { date, limit_persones, disciplina, entrenador } = data;
    await getPool().query(
      `INSERT INTO sessio (date, limit_persones, disciplina, entrenador)
       VALUES (:date, :limit_persones, :disciplina, :entrenador)`,
      { date, limit_persones, disciplina, entrenador },
    );
    const newId = result.insertId;
    return this.findById(newId);
  }


  //todo el update
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


  //todo el delete
  async delete(dni) {
    const [res] = await getPool().query(
      'DELETE FROM esportista WHERE dni = :dni',
      { dni },
    );
    return { deletedCount: res.affectedRows };
  }
}

module.exports = new SessioRepository();
