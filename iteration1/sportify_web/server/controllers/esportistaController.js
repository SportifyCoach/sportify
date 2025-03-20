const connection = require('../config/db');

exports.getAllEsportistes = (req, res) => {
    connection.query('SELECT * FROM esportista ORDER BY dni ASC', (err, results) => {
        if (err) {
            res.status(500).send('Error trying to get esportistas');
        } else {
            res.status(200).json(results);
        }
    });
};