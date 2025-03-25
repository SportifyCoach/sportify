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

/*
exports.createEsportista = (req, res) => {
    const { dni, tlf, email, nom, cognoms, contrasenya } = req.body;

    if (!dni || !tlf || !email || !nom || !cognoms || !contrasenya) {
        return res.status(400).send('Falten camps obligatoris');
    }

    const query = `
        INSERT INTO esportista (dni, tlf, email, nom, cognoms, contrasenya)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    connection.query(query, [dni, tlf, email, nom, cognoms, contrasenya], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al afegir esportista');
        }
        res.status(201).send('Esportista creat correctament');
    });
};
*/

exports.createEsportista = (req, res) => {
    const { dni, tlf, email} = req.body;

    if (!dni || !tlf || !email) {
        return res.status(400).send('Falten camps obligatoris');
    }

    const query = `
        INSERT INTO esportista (dni, tlf, email)
        VALUES (?, ?, ?)
    `;
    connection.query(query, [dni, tlf, email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al afegir esportista');
        }
        res.status(201).send('Esportista creat correctament');
    });
};

exports.deleteEsportista = (req, res) => {
    const { dni } = req.params;

    connection.query('DELETE FROM esportista WHERE dni = ?', [dni], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al eliminar l\'esportista');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('No s\'ha trobat cap esportista amb aquest DNI');
        }

        res.status(200).send('Esportista eliminat correctament');
    });
};