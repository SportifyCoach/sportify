/* CRUD MySQL per a “entrenador” */
const { getPool } = require('../db');

class EntrenadorRepository {
  async create(e) {
    const { dni, nom, cognoms, email, especialitat, experiencia } = e;
    const [res] = await getPool().query(
      `INSERT INTO entrenador
         (dni, nom, cognoms, email, especialitat, experiencia)
       VALUES (:dni, :nom, :cognoms, :email, :especialitat, :experiencia)`,
      { dni, nom, cognoms, email, especialitat, experiencia }
    );
    return this.findByDni(dni);
  }

  async findByDni(dni) {
    const [rows] = await getPool().query(
      `SELECT * FROM entrenador WHERE dni = :dni`,
      { dni }
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
      `SELECT * FROM entrenador ORDER BY :dni DESC`
    );
    return rows;
  }
}

module.exports = new EntrenadorRepository();