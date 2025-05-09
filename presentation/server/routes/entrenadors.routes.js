const { Router } = require('express');
const ctrl = require('../controllers/entrenadors.controller');

const router = Router();

router.post('/',       ctrl.create);
router.get('/',        ctrl.getAll);
router.delete('/:dni', ctrl.remove);

// Ruta per validar entrenadors
router.post('/:dni/validate', ctrl.validate);

module.exports = router;
