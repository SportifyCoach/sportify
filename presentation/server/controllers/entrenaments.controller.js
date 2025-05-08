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