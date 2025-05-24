const repo = require('../../data/repositories/EntrenadorRepository');
const Entrenador = require('../entities/Entrenador');

class EntrenadorService {
  async add(data) {
    if (await repo.findByDni(data.dni))
      throw new Error('Ja existeix un entrenador amb aquest DNI');
    if (await repo.findByEmail(data.email))
      throw new Error('Ja existeix un entrenador amb aquest email');
    const doc = await repo.create(data);
    return new Entrenador(doc);
  }

  async updateContact(dni, { especialitat, experiencia, status, reason_denial }) {
    const upd = await repo.update(dni, { especialitat, experiencia, status, reason_denial });
    if (!upd) throw new Error('Entrenador no trobat');
    return new Entrenador(upd);
  }

  async list() {
    return (await repo.findAll()).map(d => new Entrenador(d));
  }

  async remove(dni)  { return await repo.delete(dni); }

  // **Servei per validar entrenadors**
  async validate(dni, approved, motivo) {
    const ent = await repo.findByDni(dni);
    if (!ent) throw new Error('Entrenador no trobat');
    const status = approved ? 'aprobado' : 'rechazado';
    await repo.updateStatus(dni, status, motivo);
    const updated = await repo.findByDni(dni);
    return new Entrenador(updated);
  }
}

module.exports = new EntrenadorService();
