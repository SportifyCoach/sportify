const { getPool } = require('../db');

class InscripcioRepository {
  async exists(dni, sessio_id) {
    const [rows] = await getPool().query(
      `SELECT 1 FROM inscripcio WHERE esportista_dni = ? AND sessio_id = ?`,
      [dni, sessio_id]
    );
    return rows.length > 0;
  }

  async countInSession(sessio_id) {
    const [rows] = await getPool().query(
      `SELECT COUNT(*) AS total FROM inscripcio WHERE sessio_id = ?`,
      [sessio_id]
    );
    return rows[0].total;
  }

  async existsSameDay(dni, date) {
    const [rows] = await getPool().query(
      `SELECT 1
       FROM inscripcio i
       JOIN sessio s ON i.sessio_id = s.id
       WHERE i.esportista_dni = ? AND DATE(s.date) = DATE(?)`,
      [dni, date]
    );
    return rows.length > 0;
  }

  async insert(dni, sessio_id) {
    await getPool().query(
      `INSERT INTO inscripcio (esportista_dni, sessio_id) VALUES (?, ?)`,
      [dni, sessio_id]
    );
  }

  async findAll() {
    const [rows] = await getPool().query(`
      SELECT i.esportista_dni, i.sessio_id, s.date, s.disciplina
      FROM inscripcio i
      JOIN sessio s ON i.sessio_id = s.id
      ORDER BY s.date ASC
    `);
    return rows;
  }

  async findBySessio(sessio_id) {
    const [rows] = await getPool().query(`
      SELECT e.dni, e.nom, e.cognom
      FROM inscripcio i
      JOIN esportista e ON i.esportista_dni = e.dni
      WHERE i.sessio_id = :sessio_id
    `, { sessio_id });
    return rows;
  }
}

module.exports = new InscripcioRepository();
