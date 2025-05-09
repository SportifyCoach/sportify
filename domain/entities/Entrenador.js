class Entrenador {
    constructor({ dni, nom, cognoms, email, especialitat, experiencia }) {
      Object.assign(this, { dni, nom, cognoms, email, especialitat, experiencia });
    }
  }
  module.exports = Entrenador;