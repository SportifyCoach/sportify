class Entrenador {
  constructor({ 
    dni, nom, cognoms, email, especialitat, experiencia, status, motivo_rebuig 
  }) {
    this.dni           = dni;
    this.nom           = nom;
    this.cognoms       = cognoms;
    this.email         = email;
    this.especialitat  = especialitat;
    this.experiencia   = experiencia;
    this.status        = status   || 'pendent';
    this.motivo_rebuig = motivo_rebuig || null;
  }
}

module.exports = Entrenador;
