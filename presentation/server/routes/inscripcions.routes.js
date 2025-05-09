const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/inscripcions.controller');

/**
 * @openapi
 * /api/inscripcions:
 *   post:
 *     summary: Inscriure un esportista a una sessió
 *     tags:
 *       - Inscripcions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               esportista_dni:
 *                 type: string
 *               sessio_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Inscripció realitzada
 *       400:
 *         description: Error de validació
 */
router.post('/', ctrl.create);

/**
 * @openapi
 * /api/inscripcions:
 *   get:
 *     summary: Llistar totes les inscripcions
 *     tags:
 *       - Inscripcions
 *     responses:
 *       200:
 *         description: Llista d'inscripcions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   esportista_dni:
 *                     type: string
 *                   sessio_id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                   disciplina:
 *                     type: string
 */
router.get('/', ctrl.getAll);

module.exports = router;
