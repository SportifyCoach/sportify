// presentation/server/routes/entrenaments.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/entrenaments.controller');

// els noms han de coincidir amb el que exporta el controlador
router.get('/',     ctrl.getAll);
router.get('/:id',     ctrl.getBySessionId);
router.post('/',    ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/', ctrl.removeInscripcio);

module.exports = router;