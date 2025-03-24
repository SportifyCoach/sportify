const express = require('express');
const router = express.Router();
const esportistaController = require('../controllers/esportistaController');

router.get('/', esportistaController.getAllEsportistes);
router.post('/', esportistaController.createEsportista);
router.put('/:dni', esportistaController.updateEsportista);


module.exports = router;