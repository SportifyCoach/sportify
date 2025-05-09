/*--------------------------------------------------
  Capa de presentació (adaptadors HTTP)
--------------------------------------------------*/
const service = require('../../../domain/services/sessio.service');

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

//todo update
exports.update = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const updated = await service.updateContact(dni, req.body);
    res.json(updated);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await service.remove(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

exports.getAvailableSessions = async (req, res, next) => {
  try {
    const filters = {
      disciplina: req.query.disciplina,
      entrenador: req.query.entrenador,
      date: req.query.date,
    };

    const sessions = await service.getAvailable(filters);
    res.json(sessions);
  } catch (e) { next(e); }
};
