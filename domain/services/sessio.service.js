/*--------------------------------------------------
  Lògica de negoci / casos d'ús
--------------------------------------------------*/
const repo = require('../../data/repositories/SessioRepository');
const Sessio = require('../entities/Sessio');

class SessioService {
  async getAll() {
    const docs = await repo.findAll();
    return docs.map(d => new Sessio(d));
  }

  async add(data) {
    const doc = await repo.create(data);
    return new Sessio(doc);
  }
  
  //todo update
  async updateContact(dni, { tlf, email }) {
    const upd = await repo.update(dni, { tlf, email });
    if (!upd) throw new Error('Esportista no trobat');
    return new Esportista(upd);
  }

  async remove(id) {
    const result = await repo.delete(id);
    if (result.deletedCount === 0) throw new Error('No es pot eliminar: la sessió no existeix o no és futura');
  }

  async getAvailable(filters) {
    const docs = await repo.findAvailable(filters);
    return docs.map(d => new Sessio(d));
  }
}

module.exports = new SessioService();
