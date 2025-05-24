/* CRUD MySQL pur (taula `disciplina`) */
const { getPool } = require('../db');

class DisciplinaRepository {
  async findAll() {
    const [rows] = await getPool().query('SELECT * FROM disciplina ORDER BY nom ASC');
    return rows;
  }

  async findByNom(nom) {
    const [rows] = await getPool().query(
      'SELECT * FROM disciplina WHERE nom = :nom',
      { nom },
    );
    return rows[0];
  }

  async create(data) {
    const { nom, espai } = data;
    await getPool().query(
      `INSERT INTO disciplina (nom, espai)
       VALUES (:nom, :espai)`,
      { nom, espai },
    );
    return this.findByNom(nom);
  }

  async update(nom, { espai }) {
    await getPool().query(
      `UPDATE disciplina
         SET espai = COALESCE(:espai,espai)
       WHERE nom = :nom`,
      { nom, espai },
    );
    return this.findByNom(nom);
  }

  async delete(nom) {
    const [res] = await getPool().query(
      'DELETE FROM disciplina WHERE nom = :nom',
      { nom },
    );
    return { deletedCount: res.affectedRows };
  }
}

module.exports = new DisciplinaRepository();
