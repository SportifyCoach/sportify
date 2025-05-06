/*--------------------------------------------------
  Entitat de domini “pura” (independent de MySQL2)
--------------------------------------------------*/
class Esportista {
    constructor({ dni, nom, cognom, email, telefon }) {
      this.dni = dni;
      this.nom = nom;
      this.cognom = cognom;
      this.email = email;
      this.telefon = telefon;
    }
  }
  
  module.exports = Esportista;
  