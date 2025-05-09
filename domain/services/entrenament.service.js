/*--------------------------------------------------
  Lògica de negoci / casos d'ús
--------------------------------------------------*/
const repo = require('../../data/repositories/EntrenamentRepository');
const Entrenament = require('../entities/Entrenament');

class EntrenamentService {
  async getAll() {
    const docs = await repo.findAll();
    return docs.map(d => new Entrenament(d));
  }

  async getById(id) {
    const docs = await repo.findById(id);
    return docs.map(d => new Entrenament(d));
  }

  async getBySessionId(id) {
    const docs = await repo.findBySessionId(id);
    return docs.map(d => new Entrenament(d));
  }

  async add(data) {
    const doc = await repo.create(data);
    return new Entrenament(doc);
  }
}

module.exports = new EntrenamentService();