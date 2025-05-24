/*--------------------------------------------------
  Entitat de domini “pura” (independent de MySQL2)
--------------------------------------------------*/
class Disciplina {
    constructor({ nom, espai }) {
      this.nom = nom;
      this.espai = espai;
    }
  }
  
  module.exports = Disciplina;
  