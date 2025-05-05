// presentation/server/routes/esportistes.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/esportistes.controller');

// els noms han de coincidir amb el que exporta el controlador
router.get('/',     ctrl.getAll);
router.post('/',    ctrl.create);
router.put('/:dni', ctrl.update);
router.delete('/:dni', ctrl.remove);

module.exports = router;
