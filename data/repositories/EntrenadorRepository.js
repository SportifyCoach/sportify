/* CRUD MySQL per a “entrenador” */
const { getPool } = require('../db');

class EntrenadorRepository {
  async create(e) {
    const { nom, cognoms, email, especialitat, experiencia } = e;
    const [res] = await getPool().query(
      `INSERT INTO entrenador
         (nom, cognoms, email, especialitat, experiencia)
       VALUES (:nom, :cognoms, :email, :especialitat, :experiencia)`,
      { nom, cognoms, email, especialitat, experiencia }
    );
    return this.findById(res.insertId);
  }

  async findById(id) {
    const [rows] = await getPool().query(
      `SELECT * FROM entrenador WHERE id = :id`,
      { id }
    );
    return rows[0];
  }

  async findByEmail(email) {
    const [rows] = await getPool().query(
      `SELECT * FROM entrenador WHERE email = :email`,
      { email }
    );
    return rows[0];
  }

  async findAll() {
    const [rows] = await getPool().query(
      `SELECT * FROM entrenador ORDER BY created_at DESC`
    );
    return rows;
  }
}

module.exports = new EntrenadorRepository();