const { Router } = require('express');
const ctrl = require('../controllers/entrenadors.controller');

const router = Router();
router.post('/', ctrl.create);
router.get('/',  ctrl.getAll);
router.put('/:dni', ctrl.update);
router.delete('/:dni', ctrl.remove);

module.exports = router;
