// presentation/server/routes/entrenaments.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/entrenaments.controller');

// els noms han de coincidir amb el que exporta el controlador
router.get('/',     ctrl.getAll);
router.get('/:id',     ctrl.getBySessionId);
router.post('/',    ctrl.create);

module.exports = router;