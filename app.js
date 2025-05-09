const express = require('express');
const cors = require('cors');
const path = require('path');
const { connect } = require('./data/db');
const esportistesRouter = require('./presentation/server/routes/esportistes.routes.js');
const entrenadorsRouter  = require('./presentation/server/routes/entrenadors.routes.js');
const sessionsRouter = require('./presentation/server/routes/sessions.routes.js');
const inscripcionsRouter = require('./presentation/server/routes/inscripcions.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

/* ---------- Middlewares globals ---------- */
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'presentation', 'web')));

/* ---------- Rutes API ---------- */
app.use('/api/esportistes', esportistesRouter);
app.use('/api/entrenadors', entrenadorsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/inscripcions', inscripcionsRouter);

/* ---------- Gestió d'errors ---------- */
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(400).json({ error: err.message });
});

/* ---------- Inicialització DB ---------- */
connect().catch(e => {
  console.error('Error connectant DB', e);
  process.exit(1);
});

//swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
