const express = require('express');
const cors = require('cors');
const exWs = require('express-ws'); // Importa express-ws
const expressWs = exWs(express());
const app = expressWs.app;


const rutas = require('./routes/placositos.routes.js');
// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', rutas);

// Manejador de errores para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({
    message: 'No se encontró esta ruta',
  });
});

module.exports = app;
