/*--------------------------------------------------
  Entitat de domini “pura” (independent de MySQL2)
--------------------------------------------------*/
class Esportista {
    constructor({ dni, nom, cognom, tlf, email }) {
      this.dni = dni;
      this.nom = nom;
      this.cognom = cognom;
      this.tlf = tlf;
      this.email = email;
    }
  }
  
  module.exports = Esportista;
  