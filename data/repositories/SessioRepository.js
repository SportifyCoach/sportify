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
    const [result] = await getPool().query(
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

  async delete(id) {
    const conn = getPool();
  
    // Elimina entrenaments relacionats
    await conn.query(
      'DELETE FROM entrenament WHERE sessio_id = :id',
      { id }
    );
  
    // Ara sí, elimina la sessió
    const [res] = await conn.query(
      'DELETE FROM sessio WHERE id = :id AND date > NOW()',
      { id }
    );
  
    return { deletedCount: res.affectedRows };
  }

  async findAvailable({ disciplina, entrenador, date } = {}) {
    let query = `
      SELECT *
      FROM sessio
      WHERE date > NOW()
    `;
  
    const params = {};
  
    if (disciplina) {
      query += ' AND disciplina = :disciplina';
      params.disciplina = disciplina;
    }
  
    if (entrenador) {
      query += ' AND entrenador = :entrenador';
      params.entrenador = entrenador;
    }
  
    if (date) {
      query += ' AND DATE(date) = :date';
      params.date = date;
    }
  
    query += ' ORDER BY date ASC';
  
    const [rows] = await getPool().query(query, params);
    return rows;
  }
}

module.exports = new SessioRepository();
