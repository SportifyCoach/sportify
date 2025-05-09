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
  
  async updateContact(id, { limit_persones, disciplina, date, entrenador }) {
    const upd = await repo.update(id, { limit_persones, disciplina, date, entrenador });
    if (!upd) throw new Error('Sessio no trobada');
    return new Sessio(upd);
  }

  async remove(id) {
    const result = await repo.delete(id);
    if (result.deletedCount === 0) throw new Error('No es pot eliminar: la sessió no existeix o no és futura');
  }

  async getAvailable(filters) {
    const docs = await repo.findAvailable(filters);
    return docs.map(d => new Sessio(d));
  }

  async getValoracionsPerEntrenador(dni) {
    return await sessioRepository.findValoracions(dni);
  }
  
}

module.exports = new SessioService();
