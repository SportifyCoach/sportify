const express = require('express');
const router = express.Router();
const esportistaController = require('../controllers/esportistaController');

router.get('/', esportistaController.getAllEsportistes);

module.exports = router;