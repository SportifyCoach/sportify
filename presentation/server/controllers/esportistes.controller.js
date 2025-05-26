/*--------------------------------------------------
  Capa de presentació (adaptadors HTTP)
--------------------------------------------------*/
const service = require('../../../domain/services/esportista.service');

exports.getAll = async (_req, res, next) => {
  try {
    const list = await service.getAll();
    res.json(list);
  } catch (e) { next(e); }
};

exports.getByDni = async (req, res, next) => {
  try {
    const { dni } = req.params;
    const esportista = await service.getByDni(dni);
    res.json(esportista);
  } catch (e) { next(e); }
}

exports.create = async (req, res, next) => {
  console.log('[DEBUG] Body rebut:', req.body)
  try {
    const created = await service.add(req.body);
    res.status(201).json(created);
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
    const { dni } = req.params;
    await service.remove(dni);
    res.status(204).end();
  } catch (e) { next(e); }
};
