const repo = require('../../data/repositories/EntrenadorRepository');
const Entrenador = require('../entities/Entrenador');

class EntrenadorService {
  async add(data) {
    if (await repo.findByEmail(data.email))
      throw new Error('Ja existeix un entrenador amb aquest email');
    const doc = await repo.create(data);           // estat = 'pending' per defecte
    return new Entrenador(doc);
  }

  async list() {
    return (await repo.findAll()).map(d => new Entrenador(d));
  }
}

module.exports = new EntrenadorService();
