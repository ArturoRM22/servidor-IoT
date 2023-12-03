const { createPool } = require('mysql2/promise');
const { DB_PORT, USER, DATABASE, PASSWORD, HOST } = require('./config.js');

exports.pool = createPool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  port: DB_PORT
});
