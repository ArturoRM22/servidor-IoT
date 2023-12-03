const app = require('./app.js');  // Usa require en lugar de import
const { PORT } = require('./config.js');

app.listen(PORT);
console.log('Server running on port', PORT);
