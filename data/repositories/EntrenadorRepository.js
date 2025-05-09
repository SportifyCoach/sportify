const { getPool } = require('../db');

class EntrenadorRepository {
  async create(e) {
    const { dni, nom, cognoms, email, especialitat, experiencia } = e;
    await getPool().query(
      `INSERT INTO entrenador
         (dni, nom, cognoms, email, especialitat, experiencia, status)
       VALUES (:dni, :nom, :cognoms, :email, :especialitat, :experiencia, 'pendiente')`,
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
      `SELECT * FROM entrenador ORDER BY dni DESC`
    );
    return rows;
  }

  async update(dni, { especialitat, experiencia }) {
    await getPool().query(
      `UPDATE entrenador
         SET especialitat = COALESCE(:especialitat,especialitat),
             experiencia = COALESCE(:experiencia,experiencia)
       WHERE dni = :dni`,
      { dni, especialitat, experiencia },
    );
    return this.findByDni(dni);
  }

  async delete(dni) {
    if (!dni) throw new Error('DNI requerit');
    const [res] = await getPool().query(
      `DELETE FROM entrenador WHERE dni = :dni`,
      { dni }
    );
    return res.affectedRows;
  }

  async updateStatus(dni, status, motivo) {
    const [res] = await getPool().query(
      `UPDATE entrenador
         SET status       = :status,
             motivo_rebuig = :motivo
       WHERE dni = :dni`,
      { status, motivo, dni }
    );
    return res.affectedRows;
  }

}

module.exports = new EntrenadorRepository();