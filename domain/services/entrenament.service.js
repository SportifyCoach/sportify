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

  async update(id, valoracio) {
    const doc = await repo.update({id, valoracio});
    if (!doc) throw new Error('Entrenament no trobat');
    return new Entrenament(doc);
  }

  async deleteInscripcio(data) {
    const ok = await repo.delete(data);
    if (ok.deletedCount === 0) throw new Error('Entrenament no trobat');
    return ok;
  }
}

module.exports = new EntrenamentService();