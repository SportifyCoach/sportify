const service = require('../../../domain/services/inscripcio.service');
const sessioRepo = require('../../../data/repositories/SessioRepository');
const repo = require('../../../data/repositories/InscripcioRepository');

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

  exports.getBySessioIfEntrenador = async (req, res, next) => {
    try {
      const id = req.params.id;
      const { dni } = req.query;
      const sessio = await sessioRepo.findById(id);
  
      if (!sessio || sessio.entrenador !== dni) {
        return res.status(403).json({ error: 'No ets l’entrenador d’aquesta sessió' });
      }
  
      const llista = await repo.findBySessio(id);
      res.json(llista);
    } catch (e) {
      next(e);
    }
  };
