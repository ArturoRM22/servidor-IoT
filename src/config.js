// Utiliza 'dotenv' con require
const dotenv = require('dotenv');
dotenv.config();

// Exporta las variables como propiedades de un objeto
module.exports = {
  PORT: process.env.PORT || 4000,
  USER: process.env.USER || 'root',
  PASSWORD: process.env.PASSWORD || '',
  HOST: process.env.HOST || 'localhost',
  DATABASE: process.env.DATABASE || 'placositos',
  DB_PORT: process.env.DB_PORT || '3306',
};
