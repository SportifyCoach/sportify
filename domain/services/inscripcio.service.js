const repo = require('../../data/repositories/InscripcioRepository');
const sessioRepo = require('../../data/repositories/SessioRepository'); // ← para obtener la fecha y el límite
const Inscripcio = require('../entities/Inscripcio');

class InscripcioService {
  async inscripcio(dni, sessio_id) {
    if (await repo.exists(dni, sessio_id)) {
      throw new Error('Ja estàs inscrit en aquesta sessió');
    }

    const sessio = await sessioRepo.findById(sessio_id);
    if (!sessio) {
      throw new Error('Sessió inexistent');
    }

    const now = new Date();
    const sessioDate = new Date(sessio.date);
    if (sessioDate < now) {
      throw new Error('No et pots inscriure a una sessió passada');
    }

    const actuals = await repo.countInSession(sessio_id);
    if (actuals >= sessio.limit_persones) {
      throw new Error('Sessió plena');
    }

    const jaApuntat = await repo.existsSameDay(dni, sessio.date);
    if (jaApuntat) {
      throw new Error('Ja estàs inscrit en una sessió aquest dia');
    }

    await repo.insert(dni, sessio_id);
  }

  async getAll() {
    const rows = await repo.findAll();
    return rows.map(r => new Inscripcio(r));
  }
}

module.exports = new InscripcioService();
