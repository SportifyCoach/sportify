// presentation/server/routes/esportistes.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/esportistes.controller');

// els noms han de coincidir amb el que exporta el controlador
/**
 * @openapi
 * /api/esportistes:
 *   get:
 *     summary: Obtenir tots els esportistes
 *     tags:
 *       - Esportistes
 *     responses:
 *       200:
 *         description: Llista d'esportistes retornada correctament
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', ctrl.getAll);

/**
 * @openapi
 * /api/esportistes:
 *   post:
 *     summary: Crear un nou esportista
 *     tags:
 *       - Esportistes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *               nom:
 *                 type: string
 *               cognom:
 *                 type: string
 *               tlf:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Esportista creat correctament
 */
router.post('/', ctrl.create);

/**
 * @openapi
 * /api/esportistes/{dni}:
 *   put:
 *     summary: Actualitzar dades de contacte d’un esportista
 *     tags:
 *       - Esportistes
 *     parameters:
 *       - in: path
 *         name: dni
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               tlf:
 *                 type: string
 *     responses:
 *       200:
 *         description: Esportista actualitzat correctament
 *       404:
 *         description: Esportista no trobat
 */
router.put('/:dni', ctrl.update);

/**
 * @openapi
 * /api/esportistes/{dni}:
 *   delete:
 *     summary: Eliminar un esportista pel seu DNI
 *     tags:
 *       - Esportistes
 *     parameters:
 *       - in: path
 *         name: dni
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Esportista eliminat correctament
 *       404:
 *         description: Esportista no trobat
 */
router.delete('/:dni', ctrl.remove);

module.exports = router;
