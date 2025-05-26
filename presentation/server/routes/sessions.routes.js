// presentation/server/routes/sessions.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sessions.controller');

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.get('/disponibles', ctrl.getAvailableSessions);
router.get('/valoracions/entrenador/:dni', ctrl.getValoracionsPerEntrenador);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

//router.put('/:dni', ctrl.update); 
//router.delete('/:dni', ctrl.remove); 
router.put('/:id',        ctrl.update);        
router.put('/:id/limit',  ctrl.updateLimit);   
router.put('/:id/valoracio', ctrl.rateSession);
router.put('/:id/valoracio', ctrl.rateSession);
router.delete('/:id/valoracio', ctrl.removeRating);

module.exports = router;
