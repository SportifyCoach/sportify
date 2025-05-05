const { Schema, model } = require('mongoose');

const EsportistaSchema = new Schema(
  {
    dni:     { type: String, required: true, unique: true },
    nom:     { type: String, required: true },
    cognom:  { type: String, required: true },
    email:   { type: String },
    telefon: { type: String },
  },
  { timestamps: true }
);

module.exports = model('Esportista', EsportistaSchema);
