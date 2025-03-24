const express = require('express');
const router = express.Router();
const esportistaController = require('../controllers/esportistaController');

router.get('/', esportistaController.getAllEsportistes);
router.post('/', esportistaController.createEsportista);

// PUT o PATCH para actualizar un deportista
router.put('/:dni', esportistaController.updateEsportista);


module.exports = router;