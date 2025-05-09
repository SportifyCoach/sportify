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

/**
 * @openapi
 * /inscripcions/{id}:
 *   get:
 *     summary: Llista els esportistes inscrits a una sessió si ets l'entrenador
 *     tags:
 *       - Inscripcions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sessió
 *       - in: query
 *         name: dni
 *         required: true
 *         schema:
 *           type: string
 *         description: DNI de l'entrenador que consulta
 *     responses:
 *       200:
 *         description: Llista d'esportistes inscrits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dni:
 *                     type: string
 *                   nom:
 *                     type: string
 *                   cognom:
 *                     type: string
 *       403:
 *         description: No ets l'entrenador d’aquesta sessió
 *       404:
 *         description: Sessió no trobada
 */
router.get('/:id', ctrl.getBySessioIfEntrenador);

module.exports = router;
