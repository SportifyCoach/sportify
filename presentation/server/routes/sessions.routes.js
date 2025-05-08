// presentation/server/routes/sessions.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sessions.controller');

// els noms han de coincidir amb el que exporta el controlador
router.get('/',     ctrl.getAll);
router.post('/',    ctrl.create);
router.put('/:dni', ctrl.update); // todo update
router.delete('/:dni', ctrl.remove); // todo delete

module.exports = router;
