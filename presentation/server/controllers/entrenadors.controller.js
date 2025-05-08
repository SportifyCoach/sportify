const service = require('../../../domain/services/entrenador.service');

exports.create = async (req, res, next) => {
  try {
    const ent = await service.add(req.body);
    res.status(201).json(ent);
  } catch (e) { next(e); }
};

exports.getAll = async (_req, res, next) => {
  try {
    res.json(await service.list());
  } catch (e) { next(e); }
};
