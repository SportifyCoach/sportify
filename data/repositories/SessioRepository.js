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


  
  async update(id, { limit_persones, disciplina, date, entrenador }) {
    await getPool().query(
      `UPDATE sessio
         SET limit_persones = COALESCE(:limit_persones,limit_persones),
             disciplina = COALESCE(:disciplina,disciplina),
             date = COALESCE(:date,date),
             entrenador = COALESCE(:entrenador,entrenador)
       WHERE id = :id`,
      { id, limit_persones, disciplina, date, entrenador },
    );
    return this.findById(id);
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
  async findValoracions(dni) {
    const query = `
        SELECT e.*
        FROM entrenament e
        JOIN sessio s ON e.sessio_id = s.id
        WHERE s.entrenador = :dni;
    `;
    const [rows] = await getPool.query(query, {dni});
    return rows;
  }
}

  

module.exports = new SessioRepository();
