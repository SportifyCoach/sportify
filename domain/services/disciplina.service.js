/*--------------------------------------------------
  Lògica de negoci / casos d'ús
--------------------------------------------------*/
const repo = require('../../data/repositories/DisciplinaRepository');
const Disciplina = require('../entities/Disciplina');

class DisciplinaService {
  async getAll() {
    const docs = await repo.findAll();
    return docs.map(d => new Disciplina(d));
  }

  async add(data) {
    if (await repo.findByNom(data.nom))
      throw new Error('Nom ja registrat');
    const doc = await repo.create(data);
    return new Disciplina(doc);
  }

  async updateSpace(nom, { espai }) {
    const upd = await repo.update(nom, { espai });
    if (!upd) throw new Error('Disciplina no trobada');
    return new Disciplina(upd);
  }

  async remove(nom) {
    const ok = await repo.delete(nom);
    if (ok.deletedCount === 0) throw new Error('Disciplina no trobada');
  }
}

module.exports = new DisciplinaService();
