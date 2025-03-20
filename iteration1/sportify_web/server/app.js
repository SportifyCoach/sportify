const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

//Import routes
const esportistaRoutes = require('./routes/esportistes')

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routing
app.use('/esportistes', esportistaRoutes);

module.exports = app;
