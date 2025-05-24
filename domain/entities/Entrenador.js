class Entrenador {
  constructor({ 
    dni, nom, cognoms, email, especialitat, experiencia, status, reason_denial 
  }) {
    this.dni           = dni;
    this.nom           = nom;
    this.cognoms       = cognoms;
    this.email         = email;
    this.especialitat  = especialitat;
    this.experiencia   = experiencia;
    this.status        = status   || 'pendent';
    this.reason_denial = reason_denial || null;
  }
}

module.exports = Entrenador;
