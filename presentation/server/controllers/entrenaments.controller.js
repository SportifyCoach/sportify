/*--------------------------------------------------
  Capa de presentació (adaptadors HTTP)
--------------------------------------------------*/
const service = require('../../../domain/services/entrenament.service');

exports.getAll = async (_req, res, next) => {
    try {
        const list = await service.getAll();
        res.json(list);
    } catch (e) { next(e); }
};

exports.getById = async (_req, res, next) => {
    try {
        const list = await service.getById(_req.params.id);
        res.json(list);
    } catch (e) { next(e); }
};

exports.getBySessionId = async (_req, res, next) => {
    try {
        const list = await service.getBySessionId(_req.params.id);
        res.json(list);
    } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
    console.log('[DEBUG] Body rebut:', req.body)
    try {
        const created = await service.add(req.body);
        res.status(201).json(created);
    } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
    try {
        const updated = await service.update(req.params.id, req.body.valoracio);
        if (updated.affectedRows === 0) {
            return res.status(404).json({ error: "No s'ha trobat l'entrenament." });
        }
        res.status(200).json(updated);
    } catch (e) { next(e); }
};

exports.removeInscripcio = async (req, res) => {
    try {
        const resultat = await service.deleteInscripcio(req.body);
        if (resultat.affectedRows === 0) {
          return res.status(404).json({ error: "No s'ha trobat la inscripció." });
        }
        res.status(200).send('Inscripció eliminada correctament');
    }   catch (err) {
        if (err.status = 404) {
            return res.status(404).json({ error: err.message });
        }
        console.error('Error eliminant inscripció:', err);
        res.status(500).json({ error: 'Error intern del servidor' });
    }
}