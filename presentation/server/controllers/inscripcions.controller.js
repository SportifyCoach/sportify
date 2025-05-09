const service = require('../../../domain/services/inscripcio.service');

exports.create = async (req, res, next) => {
  const { esportista_dni, sessio_id } = req.body;

  try {
    if (!esportista_dni || !sessio_id) {
      throw new Error('Falten dades obligatòries');
    }

    await service.inscripcio(esportista_dni, sessio_id);
    res.status(201).json({ message: 'Inscripció realitzada correctament' });
  } catch (e) {
    next(e); // gestionat per error handler de express
  }
};

exports.getAll = async (_req, res, next) => {
    try {
      const list = await service.getAll();
      res.json(list);
    } catch (e) {
      next(e);
    }
  };
