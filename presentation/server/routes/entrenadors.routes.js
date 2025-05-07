const { Router } = require('express');
const ctrl = require('../controllers/entrenadors.controller');

const router = Router();
router.post('/', ctrl.create);     // registre
router.get('/',  ctrl.getAll);     // (per proves) llista tots

module.exports = router;
