const { Schema, model } = require('mongoose');

const EsportistaSchema = new Schema(
  {
    dni:     { type: String, required: true, unique: true },
    //nom:     { type: String, required: true },
    //cognom:  { type: String, required: true },
    tlf:     { type: String, required: true, unique: true },
    email:   { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = model('Esportista', EsportistaSchema);
