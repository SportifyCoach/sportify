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

  async updateLimit(id, newLimit) {
    const sessio = await repo.findById(id);
    if (!sessio) throw new Error('Sessió no trobada');
    if (newLimit < sessio.inscrits_count) 
      throw new Error(`El límit ha de ser ≥ ${sessio.inscrits_count}`);
    await repo.updateLimit(id, newLimit);
    return await repo.findById(id);
  }

  async getValoracionsPerEntrenador(dni) {
    return await repo.findValoracions(dni);
  }

  async rateSession(id, valoracio) {
    const val = parseInt(valoracio, 10);
    if (isNaN(val) || val < 1 || val > 10) {
      const err = new Error('La valoración debe ser un entero entre 1 y 10');
      err.status = 400;
      throw err;
    }
    await repo.updateRating(id, val);

    const data = await repo.findById(id);
    if (!data) {
      const err = new Error('Sesión no encontrada');
      err.status = 404;
      throw err;
    }

    return new Sessio(data);
  }
  async removeRating(id) {
    const exists = await repo.findById(id);
    if (!exists) throw new Error('Sessió no trobada');
  
    return repo.removeRating(id);
  }
  

}

module.exports = new SessioService();
