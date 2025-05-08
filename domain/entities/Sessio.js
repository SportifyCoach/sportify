/*--------------------------------------------------
  Entitat de domini “pura” (independent de MySQL2)
--------------------------------------------------*/
class Sessio {
    constructor({ date, limit_persones, disciplina, entrenador }) {
      this.date = date;
      this.limit_persones = limit_persones;
      this.disciplina = disciplina;
      this.entrenador = entrenador;
    }
  }
  
  module.exports = Sessio;
  