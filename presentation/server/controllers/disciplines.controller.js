/*--------------------------------------------------
  Capa de presentació (adaptadors HTTP)
--------------------------------------------------*/
const service = require('../../../domain/services/disciplina.service');

exports.getAll = async (_req, res, next) => {
  try {
    const list = await service.getAll();
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
    const { nom } = req.params;
    const updated = await service.updateSpace(nom, req.body);
    res.json(updated);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const { nom } = req.params;
    await service.remove(nom);
    res.status(204).end();
  } catch (e) { next(e); }
};
