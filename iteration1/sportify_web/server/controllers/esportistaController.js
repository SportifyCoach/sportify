const connection = require('../config/db');

exports.getAllEsportistes = (req, res) => {
    connection.query('SELECT * FROM esportista ORDER BY dni ASC', (err, results) => {
        if (err) {
            res.status(500).send('Error trying to get esportistes');
        } else {
            res.status(200).json(results);
        }
    });


};

// Actualizar un deportista por su DNI
exports.updateEsportista = (req, res) => {
    const { dni } = req.params;
    const { email, tlf } = req.body;
  
    const sql = 'UPDATE esportista SET email = ?, tlf = ? WHERE dni = ?';
    connection.query(sql, [email, tlf, dni], (err, result) => {
      if (err) {
        console.error('Error al actualizar el deportista:', err);
        return res.status(500).json({ error: 'Error al actualizar el deportista' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Deportista no encontrado' });
      }
  
      res.status(200).json({ message: 'Deportista actualizado correctamente' });
    });
  };