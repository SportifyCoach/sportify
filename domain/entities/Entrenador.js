class Entrenador {
    constructor({ id, nom, cognoms, email, especialitat, experiencia, estat }) {
      Object.assign(this, { id, nom, cognoms, email, especialitat, experiencia, estat });
    }
  }
  module.exports = Entrenador;