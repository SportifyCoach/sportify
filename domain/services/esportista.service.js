/*--------------------------------------------------
  Lògica de negoci / casos d'ús
--------------------------------------------------*/
const repo = require('../../data/repositories/EsportistaRepository');
const Esportista = require('../entities/Esportista');

class EsportistaService {
  async getAll() {
    const docs = await repo.findAll();
    return docs.map(d => new Esportista(d));
  }

  async getByDni(dni) {
    const doc = await repo.findByDni(dni);
    if (!doc) throw new Error('Esportista no trobat');
    return new Esportista(doc);
  }

  async add(data) {
    if (await repo.findByDni(data.dni))
      throw new Error('DNI ja registrat');
    const doc = await repo.create(data);
    return new Esportista(doc);
  }

  async updateContact(dni, { tlf, email }) {
    const upd = await repo.update(dni, { tlf, email });
    if (!upd) throw new Error('Esportista no trobat');
    return new Esportista(upd);
  }

  async remove(dni) {
    const ok = await repo.delete(dni);
    if (ok.deletedCount === 0) throw new Error('Esportista no trobat');
  }
}

module.exports = new EsportistaService();
