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

exports.update = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const updated = await service.updateContact(dni, req.body);
    res.json(updated);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(req.params.dni);
    res.status(204).end();
  } catch (e) { next(e); }
};

// **Controlador per validar entrenadors**
exports.validate = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const { approved, motivo } = req.body;
    const entrenador = await service.validate(dni, approved, motivo);
    res.json(entrenador);
  } catch (e) {
    next(e);
  }
};
