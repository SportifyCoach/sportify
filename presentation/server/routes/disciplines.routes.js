// presentation/server/routes/disciplines.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/disciplines.controller');

// els noms han de coincidir amb el que exporta el controlador
/**
 * @openapi
 * /api/disciplines:
 *   get:
 *     summary: Obtenir tots els disciplines
 *     tags:
 *       - Disciplines
 *     responses:
 *       200:
 *         description: Llista d'disciplines retornada correctament
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
 * /api/disciplines:
 *   post:
 *     summary: Crear un nou disciplina
 *     tags:
 *       - Disciplines
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               espai:
 *                 type: string
 *     responses:
 *       201:
 *         description: Disciplina creat correctament
 */
router.post('/', ctrl.create);

/**
 * @openapi
 * /api/disciplines/{nom}:
 *   put:
 *     summary: Actualitzar dades de contacte d’un disciplina
 *     tags:
 *       - Disciplines
 *     parameters:
 *       - in: path
 *         name: nom
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
 *         description: Disciplina actualitzat correctament
 *       404:
 *         description: Disciplina no trobat
 */
router.put('/:nom', ctrl.update);

/**
 * @openapi
 * /api/disciplines/{nom}:
 *   delete:
 *     summary: Eliminar un disciplina pel seu DNI
 *     tags:
 *       - Disciplines
 *     parameters:
 *       - in: path
 *         name: nom
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Disciplina eliminat correctament
 *       404:
 *         description: Disciplina no trobat
 */
router.delete('/:nom', ctrl.remove);

module.exports = router;