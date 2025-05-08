/*--------------------------------------------------
  Entitat de domini “pura” (independent de MySQL2)
--------------------------------------------------*/
class Entrenament {
    constructor({ id, valoracio, sessio_id, esportista_dni }) {
        this.id = id;
        this.valoracio = valoracio;
        this.sessio_id = sessio_id;
        this.esportista_dni = esportista_dni;
    }
  }
  
  module.exports = Entrenament;