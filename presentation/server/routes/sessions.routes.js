// presentation/server/routes/sessions.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sessions.controller');

// els noms han de coincidir amb el que exporta el controlador

/**
 * @openapi
 * /api/sessions:
 *   get:
 *     summary: Obtenir totes les sessions
 *     tags:
 *       - Sessions
 *     responses:
 *       200:
 *         description: Retorna la llista de sessions
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
 * /api/sessions:
 *   post:
 *     summary: Crear una nova sessió d'entrenament
 *     tags:
 *       - Sessions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               limit_persones:
 *                 type: integer
 *               disciplina:
 *                 type: string
 *               entrenador:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sessió creada correctament
 */
router.post('/', ctrl.create);

/**
 * @openapi
 * /api/sessions/disponibles:
 *   get:
 *     summary: Llista les sessions disponibles
 *     tags:
 *       - Sessions
 *     parameters:
 *       - in: query
 *         name: disciplina
 *         schema:
 *           type: string
 *       - in: query
 *         name: entrenador
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sessions trobades
 */
router.get('/disponibles', ctrl.getAvailableSessions);

/**
 * @openapi
 * /api/sessions/{id}:
 *   delete:
 *     summary: Eliminar una sessió futura per ID
 *     tags:
 *       - Sessions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la sessió a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Sessió eliminada correctament
 *       400:
 *         description: La sessió no existeix o no és futura
 */
router.delete('/:id', ctrl.remove);

//router.put('/:dni', ctrl.update); // todo update
//router.delete('/:dni', ctrl.remove); // todo delete

module.exports = router;
